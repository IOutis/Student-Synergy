// PUT /api/communities/:id/removeMember
import Community from '../../../../models/CommunityModel'
const removeMember = async (req, res) => {
  const { id } = req.query;
  const { memberEmail } = req.body;

  try {
    const community = await Community.findById(id);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Remove member from the members list
    community.members = community.members.filter(member => member !== memberEmail);

    await community.save();
    res.status(200).json({ message: 'Member removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing member', error: error.message });
  }
};
export default removeMember;