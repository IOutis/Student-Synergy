// PUT /api/communities/:id/approvalType
import Community from '../../../../models/CommunityModel'
const changeApprovalType = async (req, res) => {
    const { id } = req.query;
    const { approvalType, password } = req.body;
  
    try {
      const community = await Community.findById(id);
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }
  
      // Update approval type and password (if applicable)
      community.approvalType = approvalType;
  
      if (approvalType === 'password') {
        if (!password || password.length < 6) {
          return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        community.password = password;
      } else {
        community.password = null; // Reset password if not needed
      }
  
      await community.save();
      res.status(200).json({ message: 'Approval type updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating approval type', error: error.message });
    }
  };

  export default changeApprovalType;
  