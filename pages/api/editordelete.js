import dbConnect from "../../lib/dbconnect";
import EditorData from "../../models/editorDataModel";

import { createRouter } from "next-connect";

const router = createRouter()

router.delete(async (req, res)=>{
    await dbConnect();
    try{
        const {id} = req.query;
        if(!id){
            return res.status(400).json({success: false, message: "Please provide id."});
        }
        const editorData = await EditorData.findByIdAndDelete(id);
        res.status(200).json(editorData);
        
        }catch(err){
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
