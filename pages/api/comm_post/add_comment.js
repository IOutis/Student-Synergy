// pages/api/comm_post/add_comment.js
import mongoose from 'mongoose';
import dbConnect from '../../../lib/dbconnect';
import PostData from '../../../models/Comm_Post';
import Comment from '../../../models/Comments';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        const { postId, content, user, email,parentId=null } = req.body;
        const postId_obj = mongoose.Types.ObjectId.createFromHexString(postId)
        console.log("parent id =",parentId);

        try {
            const newComment = await Comment.create({ postId, content: content, user, email,parentId });
            if(!parentId){
            await PostData.findByIdAndUpdate(postId, { $push: { comments: newComment._id } });
            }
            res.status(201).json(newComment);
        } catch (error) {
            console.log("ERROR IN COMMENT REPLYING PART :",error)
            res.status(500).json({ message: 'Failed to add comment', error });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
