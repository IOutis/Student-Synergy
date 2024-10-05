import dbConnect from "../../lib/dbconnect";
import FileModel from "../../models/fileModel";
import { createRouter } from "next-connect";
const router = createRouter()

router.delete(async (req, res)=>{
    await dbConnect();
    try{
        const {id} = req.query;
        if(!id){
            return res.status(400).json({success: false, message: "Please provide id."});
        }
        
        const file = await FileModel.findByIdAndDelete(id);
    
        res.status(200).json({message:"deleted successfully"});
        
        }catch(err){
            console.log(err);
            res.status(500).json(err);
            
    }
});
export default router.handler({
    onError: (err, req, res) => {
        res.status(500).json({
            message: err.message,
            });
            },
            });
