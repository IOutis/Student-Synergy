import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import dbConnect from '../../lib/dbconnect';
import FileModel from '../../models/fileModel';
import Nextauth from "./auth/[...nextauth]";
import { createRouter } from 'next-connect';

const router = createRouter();

// Initialize Google Drive API
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_ID,
    process.env.GOOGLE_SECRET,
    process.env.GOOGLE_REDIRECT_URI, // Same as before
);

oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
});

const drive = google.drive({ version: 'v3', auth: oauth2Client });

router.get(async (req, res) => {
    await dbConnect(); // Ensure the database is connected
    const session = await getServerSession(req, res, Nextauth);

    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { fileId } = req.query; // Get the file ID from the query parameter

    try {
        const file = await FileModel.findById(fileId);

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Fetch file from Google Drive
        const driveResponse = await drive.files.get(
            { fileId: file.path, alt: 'media' },
            { responseType: 'stream' }
        );

        // Set appropriate headers for the file download
        res.setHeader('Content-Type', file.contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);

        // Pipe the file stream to the response
        driveResponse.data.pipe(res);
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ error: 'Error downloading file' });
    }
});

export default router.handler();
