// pages/api/communities/join.js

import dbConnect from '../../../lib/dbconnect';
import Community from '../../../models/CommunityModel';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { communityId, userEmail } = req.body;
    console.log("request.body = ",req.body);
    if (!communityId || !userEmail) {
      
      return res.status(400).json({ error: 'Community ID and User Email are required' });
    }

    try {
      const community = await Community.findById(communityId);

      if (!community) {
        return res.status(404).json({ error: 'Community not found' });
      }

      // Check approval type
      console.log("Community : ",community.approvalType);
      if (community.approvalType === 'manual') {
        console.log("Community : ",community.approvalType);
        // Add user email to joinRequests array
        if (!community.joinRequests.includes(userEmail)) {
          community.joinRequests.push(userEmail);
          await community.save();
        }
        return res.status(200).json({ message: 'Join request submitted. Awaiting approval.' });
      } else {
        // Automatic approval: directly add user to members
        if (!community.members.includes(userEmail)) {
          community.members.push(userEmail);
          await community.save();
        }
        return res.status(200).json({ message: 'Successfully joined the community!' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error handling join request' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
