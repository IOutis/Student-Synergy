// pages/api/user.js
import User from '../../models/User';
import Community from '../../models/CommunityModel';
import dbConnect from '../../lib/dbconnect';

export default async (req, res) => {
  await dbConnect();

  const { email } = req.query;

  try {
    // Find the user by email
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the communities created by the user
    const communitiesCreated = await Community.find({ adminEmail: email });

    // Find the communities that the user has joined
    const communitiesJoined = await Community.find({ members: { $in: [email] } });
    //console.log("Communitites joined : ", communitiesJoined)

    res.status(200).json({ user, communitiesCreated, communitiesJoined });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
