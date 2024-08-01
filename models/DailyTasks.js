import mongoose from 'mongoose';

const DailyTaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
}, { collection: 'userNewDailyTasks' });

export default mongoose.models.NewDailyTask || mongoose.model('NewDailyTask', DailyTaskSchema);
