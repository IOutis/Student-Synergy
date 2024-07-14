import dbConnect from '../../lib/dbconnect';
import Task from '../../models/Task';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const { user, task, description, time, date, status, recurring } = req.body;
      const tasks = [];
      let startDate = new Date(date);
      const endDate = new Date(date);

      // Combine date and time into a single Date object

      switch (recurring) {
        case 'one week':
          endDate.setDate(endDate.getDate() + 7);
          while (startDate <= endDate) {
            tasks.push({ user, task, description, time: time, date: new Date(startDate), status, recurring });
            startDate.setDate(startDate.getDate() + 1);
          }
          break;
        case 'one month':
          endDate.setMonth(endDate.getMonth() + 1);
          while (startDate <= endDate) {
            tasks.push({ user, task, description, time: time, date: new Date(startDate), status, recurring });
            startDate.setDate(startDate.getDate() + 1);
          }
          break;
        case 'six months':
          endDate.setMonth(endDate.getMonth() + 6);
          while (startDate <= endDate) {
            tasks.push({ user, task, description, time: time, date: new Date(startDate), status, recurring });
            startDate.setDate(startDate.getDate() + 1);
          }
          break;
        case 'once a week':
          endDate.setMonth(startDate.getMonth() + 1); // Set the period to one month for weekly recurrence
          while (startDate <= endDate) {
            tasks.push({ user, task, description, time: time, date: new Date(startDate), status, recurring });
            startDate.setDate(startDate.getDate() + 7);
          }
          break;
        case 'once a month':
          endDate.setMonth(startDate.getMonth() + 6); // Set the period to six months for monthly recurrence
          while (startDate <= endDate) {
            tasks.push({ user, task, description, time: time, date: new Date(startDate), status, recurring });
            startDate.setMonth(startDate.getMonth() + 1);
          }
          break;
        default:
          tasks.push({ user, task, description, time: time, date: new Date(date), status, recurring });
      }

      console.log("Tasks to save:", tasks);

      await Task.insertMany(tasks);
      res.status(201).json({ message: 'Tasks created successfully', tasks });
    } catch (error) {
      console.error('Failed to create tasks:', error);
      res.status(500).json({ message: 'Failed to create tasks', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
