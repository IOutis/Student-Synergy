import User from '../../../models/User';
import dbConnect from '../../../lib/dbconnect';

export default async (req, res) => {
  await dbConnect();

  const { query } = req.query;

  if (query.length > 0) {
    try {
      const users = await User.find({
        $or: [
          { email: { $regex: query, $options: 'i' } },
          { name: { $regex: query, $options: 'i' } }
        ]
      });

      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error searching users' });
    }
  } else {
    res.status(400).json({ error: 'Query parameter is required' });
  }
};
