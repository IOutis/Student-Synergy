import dbConnect from "../../lib/dbconnect";
import EditorData from "../../models/editorDataModel";
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
        
        const note = await EditorData.findById(id);
        if (note.files && note.files.length > 0) {
            await FileModel.deleteMany({ _id: { $in: note.files } });
        }
        const note_deleted = await EditorData.findByIdAndDelete(id)
        res.status(200).json(note);
        
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
