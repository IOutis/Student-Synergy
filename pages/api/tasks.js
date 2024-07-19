import dbConnect from '../../lib/dbconnect';
import Task from '../../models/Task';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const { user, status, date, recurring } = req.query;
      const filter = { user }; // Start with user filter

      if (status) filter.status = status; // Add status filter if present

      if (date) {
        // Direct comparison for exact date match
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        filter.deadline = { $gte: startOfDay, $lte: endOfDay };
      } else {
        // Default to today's date range if no date is provided
        const today = new Date();
        const startOfToday = new Date(today.setHours(0, 0, 0, 0));
        const endOfToday = new Date(today.setHours(23, 59, 59, 999));
        filter.deadline = {
          $gte: startOfToday,
          $lte: endOfToday
        };
      }

      if (recurring) filter.recurring = recurring; // Add recurring filter if present

      // Fetch tasks based on the filter
      const tasks = await Task.find(filter).sort({ deadline: 1 });

      // Format tasks for the response
      const formattedTasks = tasks.map(task => ({
        ...task.toObject(),
        date: task.deadline.toDateString(),
        time: task.deadline.toLocaleTimeString(),
      }));

      // Respond with the formatted tasks
      res.status(200).json(formattedTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
    }
  } 
  else if (req.method === "DELETE") {
    try {
      const { taskIds, user } = req.body;

      if (taskIds) {
        await Task.deleteMany({ _id: { $in: taskIds } });
      } else if (user) {
        await Task.deleteMany({ user });
      }

      res.status(200).json({ message: 'Tasks deleted successfully' });
    } catch (error) {
      console.error('Failed to delete tasks:', error);
      res.status(500).json({ message: 'Failed to delete tasks', error: error.message });
    }
  } else if (req.method === "PATCH") {
    try {
      const { taskId, newStatus } = req.body;

      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { status: newStatus },
        { new: true }
      );

      res.status(200).json(updatedTask);
    } catch (error) {
      console.error('Failed to update task status:', error);
      res.status(500).json({ message: 'Failed to update task status', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

