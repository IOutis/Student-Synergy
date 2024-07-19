import dbConnect from '../../../lib/dbconnect';
import Task from '../../../models/Task';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { user, task, description, deadline, status, recurring } = req.body;

      // Parse the deadline date
      const startDate = new Date(deadline);

      // Validate deadline with current time
      const now = new Date();
      if (startDate <= now) {
        throw new Error('Task deadline must be in the future');
      }

      // Define endDate based on recurring type (if needed)
      let endDate = new Date(startDate);
      switch (recurring) {
        case 'one week':
          endDate.setDate(endDate.getDate() + 7);
          break;
        case 'one month':
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        case 'six months':
          endDate.setMonth(endDate.getMonth() + 6);
          break;
        case 'once a week':
          endDate.setDate(endDate.getDate() + 7);
          break;
        case 'once a month':
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        case 'none':
        default:
          endDate = new Date(startDate); // Set to startDate if no recurrence
          break;
      }

      // Prepare tasks array
      const tasks = [];
      while (startDate <= endDate) {
        tasks.push({
          user,
          task,
          description,
          deadline: new Date(startDate), // Ensure deadline is also a Date object
          status,
          recurring,
        });

        // Increment startDate based on recurrence type
        switch (recurring) {
          case 'one week':
            startDate.setDate(startDate.getDate() + 1);
            break;
          case 'once a week':
            startDate.setDate(startDate.getDate() + 7);
            break;
          case 'one month':
          case 'once a month':
            startDate.setMonth(startDate.getMonth() + 1);
            break;
          case 'six months':
            startDate.setMonth(startDate.getMonth() + 1);
            break;
          case 'none':
          default:
            startDate.setDate(startDate.getDate() + 1); // Increment by a day for 'none'
            break;
        }
      }

      console.log('Tasks to save:', tasks);

      // Save tasks to database
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
