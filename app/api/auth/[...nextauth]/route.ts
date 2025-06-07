import { connectToDB } from "@/lib/connectToDB";
import User, { TUser } from "@/models/user.model";
import NextAuth, { NextAuthOptions } from "next-auth";
import Email from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token, user }) {
      console.log({ session, token: token.provider, user });
      const cookieStore = await cookies();
      await connectToDB();
      const currentUser = await User.findOne({
        email: session.user?.email,
      }).lean<TUser>();

      if (currentUser) {
        const token = jwt.sign(
          currentUser._id.toString(),
          process.env.JWT_SECRET!
        );
        cookieStore.set("token", token, {
          sameSite: "strict",
        });
      } else {
        const newUser = await User.create({
          email: session.user?.email,
          firstName: session.user?.name?.split(" ")[0],
          lastName: session.user?.name?.split(" ")[1],
          avatar: session.user?.image,
          isEmailVerified: true,
        });
        const token = jwt.sign(newUser._id.toString(), process.env.JWT_SECRET!);
        cookieStore.set("token", token, {
          sameSite: "strict",
        });
      }
      console.log({ session, token, user });
      return session;
    },

    async redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
