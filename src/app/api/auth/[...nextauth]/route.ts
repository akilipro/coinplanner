import NextAuth from "next-auth";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import { User } from "@/lib/user-model";
import bcrypt from "bcryptjs";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb-client";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isSignUp: { label: "SignUp", type: "hidden" },
      },
      async authorize(credentials, req) {
        await dbConnect();
        const username = credentials?.username;
        const email = credentials?.email;
        const password = credentials?.password;
        const isSignUp = credentials?.isSignUp;
        if (isSignUp === "true") {
          // Registration flow
          if (!username || !email || !password) return null;
          const existingUser = await User.findOne({
            $or: [{ email }, { username }],
          });
          if (existingUser) {
            throw new Error("Email or username already exists");
          }
          const hashed = await bcrypt.hash(password, 10);
          const user = await User.create({ username, email, password: hashed });
          return { id: user._id, name: user.username, email: user.email };
        } else {
          // Login flow
          if (!email || !password) return null;
          const user = await User.findOne({ email });
          if (!user) return null;
          const valid = await bcrypt.compare(password, user.password);
          if (!valid) return null;
          return { id: user._id, name: user.username, email: user.email };
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session?.user) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
import { NextResponse } from "next/server";

// CORS preflight handler
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
