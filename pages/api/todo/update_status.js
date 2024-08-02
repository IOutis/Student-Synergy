// pages/api/todo/update_status.js
import dbConnect from '../../../lib/dbconnect';
import NewTask from '../../../models/TaskModel';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'PATCH') {
    try {
      const { id } = req.query;
      const { completed } = req.body;
      const updatedTask = await NewTask.findByIdAndUpdate(
        id,
        { completed },
        { new: true }
      );
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
      return res.status(200).json(updatedTask);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
