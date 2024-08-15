import { createRouter } from 'next-connect';
import dbConnect from '../../../lib/dbconnect';
import PostData from '../../../models/Comm_Post';

const router = createRouter();

router.get(async (req, res) => {
  await dbConnect();
  const { id } = req.query;
  
  try {
    // const user = req.query.user; // Pass the user email as a query parameter
    // console.log("ID = ",id);
    const posts = await PostData.find({ _id: id });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching user posts:", error.message);
    res.status(500).json({ message: error.message });
  }
});

export default router.handler();
