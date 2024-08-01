import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: String,
  name: String,
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NewTask' }],
  dailyTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NewDailyTask' }],
  habits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NewHabit' }],
  rewards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NewReward' }],
}, { collection: 'Users' });

export default mongoose.models.User || mongoose.model('User', UserSchema);
