import { createRouter } from 'next-connect';
import multer from 'multer';
import dbConnect from '../../../lib/dbconnect';
import PostData from '../../../models/Comm_Post';
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = createRouter();

// Use multer to handle multipart/form-data
router.use(upload.none()); // Use .none() since you're not uploading files here

router.post(async (req, res) => {
  await dbConnect();

  try {
    const { content, user, title,keywords } = req.body;
    console.log(title);
    if (!content || !user || !title || !keywords) {
      throw new Error("Content and user fields are required");
    }

    const newPostData = new PostData({
      user,
      content,
      title,
      keywords,
    });

    const savedData = await newPostData.save();
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
