import mongoose from 'mongoose';

const LevelSchema = new mongoose.Schema({
  level: { type: Number, required: true },
  expRequired: { type: Number, required: true },
  title: { type: String, required: true }
}, { collection: 'Levels' });

const Level = mongoose.models.Level || mongoose.model('Level', LevelSchema);

export default Level;
