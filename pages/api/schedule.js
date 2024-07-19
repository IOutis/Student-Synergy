import cron from 'node-cron';
import dbConnect from '../../lib/dbconnect';
import Task from '../../models/Task';
import WebSocket from 'ws';

const wsServerUrl = 'ws://localhost:8080';

const userConnections = new Map(); // Store WebSocket connections for each user

const processTasks = async () => {
  try {
    await dbConnect();
    console.log("Connected successfully");

    const tasks = await Task.find({ $or: [{ status: "In Progress" }, { status: "Planned" }] });
    const now = new Date();

    tasks.forEach(async task => {
      const taskDate = new Date(task.deadline); // Correct the field name to 'deadline'
      const timeDiff = taskDate - now;
      console.log("timeDiff: ", timeDiff);
      console.log("task Date: ", taskDate);
      console.log("task user: ", task.user);

      if (timeDiff > 0 && timeDiff <= 10 * 60 * 1000) {
        // Notification for approaching deadline
        const notification = {
          message: `Task "${task.task}" is approaching its deadline!`,
          user: task.user
        };

        // Check if a WebSocket connection exists for the user
        if (!userConnections.has(task.user)) {
          // Create a new WebSocket connection for the user
          const ws = new WebSocket(`${wsServerUrl}?user=${encodeURIComponent(task.user)}`);

          ws.on('open', () => {
            console.log(`Connected to WebSocket server for user: ${task.user}`);
            userConnections.set(task.user, ws);
            // Send the notification to the user
            ws.send(JSON.stringify(notification));
          });

          ws.on('close', () => {
            console.log(`WebSocket connection closed for user: ${task.user}`);
            userConnections.delete(task.user);
          });

          ws.on('error', (error) => {
            console.error(`WebSocket error for user ${task.user}:`, error);
            userConnections.delete(task.user);
          });
        } else {
          // Send the notification using the existing WebSocket connection
          const ws = userConnections.get(task.user);
          ws.send(JSON.stringify(notification));
        }
      } else if (timeDiff < 0) {
        // Status change to "Not Completed" and notification
        console.log("Now changing the status to Not Completed");
        await Task.updateOne(
          { _id: task._id },
          { $set: { status: "Not Completed" } }
        )
        .then(() => {
          console.log("Done");
        })
        .catch(error => {
          console.log("Error:", error);
        });

        // Notification for status change
        const notification = {
          message: `Task "${task.task}" of deadline "${new Date(task.deadline).toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit'})}" status is changed to Not Completed`,
          user: task.user
        };

        // Check if a WebSocket connection exists for the user
        if (!userConnections.has(task.user)) {
          // Create a new WebSocket connection for the user
          const ws = new WebSocket(`${wsServerUrl}?user=${encodeURIComponent(task.user)}`);

          ws.on('open', () => {
            console.log(`Connected to WebSocket server for user: ${task.user}`);
            ws.send(`Connected to the websocket server user : ${task.user}`);
            userConnections.set(task.user, ws);
            // Send the notification to the user
            ws.send(JSON.stringify(notification));
          });

          ws.on('close', () => {
            console.log(`WebSocket connection closed for user: ${task.user}`);
            userConnections.delete(task.user);
          });

          ws.on('error', (error) => {
            console.error(`WebSocket error for user ${task.user}:`, error);
            userConnections.delete(task.user);
          });
        } else {
          // Send the notification using the existing WebSocket connection
          const ws = userConnections.get(task.user);
          ws.send(JSON.stringify(notification));
        }
      }
    });
  } catch (error) {
    console.error('Error processing tasks:', error);
  }
};


cron.schedule('* * * * *', () => {
  console.log('Running task processing every minute');
  processTasks();
});
const temp_ws = new WebSocket("ws://localhost:8080")
export default async function handler(req, res) {
  try {
    temp_ws.on("open",()=>{
      temp_ws.send(JSON.stringify("CONNECTED TO THE SERVERRRRR!!!"));
    })
    temp_ws.on("close",()=>{
      console.log("CLOSED");
    })
    await processTasks();
    res.status(200).json({ message: 'Scheduler is running' });
  } catch (error) {
    console.error('Error processing tasks:', error);
    res.status(500).json({ message: 'Error processing tasks', error: error.message });
  }
}
