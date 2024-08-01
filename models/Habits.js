import mongoose from 'mongoose';

const HabitSchema = new mongoose.Schema({
  title: String,
  description: String,
  frequency: String,
  streak: { type: Number, default: 0 },
  dueDate: { type: Date, default: null },
  startDate: { type: Date, default: null },
  reminderTime: { type: Date, default: null },
  lastUpdatedDate: Date,
  isStreakLocked: { type: Boolean, default: false },
  isPending: { type: Boolean, default: true }, // New field
  isCompleted: { type: Boolean, default: false }, // New field
}, { collection: 'userNewHabits' });


export default mongoose.models.NewHabit || mongoose.model('NewHabit', HabitSchema);
