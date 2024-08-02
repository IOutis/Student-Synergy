// pages/api/todo/add_task.js
import dbConnect from '../../../lib/dbconnect';
import NewTask from '../../../models/TaskModel';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { title, description, dueDate, priority } = req.body;
      const newTask = new NewTask({ title, description, dueDate, priority });
      await newTask.save();
      return res.status(201).json(newTask);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
