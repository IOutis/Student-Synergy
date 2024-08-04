import dbConnect from '../../../lib/dbconnect';
import NewHabit from '../../../models/Habits';
import User from '../../../models/User';
import { gainExp } from '../../../lib/leveling';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const { id } = req.query;
    const { isCompleted } = req.body;

    const today = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
    const habit = await NewHabit.findById(id);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    let newStreak = habit.streak || 0;
    const lastUpdatedDate = habit.lastUpdatedDate ? new Date(habit.lastUpdatedDate).toISOString().split('T')[0] : null;
    const current = new Date();
    console.log("Today ",today);
    console.log("Current ",current);

    // Determine if the streak should be locked based on the last updated date
    let streakLocked = lastUpdatedDate <= today;
    const user = await User.findOne({ habits: id });
    console.log(user);

    if (isCompleted) {
      newStreak += 1; // Increment the streak if the habit is completed
     // Lock the streak since it's being updated
    await gainExp(user._id, 10);
    
  } else {
    newStreak -= 1; // Decrement the streak if the habit is not completed
    await gainExp(user._id, -15);
       // Unlock the streak since it's being updated
    }

    // Update the habit document with the new streak and lock status
    if (streakLocked) {
      const updatedHabit = await NewHabit.findByIdAndUpdate(
        id,
        {
          isCompleted,
          streak: newStreak,
          lastUpdatedDate: today,
          isStreakLocked: streakLocked,
          lastUpdatedDate:today,
        },
        { new: true }
      );
     
    
      return res.status(200).json(updatedHabit);
    } 
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
}
