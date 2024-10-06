import dbConnect from '../../../lib/dbconnect';
import Community from '../../../models/CommunityModel';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST' || req.method === 'GET') {
    const { communityId, userEmail } = req.method === 'POST' ? req.body : req.query;

    if (!communityId || !userEmail) {
      return res.status(400).json({ error: 'Community ID and User Email are required' });
    }

    try {
      const community = await Community.findById(communityId);

      if (!community) {
        return res.status(404).json({ error: 'Community not found' });
      }
      console.log("Community : ",community)
      console.log("Community approval : ",community.approvalType)

      // Check approval type
      if (community.approvalType === 'manual') {
        // Add user email to joinRequests array
        if (!community.joinRequests.includes(userEmail)) {
          community.joinRequests.push(userEmail);
          await community.save();
        }
        return res.status(200).json({ message: 'Join request submitted. Awaiting approval.' });
      } else if (community.approvalType === 'automatic') {
        // Automatic approval: directly add user to members
        if (!community.members.includes(userEmail)) {
          community.members.push(userEmail);
          await community.save();
        }
        return res.status(200).json({ message: 'Successfully joined the community!' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Error handling join request' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
