import mongoose from 'mongoose';
// import EditorData from '../../../models/editorDataModel';
import PostData from '../../../models/Comm_Post';
import FileModel from '../../../models/fileModel';
import { createRouter } from 'next-connect';
import dbConnect from '../../../lib/dbconnect';
import { getServerSession } from 'next-auth';
import Nextauth from "../auth/[...nextauth]";

const router = createRouter();

router.get(async (req, res) => {
    await dbConnect();
    const session = await getServerSession(req, res, Nextauth);

    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.query; // Assuming you pass noteId as a query parameter
    const noteId = id;
    try {
        const post = await PostData.findById(noteId).populate('fileIds');
        console.log("post =",post)
        if (!post) {
            console.log("NOTE NOT FOUND!!!")
            return res.status(404).json({ message: 'Note not found' });
        }

        // Construct URLs for file downloads
        const filesWithUrls = post.fileIds.map(file => ({
            filename: file.filename,
            url: `/api/download_file?fileId=${file._id}`, // You can create a download route
        }));

        res.status(200).json({ files: filesWithUrls });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving note' });
    }
});

export default router.handler();
