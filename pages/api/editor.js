import { createRouter } from 'next-connect';
import multer from 'multer';
import dbConnect from '../../lib/dbconnect';
import EditorData from '../../models/editorDataModel';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = createRouter();

// Use multer to handle multipart/form-data
router.use(upload.none()); // Use .none() since you're not uploading files here

router.post(async (req, res) => {
  await dbConnect();

  try {
    const { content, user } = req.body;

    if (!content || !user) {
      throw new Error("Content and user fields are required");
    }

    const newEditorData = new EditorData({
      user,
      content,
    });

    const savedData = await newEditorData.save();
    res.status(201).json(savedData);
  } catch (error) {
    console.error("Error saving data:", error.message);
    res.status(500).json({ message: error.message });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default router.handler();
