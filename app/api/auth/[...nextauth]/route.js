import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { connectToDb } from "@utils/database";
import User from "@models/user";


const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      console.log("Inside signin callback");
      try {
        await connectToDb();
        console.log("Connected to DB");
        const userExists = await User.findOne({ email: profile.email });
        console.log("User exists:", userExists);
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
          });
          console.log("User created");
        }
        return true;
      } catch (error) {
        console.error("Error in signin callback:", error);
        return false;
      }
    },
    async session({ session }) {
     
      try {
        const sessionUser = await User.findOne({ email: session.user.email });
        session.user.id = sessionUser._id.toString();
        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        throw error;
      }
    },
  },
});


export { handler as GET, handler as POST };
