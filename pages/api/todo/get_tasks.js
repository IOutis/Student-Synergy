// pages/api/todo/get_tasks.js
import dbConnect from '../../../lib/dbconnect';
import NewTask from '../../../models/TaskModel';
import User from '../../../models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  await dbConnect();
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const user = await User.findOne({ email: session.user.email }).populate('tasks');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // The user's tasks are already populated in the `user.tasks` field
      const tasks = user.tasks.sort((a, b) => a.priority - b.priority);

      return res.status(200).json(tasks);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      await NewTask.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
