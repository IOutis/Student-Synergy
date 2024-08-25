import { google } from 'googleapis';
import multer from 'multer';
import streamifier from 'streamifier'; // Import streamifier
import { getServerSession } from 'next-auth';
import dbConnect from '../../lib/dbconnect';
import FileModel from '../../models/fileModel';
import EditorData from '../../models/editorDataModel';
import Nextauth from "./auth/[...nextauth]";
import { createRouter } from 'next-connect';

const storage = multer.memoryStorage(); // Use memory storage
const upload = multer({ storage });

const router = createRouter();

router.use(upload.single('file')); // Handle single file upload

// Initialize Google Drive API
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_ID,
    process.env.GOOGLE_SECRET,
    "http://localhost:3000/api/auth/callback/google", // Use this for local development
);


oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
});

const drive = google.drive({ version: 'v3', auth: oauth2Client });

router.post(async (req, res) => {
    await dbConnect(); // Ensure the database is connected
    const session = await getServerSession(req, res, Nextauth);

    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { noteId } = req.body;
    const note = await EditorData.findById(noteId);

    if (!note) {
        return res.status(404).json({ message: 'Note not found' });
    }

    try {
        // Convert the buffer to a readable stream
        const bufferStream = streamifier.createReadStream(req.file.buffer);

        // Upload file to Google Drive
        const fileMetadata = {
            name: req.file.originalname,
            // parents: ['Student Synergy Files'] // Optional: specify a folder in Google Drive
        };

        const media = {
            mimeType: req.file.mimetype,
            body: bufferStream // Pass the stream instead of the buffer
        };

        const fileResponse = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, name, mimeType, webViewLink'
        });

        // Save file reference in MongoDB
        const file = new FileModel({
            note: noteId,
            user: session.user.email,
            filename: fileResponse.data.name,
            contentType: fileResponse.data.mimeType,
            path: fileResponse.data.id, // Store Google Drive file ID instead of path
            url: fileResponse.data.webViewLink // Optional: store the file's web link
        });

        await file.save();

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
