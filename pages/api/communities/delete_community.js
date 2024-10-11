import Community from '../../../models/CommunityModel'
// import Section from '../../../models/SectionsModel'
// import PostData from '../../../models/Comm_Post'
import dbConnect from '../../../lib/dbconnect'
import { deleteSectionById } from './section_delete' 
const handleDeleteCommunity=async(req,res)=>{
    await dbConnect()
    try{
        if (req.method === 'DELETE') {
        const {id}=req.query
        const community = await Community.findById(id).populate('sections')
        if (!community) {
            return res.status(404).json({ success: false, message: 'community not found' });
        }
        const sectionids = community.sections.map(section=>section._id)
        for (const sectionId of sectionids) {
            const result = await deleteSectionById(sectionId);
    
            // If the section deletion fails, stop and return an error response
            if (!result.success) {
              return res.status(500).json({ success: false, message: `Failed to delete section with ID ${sectionId}: ${result.message}` });
            }
        }
        await Community.findByIdAndDelete(id);

        return res.status(200).json({ success: true, message: 'Community and its sections deleted successfully' });
      } else {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Error deleting community', error });
    }
 
}
  export default handleDeleteCommunity;
  

  