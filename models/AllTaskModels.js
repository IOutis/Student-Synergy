import mongoose from 'mongoose';

// Habit Schema
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
  isPending: { type: Boolean, default: true },
  isCompleted: { type: Boolean, default: false },
}, { collection: 'userNewHabits' });

// Daily Task Schema
const DailyTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  streak: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
  lastUpdatedDate: { type: Date },
  isStreakLocked: { type: Boolean, default: false },
}, { collection: 'userNewDailyTasks' });

const NewTaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  completed: { type: Boolean, default: false },
  priority: { type: Number, default: 1 }, // Optional field
}, { collection: 'userNewTasks' });


// User Schema
const UserSchema = new mongoose.Schema({
  email: String,
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NewTask' }],
  dailyTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NewDailyTask' }],
  habits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NewHabit' }],
  rewards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NewReward' }],
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  skills: [{ type: String }],
  coins: { type: Number, default: 0 }
}, { collection: 'Users' });


const LevelSchema = new mongoose.Schema({
  level: { type: Number, required: true },
  expRequired: { type: Number, required: true },
  title: { type: String, required: true }
}, { collection: 'Levels' });

const Level = mongoose.models.Level || mongoose.model('Level', LevelSchema);


// Export models
const Habit = mongoose.models.NewHabit || mongoose.model('NewHabit', HabitSchema);
const DailyTask = mongoose.models.NewDailyTask || mongoose.model('NewDailyTask', DailyTaskSchema);
const NewTask = mongoose.models.NewTask || mongoose.model('NewTask', NewTaskSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export { Habit, DailyTask, User, NewTask,Level };
