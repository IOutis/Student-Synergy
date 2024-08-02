// pages/api/todo/get_tasks.js
import dbConnect from '../../../lib/dbconnect';
import NewTask from '../../../models/TaskModel';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const tasks = await NewTask.find({}).sort({ priority: 1 });
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
