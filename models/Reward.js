import mongoose from 'mongoose';

const RewardSchema = new mongoose.Schema({
  title: String,
  points: Number,
}, { collection: 'userNewRewards' });

export default mongoose.models.NewReward || mongoose.model('NewReward', RewardSchema);
