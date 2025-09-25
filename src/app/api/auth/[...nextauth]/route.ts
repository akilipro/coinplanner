import NextAuth from "next-auth";
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
        const { username, email, password, isSignUp } = credentials;
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
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
