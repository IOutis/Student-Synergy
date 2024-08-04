// pages/api/todo/add_task.js
import dbConnect from '../../../lib/dbconnect';
import NewTask from '../../../models/TaskModel';
import User from '../../../models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
      const user = await User.findOne({ email: session.user.email }).populate('tasks');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const { title, description, dueDate, priority } = req.body;
      const newTask = new NewTask({ title, description, dueDate, priority });
      await newTask.save();
      user.tasks.push(newTask);
      await user.save();
      return res.status(201).json(newTask);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
