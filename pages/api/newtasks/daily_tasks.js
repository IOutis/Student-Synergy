import dbConnect from '../../../lib/dbconnect';
import DailyTask from '../../../models/DailyTasks';
import User from '../../../models/User';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { email, title, description, completed, date } = req.body;
      let user = await User.findOne({ email });

      if (!user) {
        user = new User({ email, dailyTasks: [] });
        await user.save();
      }
      const today = new Date().toISOString().split('T')[0];


      const newTask = new DailyTask({
        title,
        description,
        isCompleted: false,
        lastUpdatedDate: today,
      });

      await newTask.save();
      user.dailyTasks.push(newTask);
      await user.save();

      return res.status(201).json(newTask);
    } catch (err) {
      console.log("Error in saving task:", err);
      return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id } = req.query;
      const { title, description, completed, date } = req.body;
      

      const updatedTask = await DailyTask.findByIdAndUpdate(
        id,
        { title, description,},
        { new: true }
      );

      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }

      return res.status(200).json(updatedTask);
    } catch (err) {
      console.log("Error in updating task:", err);
      return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      const deletedTask = await DailyTask.findByIdAndDelete(id);

      if (!deletedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }

      return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
      console.log("Error in deleting task:", err);
      return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
