import dbConnect from '../../../lib/dbconnect';
import Community from '../../../models/CommunityModel';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await dbConnect();

    const { communityId, userEmail } = req.body;

    if (!communityId || !userEmail) {
      return res.status(400).json({ error: 'Community ID and User Email are required' });
    }

    try {
      // Find the community
      const community = await Community.findById(communityId);

      if (!community) {
        return res.status(404).json({ error: 'Community not found' });
      }

      // Find the user and add the community to their joined list
      const user = await User.findOne({ email: userEmail });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if(!community.members.includes(userEmail)){
        community.members.push(userEmail);
        await community.save();
      }
    //   console.log(community.members)

      res.status(200).json({ message: 'Joined community successfully' });
    } catch (error) {
        console.log("ERROR in joining: ",error)
      res.status(500).json({ error: 'Error joining community' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
