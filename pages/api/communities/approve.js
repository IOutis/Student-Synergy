// pages/api/communities/approve.js

import dbConnect from '../../../lib/dbconnect';
import Community from '../../../models/CommunityModel';
import User from '../../../models/User';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { communityId, userEmail } = req.body;

    if (!communityId || !userEmail) {
      return res.status(400).json({ error: 'Community ID and User Email are required' });
    }

    try {
      const community = await Community.findById(communityId);

      if (!community) {
        return res.status(404).json({ error: 'Community not found' });
      }

      // Remove the email from joinRequests
      community.joinRequests = community.joinRequests.filter(email => email !== userEmail);

      // Add the user to the members list
      if (!community.members.includes(userEmail)) {
        community.members.push(userEmail);
        await community.save();
      }

      // Optionally, update the user's joined communities
      const user = await User.findOne({ email: userEmail });
      if (user && !user.communityIds.includes(communityId)) {
        user.communityIds.push(communityId);
        await user.save();
      }

      res.status(200).json({ message: 'User approved and added to the community' });
    } catch (error) {
      res.status(500).json({ error: 'Error approving user' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
