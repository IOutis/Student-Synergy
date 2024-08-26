import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: String,
  name: String,
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NewTask' }],
  dailyTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NewDailyTask' }],
  habits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NewHabit' }],
  rewards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NewReward' }],
  level: { type:Number, default: 1 },
  experience: { type: Number, default: 0 },
  skills: [{ type: String }],
  coins: { type: Number, default: 0 },
  communityIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Community' }]
}, { collection: 'Users' });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
