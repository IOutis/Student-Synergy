import dbConnect from "../../../lib/dbconnect";
import PostData from "../../../models/Comm_Post";
import { createRouter } from "next-connect";
import { getServerSession } from "next-auth";
import Nextauth from "../auth/[...nextauth]";

const router = createRouter();

const handleLikesHandler = async (req, res) => {
    const { id, likeflag} = req.query;
    const likeFlag = req.query.likeflag === 'true'; // Parse to boolean

    // console.log("query = ",req.query)
    // console.log("likeflag = ",likeflag)
    const session = await getServerSession(req, res, Nextauth);

    if (!session || !session.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    const user = session.user.name;
    await dbConnect()

    try {
        const post = await PostData.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        // console.log(post.likedBy)
        if (!post.likedBy.includes(user) && !likeFlag){
            post.likedBy.push(user);
            const updatedPost = await PostData.findOneAndUpdate(
                { _id: post._id }, 
                { $inc: { likes: 1 }, $addToSet: { likedBy: user }}, 
                { new: true } 
            );
            res.json(updatedPost);
        }
        else if (likeFlag){
            post.likedBy = post.likedBy.filter((user) => user !== session.user.name
            );
            const updatedPost = await PostData.findOneAndUpdate(
                { _id: post._id },
                { $inc: { likes: -1 }, $pull: { likedBy: user }},
                { new: true } 
                );
                res.json(updatedPost);
        }
        else{
            return res.json(post)
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error updating likes", error: err.message });
    }
};

router.patch(handleLikesHandler);

export default router.handler();
