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
  quizzes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  }],
  assignments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment'
  }],
  polls: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poll'
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
  taskSection:{type:Boolean,default:false},
});

const Section = mongoose.models.Section || mongoose.model('Section', SectionSchema);


const answerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  answer: { type: String }, // The user's answer (could be a string, option index, or descriptive text)
  submittedAt: { type: Date, default: Date.now },
  isCorrect: { type: Boolean }, // For automatic marking (based on multiple-choice questions)
}, { timestamps: true });

const Answer = mongoose.models.Answer || mongoose.model('Answer', answerSchema);


const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
  submissionType: { 
    type: String, 
    // enum: ['file', 'text'], 
    required: true 
  },
  community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  submissions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    submission: { 
      type: mongoose.Schema.Types.Mixed, // Could be file info or text content 
    },
    files: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File', // References the File model
      required: false, // Set to true if every post should have files
    }],
    submittedAt: { type: Date, default: Date.now }
  }]
});
const Assignment = mongoose.models.Assignment || mongoose.model('Assignment', AssignmentSchema);


const PollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    optionText: String,
    votes: {
      type: Number,
      default: 0
    }
  }],
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  active: {
    type: Boolean,
    default: true
  }
});
const Poll = mongoose.models.Poll || mongoose.model('Poll', PollSchema);


const questionSchema = new mongoose.Schema({
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'parentModel' // Dynamically reference either 'Quiz' or 'Assignment'
  },
  parentModel: {
    type: String,
    required: true,
    enum: ['Quiz', 'Assignment','Poll'] // Specify whether the question belongs to a quiz or an assignment
  },
    type: { type: String,  required: true }, //enum: ['multiple-choice', 'descriptive', 'poll', 'true-false', 'fill-in-the-blank'],
    questionText: { type: String, required: true },
    options: [String], // Only for multiple-choice, polls, etc.
    correctAnswers: [String], // Array for multiple correct answers (for multiple-choice type)
    marks: { type: Number, default: 1 }, // Points for each question
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }, { timestamps: true });

const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  timeLimit: {
    type: Number, // in minutes
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community'
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});
const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', QuizSchema);


const resultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reference: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    refPath: 'referenceType' // This dynamically sets the model reference 
},
referenceType: { 
    type: String, 
    required: true, 
    enum: ['Quiz', 'Assignment', 'Poll'] // Can be a quiz, assignment, or poll
},
  totalMarks: { type: Number,  }, // Total marks available in the quiz
  marksObtained: { type: Number, }, // Marks obtained by the user
  isPassed: { type: Boolean, }, // Whether the user passed based on a threshold
  submittedAt: { type: Date, default: Date.now } // When the quiz was completed
}, { timestamps: true });

const Result = mongoose.models.Result || mongoose.model('Result', resultSchema);

// Export models
const Habit = mongoose.models.NewHabit || mongoose.model('NewHabit', HabitSchema);
const DailyTask = mongoose.models.NewDailyTask || mongoose.model('NewDailyTask', DailyTaskSchema);
const NewTask = mongoose.models.NewTask || mongoose.model('NewTask', NewTaskSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export { Habit, DailyTask, User, NewTask,Level ,Community, Section,Answer,Question,Assignment,Quiz,Poll,Result};
