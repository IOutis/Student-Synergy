import { createRouter } from 'next-connect';
import dbConnect from '../../../lib/dbconnect'; // Adjust the path if necessary
import ImageModel from '../../../models/imageModel'; // Adjust the path if necessary

const router = createRouter();

router.get(async (req, res) => {
  await dbConnect();

  try {
    const { id } = req.query;

    const image = await ImageModel.findById(id);
    if (!image) {
      res.status(404).send('Image not found');
      return;
    }

    res.setHeader('Content-Type', image.contentType);
    res.send(image.imageData);
  } catch (error) {
    console.error("Error fetching image:", error.message);
    res.status(500).send('Internal server error');
  }
});

export default router.handler();
