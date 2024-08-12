import { createRouter } from 'next-connect';
import dbConnect from '../../../lib/dbconnect';
import PostData from '../../../models/Comm_Post';

const router = createRouter();

router.get(async (req, res) => {
  await dbConnect();
  
  try {
    const user = req.query.user; // Pass the user email as a query parameter
    const posts = await PostData.find({ user }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching user posts:", error.message);
    res.status(500).json({ message: error.message });
  }
});

export default router.handler();
