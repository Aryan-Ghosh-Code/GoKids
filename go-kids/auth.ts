import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
