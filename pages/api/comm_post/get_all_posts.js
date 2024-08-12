import { createRouter } from 'next-connect';
import dbConnect from '../../../lib/dbconnect';
import PostData from '../../../models/Comm_Post';

const router = createRouter();

router.get(async (req, res) => {
  await dbConnect();
  
  try {
    const posts = await PostData.find().sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    res.status(500).json({ message: error.message });
  }
});

export default router.handler();
