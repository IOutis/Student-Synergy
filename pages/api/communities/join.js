import dbConnect from '../../../lib/dbconnect';
import Community from '../../../models/CommunityModel';

const COMMUNITY_CACHE = new Map();

export default async function handler(req, res) {
  console.log("IN Join API");

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { communityId, userEmail } = req.query;
  if (!communityId || !userEmail) {
    return res.status(400).json({ error: 'Community ID and User Email are required' });
  }

  try {
    // Connect to DB once per request
    await dbConnect();

    let community = COMMUNITY_CACHE.get(communityId);

    if (!community) {
      community = await Community.findById(communityId).lean().exec();
      if (!community) {
        throw new Error('Community not found');
      }
      COMMUNITY_CACHE.set(communityId, community);
    }

    console.log("Community = ", community);

    // Process join request asynchronously
    process.nextTick(async () => {
      try {
        await dbConnect();
        
        const result = await Community.findByIdAndUpdate(
          communityId,
          community.approvalType === 'manual'
            ? { $addToSet: { joinRequests: userEmail } }
            : { $addToSet: { members: userEmail } },
          { new: true }
        );

        console.log("Updated community:", result);
      } catch (error) {
        console.error('Error processing join request:', error);
      }
    });

    // Send immediate response
    res.status(200).json({
      message: community.approvalType === 'manual'
        ? 'Join request submitted. Awaiting approval.'
        : 'Successfully joined the community!'
    });
  } catch (error) {
    console.error('Error handling join request', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
