// pages/api/user.js
import User from '../../models/User';
import Community from '../../models/CommunityModel';
import dbConnect from '../../lib/dbconnect'

export default async (req, res) => {
  await dbConnect();

  const {email} = req.query; 
//   console.log("REQ = ",email  );
  const user = await User.findOne({ email: email });
//   console.log("User = ",user)
  const communitiesCreated = await Community.find({ adminEmail: email });
  const communitiesJoined = user.communityIds;

  res.status(200).json({ user, communitiesCreated, communitiesJoined });
};
