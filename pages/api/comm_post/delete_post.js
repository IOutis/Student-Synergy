import { createRouter } from 'next-connect';
import dbConnect from '../../../lib/dbconnect';
import PostData from '../../../models/Comm_Post';
import { ObjectId } from 'mongodb';

const router = createRouter();

router.delete(async (req, res) => {
    await dbConnect();
    const { id } = req.query;

    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        const result = await PostData.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Post deleted successfully' });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error: error.message });
    }
});

export default router.handler();
