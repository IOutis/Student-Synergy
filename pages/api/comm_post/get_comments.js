import { createRouter } from "next-connect";
import dbConnect from "../../../lib/dbconnect";
import Comment from '../../../models/Comments';

const router = createRouter();

router.get(async (req,res)=>{
    await dbConnect();
    try{
    const {postId} = req.query;
    console.log("Post ID = ",postId);
    const comments = await Comment.find({postId:postId}).sort({createdAt:-1});
    res.json(comments);
    }catch(error){
        console.log("error in fetching comments : ",error);
        res.status(500).json({message:"Internal server Error :",error});
    }
});

export default router.handler();
