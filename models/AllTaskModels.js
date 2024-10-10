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
  name: String,
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NewTask' }],
  dailyTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NewDailyTask' }],
  habits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NewHabit' }],
  rewards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NewReward' }],
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  skills: [{ type: String }],
  coins: { type: Number, default: 0 },
  communityIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Community' }]
}, { collection: 'Users' });



const CommunitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  approvalType: { type: String, required: true ,default:'automatic'},
  adminEmail: { type: String, required: true },  // Renamed for clarity
  members: [{ type: String }],  // Assuming these are emails
  joinRequests: [{ type: String }],  // Assuming these are emails
  sections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section'  // Referencing posts from PostData model
  }],
  password: {type:String, default : null},
}, { collection: 'Communities' });

const Community = mongoose.models.Community || mongoose.model('Community', CommunitySchema);



const LevelSchema = new mongoose.Schema({
  level: { type: Number, required: true },
  expRequired: { type: Number, required: true },
  title: { type: String, required: true }
}, { collection: 'Levels' });

const Level = mongoose.models.Level || mongoose.model('Level', LevelSchema);

const SectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PostData', // Reference to your existing Post model
  }],
  qaSection: { type: Boolean, default: false },
});

const Section = mongoose.models.Section || mongoose.model('Section', SectionSchema);

// Export models
const Habit = mongoose.models.NewHabit || mongoose.model('NewHabit', HabitSchema);
const DailyTask = mongoose.models.NewDailyTask || mongoose.model('NewDailyTask', DailyTaskSchema);
const NewTask = mongoose.models.NewTask || mongoose.model('NewTask', NewTaskSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export { Habit, DailyTask, User, NewTask,Level ,Community, Section};
