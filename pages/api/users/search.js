// pages/api/users/search.js
import User from '../../../models/User';
import dbConnect from '../../../lib/dbconnect';

export default async (req, res) => {
  await dbConnect();

  const { query } = req.query;
  const users = await User.find({
    $or: [{ email: { $regex: query, $options: 'i' } }, { name: { $regex: query, $options: 'i' } }]
  });

  res.status(200).json(users);
};
