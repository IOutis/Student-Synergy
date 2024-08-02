import mongoose from 'mongoose';

const DailyTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  streak: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
  lastUpdatedDate: { type: Date },
  isStreakLocked: { type: Boolean, default: false },
}, { collection: 'userNewDailyTasks' });

export default mongoose.models.DailyTask || mongoose.model('DailyTask', DailyTaskSchema);
