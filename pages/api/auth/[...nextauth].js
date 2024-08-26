import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import mongoose from 'mongoose';
import User from '../../../models/User'; // Import your User model

// Ensure Mongoose is connected
const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  return mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Connect to the database
      await connectToDatabase();

      // Check if the user already exists
      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        // If user doesn't exist, create a new one
        await User.create({
          email: user.email,
          name: user.name,
        }).then(console.log("Done"));
      }

      // Return true to indicate successful sign-in
      return true;
    },
    async session({ session, token, user }) {
      // Connect to the database
      await connectToDatabase();

      // Update session object with additional information if needed
      const dbUser = await User.findOne({ email: session.user.email });
      if (dbUser) {
        session.user.id = dbUser._id;
        session.user.level = dbUser.level;
        session.user.coins = dbUser.coins;
      }

      return session;
    },
  },
});
