import fs from 'fs';
import path from 'path';
import FileModel from '../../models/fileModel';
import { createRouter } from 'next-connect';
import dbConnect from '../../lib/dbconnect';

const router = createRouter();

router.get(async (req, res) => {
    await dbConnect();

    const { fileId } = req.query;

    try {
        const file = await FileModel.findById(fileId);

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        const filePath = path.join(process.cwd(), file.path);

        res.setHeader('Content-Type', file.contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error downloading file' });
    }
});

export default router.handler();
