import dbConnect from '../lib/dbconnect';
import Task from '../models/Task';

export default async function dataHandler(req, res) {
  await dbConnect();
  if (req.method === "GET") {
    const { user, status, date, recurring } = req.query;
    const filter = { user };

    if (status) filter.status = status;
    if (date) {
        filter.date = { $eq: new Date(date) };
    } else {
        const today = new Date();
        filter.date = {
          $gte: new Date(today.setHours(0, 0, 0, 0)),
          $lte: new Date(today.setHours(23, 59, 59, 999))
        };
      }
    
    if (recurring) filter.recurring = recurring;

    try {
      const tasks = await Task.find(filter).sort({ date: 1, time: 1 });
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
