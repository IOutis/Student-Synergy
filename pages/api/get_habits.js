import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]'; // Adjust path as needed
import dbConnect from '../../lib/dbconnect';
// import User from '../../models/User';
import {User} from '../../models/AllTaskModels'

export default async function habitHandler(req, res) {
  await dbConnect();
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      // Fetch the user based on session
      const user = await User.findOne({ email: session.user.email }).populate('habits');
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Compare today's date with the lastUpdatedDate of each habit
      const today = new Date().toISOString().split('T')[0];
      const updatedHabits = user.habits.map((habit) => {
        const lastUpdatedDate = habit.lastUpdatedDate ? new Date(habit.lastUpdatedDate).toISOString().split('T')[0] : null;
        if (lastUpdatedDate && lastUpdatedDate < today) {
          return { ...habit.toObject(), isCompleted: false }; // Change isCompleted to false if lastUpdatedDate is older than today
        }
        return habit.toObject();
      });

      // Return the updated habits
      return res.status(200).json(updatedHabits);
    } catch (err) {
      console.log("ERROR GETTING HABITS: ", err);
      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}