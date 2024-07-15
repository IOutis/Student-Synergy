import dbConnect from '../../lib/dbconnect';
import Task from '../../models/Task';

const processTasks = async () => {
  try {
    await dbConnect(); // Connect to MongoDB
    console.log("Connected successfully");

    const tasks = await Task.find(); // Fetch all tasks from MongoDB
    const now = new Date();

    tasks.forEach(task => {
      const taskDate = new Date(task.time);
      const timeDiff = taskDate - now;

      if (timeDiff <= 10 * 60 * 1000 && timeDiff > 0) {
        console.log(`Task "${task.task}" is approaching its deadline!`);
        // Implement notification logic here, such as sending notifications
        // You can use a notification service or any other logic required
      }
      else if (timeDiff <= 0) {
        console.log(`Task "${task.task}" Deadline reached!`);
      }
    });
  } catch (error) {
    console.error('Error processing tasks:', error);
  }
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    await processTasks();
    res.status(200).json({ message: 'Tasks processed' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
