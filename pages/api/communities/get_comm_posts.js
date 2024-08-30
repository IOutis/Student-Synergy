import { createRouter } from 'next-connect';
import dbConnect from '../../../lib/dbconnect';
import PostData from '../../../models/Comm_Post';

const router = createRouter();

router.get(async (req, res) => {
  await dbConnect();
  const { ids } = req.query; // Expecting ids as a comma-separated string

  try {
    const idsArray = ids.split(','); // Convert the string to an array
    const posts = await PostData.find({ _id: { $in: idsArray } });
    // console.log(posts)
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    res.status(500).json({ message: error.message });
  }
});

export default router.handler();
