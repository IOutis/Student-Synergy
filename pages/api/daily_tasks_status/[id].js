import dbConnect from '../../../lib/dbconnect';
import DailyTask from '../../../models/DailyTasks';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const { id } = req.query;
    const { isCompleted } = req.body;

    const today = new Date().toISOString().split('T')[0];
    const dailyTask = await DailyTask.findById(id);

    if (!dailyTask) {
      return res.status(404).json({ message: 'Daily task not found' });
    }

    let newStreak = dailyTask.streak || 0;
    const lastUpdatedDate = dailyTask.lastUpdatedDate ? new Date(dailyTask.lastUpdatedDate).toISOString().split('T')[0] : null;
    const current = new Date();

    let streakLocked = lastUpdatedDate <= today;

    if (isCompleted) {
      newStreak += 1;
    } else {
      newStreak -= 1;
    }
    console.log("isCompleted : ", isCompleted);
    console.log("isCompleted{db} : ", dailyTask.isCompleted);
    console.log("Last updated Date : ", lastUpdatedDate);
    const updatedDailyTask = await DailyTask.findByIdAndUpdate(
      id,
      {
        isCompleted,
        streak: newStreak,
        lastUpdatedDate: today,
        isStreakLocked: streakLocked,
      },
      { new: true }
    );

    return res.status(200).json(updatedDailyTask);
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
}
