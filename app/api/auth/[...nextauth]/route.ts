import { connectToDB } from "@/lib/connectToDB";
import User from "@/models/user.model";
import NextAuth, { NextAuthOptions } from "next-auth";
import Email from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      await connectToDB();
      if (user?.email) {
        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          dbUser = await User.create({
            email: user.email,
            firstName: user.name?.split(" ")[0],
            lastName: user.name?.split(" ")[1],
            avatar: user.image,
            isEmailVerified: true,
          });
        }
        token.userId = dbUser._id;
      }
      return token;
    },
  },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
