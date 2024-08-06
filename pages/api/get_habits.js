import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]'; // Adjust path as needed
import dbConnect from '../../lib/dbconnect';
import { User } from '../../models/AllTaskModels';
import { getISOWeek } from 'date-fns';

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

      const today = new Date();
      const todayString = today.toISOString().split('T')[0];

      const updatedHabits = user.habits.map((habit) => {
        const lastUpdatedDate = habit.lastUpdatedDate ? new Date(habit.lastUpdatedDate) : null;
        if (!lastUpdatedDate) {
          return habit.toObject();
        }

        const habitData = habit.toObject();
        habitData.isCompleted = true; // Reset isCompleted to true for checking
        
        switch (habit.frequency) {
          case 'daily':
            if (lastUpdatedDate.toISOString().split('T')[0] < todayString) {
              habitData.isCompleted = false;
            }
            break;
          case 'weekly':
            console.log("In weekly");
            const lastUpdatedWeek = getISOWeek(lastUpdatedDate);
            console.log("last updated week = ", lastUpdatedWeek);
            console.log("last updated date = ", lastUpdatedDate);
            const currentWeek = getISOWeek(today);
            console.log("current week = ", currentWeek);
            if (lastUpdatedWeek > currentWeek) {
              habitData.isCompleted = false;
            }
            break;
          case 'monthly':
            const lastUpdatedMonth = lastUpdatedDate.getMonth();
            const currentMonth = today.getMonth();
            if (lastUpdatedMonth < currentMonth) {
              habitData.isCompleted = false;
            }
            break;
        }
        
        return habitData;
      });

      return res.status(200).json(updatedHabits);
    } catch (err) {
      console.log("ERROR GETTING HABITS: ", err);
      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
