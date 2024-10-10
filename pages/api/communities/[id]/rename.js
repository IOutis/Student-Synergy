// PUT /api/communities/:id/rename
import Community from '../../../../models/CommunityModel'

const renameCommunity = async (req, res) => {
    const { id } = req.query;
    const { name } = req.body;
  
    try {
      const community = await Community.findById(id);
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }
  
      // Update community name
      community.name = name;
      await community.save();
  
      res.status(200).json({ message: 'Community renamed successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error renaming community', error: error.message });
    }
  };
  
export default renameCommunity;
  