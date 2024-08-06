// pages/api/todo/update_status.js
import dbConnect from '../../../lib/dbconnect';
import NewTask from '../../../models/TaskModel';
import User from '../../../models/User';
import { gainExp } from '../../../lib/leveling';

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
      const user = await User.findOne({ tasks: id });
      if(completed){
        await gainExp(user._id, 8);
      }
      else{
        await gainExp(user._id, -10);
      }
      return res.status(200).json(updatedTask);
    } catch (error) {
      console.log("Error in update")
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
