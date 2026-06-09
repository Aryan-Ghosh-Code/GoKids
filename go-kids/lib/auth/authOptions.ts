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
      // clientId: process.env.GOOGLE_CLIENT_ID,
      clientId: process.env.GOOGLE_CLIENT_ID ?? "dummy_google_client_id",
      // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "dummy_google_client_secret",
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
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }

      // For Google sign-in, fetch role from DB (not on the OAuth user object)
      if (account?.provider === "google" && token.email) {
        try {
          await connectDB();
          const dbUser = await User.findOne({
            email: (token.email as string).toLowerCase(),
          });
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.role = dbUser.role;
          }
        } catch {
          // Non-fatal: token will still work, just without role
        }
      }

      return token;
    },

    // ── Session: expose id + role on session.user ─────────────────
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
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

  // secret: process.env.NEXTAUTH_SECRET,
  secret: "dummy_nextauth_secret_for_local_and_build",
};
