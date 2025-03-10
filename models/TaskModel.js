// models/NewTask.js
import mongoose from 'mongoose';

const NewTaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  completed: { type: Boolean, default: false },
  priority: { type: Number, default: 1 }, 
  community_id: {type: mongoose.Schema.Types.ObjectId, default:null},
  users_completed: [{type: String, default:null }],
}, { collection: 'userNewTasks' });

export default mongoose.models.NewTask || mongoose.model('NewTask', NewTaskSchema);
