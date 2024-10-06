//pages/api/communities/[id].js
// pages/api/communities/[id].js
import dbConnect from '../../../lib/dbconnect';
import Community from '../../../models/CommunityModel';

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      // Fetch the community by ID
      const community = await Community.findById(id);

      if (!community) {
        return res.status(404).json({ error: 'Community not found' });
      }
      // console.log("Saved Posts",community.posts)
      // Return the community data
      res.status(200).json(community);
    } catch (error) {
      console.error('Error fetching community data:', error);
      res.status(500).json({ error: 'Error fetching community data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
