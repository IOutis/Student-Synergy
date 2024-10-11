import Section from '../../../models/SectionsModel'
import dbConnect from '../../../lib/dbconnect'
import PostData from '../../../models/Comm_Post'
import Community from '../../../models/CommunityModel'




export const deleteSectionById = async(id)=>{
    await dbConnect()
    try{
        
            const section = await Section.findById(id).populate('posts'); 

            if (!section) {
                return { success: false, message: 'Section not found' };
            }
            const postids = section.posts.map(post=>post._id)
            const posts = await PostData.deleteMany({ _id: { $in: postids }})
            await Section.findByIdAndDelete(id);
            await Community.updateMany(
                { sections: id },  // Communities where the section ID exists
                { $pull: { sections: id } }  // Pull (remove) the section ID from the array
              );
            
        return { success: true, message: 'Section and associated posts deleted successfully' };  
        
    }
    catch(error){
        return { success: false, message: 'Error deleting section', error };
    }
}
const handleDelete = async(req,res)=>{
    await dbConnect()
    try{
        if(req.method ==='DELETE'){
            const id = req.query.id
            const section = await Section.findById(id).populate('posts'); 

            if (!section) {
                return res.status(404).json({ success: false, message: 'section not found' });
            }
            const postids = section.posts.map(post=>post._id)
            const posts = await PostData.deleteMany({ _id: { $in: postids }})
            await Section.findByIdAndDelete(id);
            await Community.updateMany(
                { sections: id },  // Communities where the section ID exists
                { $pull: { sections: id } }  // Pull (remove) the section ID from the array
              );
            
            return res.status(200).json({ success: true, message: 'section deleted successfully'})

        }
    }
    catch(error){
        console.error(error)
        return res.status(500).json({error:"Error deleting section : ",error})
    }
}

export default handleDelete;
