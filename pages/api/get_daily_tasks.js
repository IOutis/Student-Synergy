import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import dbConnect from '../../lib/dbconnect';
import User from '../../models/User';

export default async function dailyTaskHandler(req, res) {
  await dbConnect();
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const user = await User.findOne({ email: session.user.email }).populate('dailyTasks');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const today = new Date().toISOString().split('T')[0];
      const updatedDailyTasks = user.dailyTasks.map((dailyTask) => {
        const lastUpdatedDate = dailyTask.lastUpdatedDate ? new Date(dailyTask.lastUpdatedDate).toISOString().split('T')[0] : null;
        console.log("Title : ",dailyTask.title);
        console.log("Last date : ",dailyTask.lastUpdatedDate);
        if (lastUpdatedDate && lastUpdatedDate < today) {
          console.log("Last Updated < today")
          return { ...dailyTask.toObject(), isCompleted: false };
        }
        return dailyTask.toObject();
      });

      return res.status(200).json(updatedDailyTasks);
    } catch (err) {
      console.log("ERROR GETTING Dailies: ", err);
      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
