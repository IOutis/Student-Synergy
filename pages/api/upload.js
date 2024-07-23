import { createRouter } from 'next-connect';
import multer from 'multer';
import dbConnect from '../../lib/dbconnect';
import ImageModel from '../../models/imageModel';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = createRouter();

router.use(upload.single('upload'));

router.post(async (req, res) => {
  await dbConnect();

  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({ message: "File is required" });
      return;
    }

    const imageData = file.buffer;
    const contentType = file.mimetype;

    const newImage = new ImageModel({
      imageData,
      contentType,
    });

    const savedImage = await newImage.save();
    const imageUrl = `/api/image/${savedImage._id}`;

    res.status(201).json({
      url: imageUrl,
      uploaded: true,
    });
  } catch (error) {
    console.error("Error uploading image:", error.message);
    res.status(500).json({ message: error.message });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default router.handler();
