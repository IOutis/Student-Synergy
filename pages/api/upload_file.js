import multer from 'multer';
import mongoose from 'mongoose';
import FileModel from '../../models/fileModel';
import EditorData from '../../models/editorDataModel';
import { getSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import dbConnect from '../../lib/dbconnect';
import { createRouter } from 'next-connect';
import Nextauth from "./auth/[...nextauth]";
import User from '../../models/User'
const storage = multer.memoryStorage();
const upload = multer({ storage });
 // Store files temporarily in the 'uploads' folder

const router = createRouter();

router.use(upload.single('file')); // Handle single file upload

router.post(async (req, res) => {
    await dbConnect(); // Ensure the database is connected
    const session = await getServerSession(req, res, Nextauth);

    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { noteId } = req.body; // Extract noteId from request body
    const note = await EditorData.findById(noteId);

    if (!note) {
        return res.status(404).json({ message: 'Note not found' });
    }

    const file = new FileModel({
        note: noteId,
        user: session.user.email, // Assuming you store user ID in the session
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        path: req.file.path, // The file's temporary path in the 'uploads' folder
    });

    try {
        await file.save();

        // Optionally, update the note to include reference to the file (if needed)
        // console.log("note : ",note)
        note.files.push(file._id);
        await note.save();

        res.status(201).json({ message: 'File uploaded successfully', file });
    } catch (error) {
      console.error(error);
        res.status(500).json({ error: `Error saving file: ${error.message}` });
    }
});

export default router.handler();

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, since we are using multer
    },
};
