import cron from 'node-cron';
import dbConnect from '../lib/dbconnect';
import Task from '../models/Task';

// Function to fetch tasks and process notifications
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
        console.log(`Task "${task.task}" Deadline reached!`)
      }
    });
  } catch (error) {
    console.error('Error processing tasks:', error);
  }
};

// Schedule the task processing every minute
cron.schedule('* * * * *', () => {
  console.log('Running task processing every minute');
  processTasks(); // Execute the processTasks function
});

// Export an empty function or object to satisfy Next.js API routes
export default function handler(req, res) {
  // This function is required by Next.js API routes
  res.status(200).json({ message: 'Scheduler is running' });
}
