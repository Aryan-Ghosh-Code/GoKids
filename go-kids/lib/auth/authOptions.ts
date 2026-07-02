import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";

export const authOptions: NextAuthConfig = {
  providers: [
    // ── Google OAuth ─────────────────────────────────────────────
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // ── Email/Password ───────────────────────────────────────────
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();

        const user = await User.findOne({
          email: (credentials.email as string).toLowerCase(),
        });

        if (!user) return null;
        if (!user.isEmailVerified) return null;
        if (user.isSuspended) return null;
        // Reject Google-only users trying to use credentials
        if (user.provider === "google" && !user.passwordHash) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    // ── signIn: upsert Google users into MongoDB ─────────────────
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectDB();

          const existingUser = await User.findOne({
            email: user.email!.toLowerCase(),
          });

          if (!existingUser) {
            // First Google sign-in → create account
            await User.create({
              name: user.name ?? "Go Kids User",
              email: user.email!.toLowerCase(),
              passwordHash: "",
              provider: "google",
              role: "parent",
              isEmailVerified: true,
              isSuspended: false,
            });
          } else if (existingUser.isSuspended) {
            return false; // Deny suspended users
          }
          // Existing user → allow sign in (email already verified via Google)
          return true;
        } catch (err) {
          console.error("Google signIn callback error:", err);
          return false;
        }
      }
      // Credentials provider — default allow
      return true;
    },

    // ── JWT: attach role + id to token ───────────────────────────
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        // Record when this token was issued so we can invalidate it after a
        // password reset (iat is set by the JWT library but we mirror it here
        // as an explicit numeric second timestamp for our own checks).
        token.issuedAt = Math.floor(Date.now() / 1000);
      }

      // Fetch role + id from DB if not already present in the token (handles
      // Google sign-in and older active sessions).
      // Also validate passwordChangedAt — if the user reset their password
      // after this JWT was issued, kill the session.
      if (token.email) {
        try {
          await connectDB();
          const dbUser = await User.findOne(
            { email: (token.email as string).toLowerCase() },
            "role _id passwordChangedAt photoUrl"
          );
          if (dbUser) {
            // Backfill role/id if missing (first sign-in or legacy token)
            if (!token.role || !token.id) {
              token.id = dbUser._id.toString();
              token.role = dbUser.role;
            }

            // Always sync the latest photoUrl so navbar stays current
            token.picture = dbUser.photoUrl ?? token.picture ?? null;

            // Invalidate token if password was changed after it was issued
            if (dbUser.passwordChangedAt) {
              const changedAtSeconds = Math.floor(
                dbUser.passwordChangedAt.getTime() / 1000
              );
              const issuedAt = (token.issuedAt as number) ?? (token.iat as number) ?? 0;
              if (issuedAt < changedAtSeconds) {
                // Return null to signal NextAuth to clear the session
                return null as unknown as typeof token;
              }
            }
          }
        } catch (err) {
          console.error("Failed to fetch user role/id for token:", err);
        }
      }

      return token;
    },

    // ── Session: expose id + role + photo on session.user ────────
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
        // Expose photoUrl as session.user.image (Next-Auth standard field)
        if (token.picture) {
          session.user.image = token.picture as string;
        }
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
};
