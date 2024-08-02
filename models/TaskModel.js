// models/NewTask.js
import mongoose from 'mongoose';

const NewTaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  completed: { type: Boolean, default: false },
  priority: { type: Number, default: 1 }, // Optional field
}, { collection: 'userNewTasks' });

export default mongoose.models.NewTask || mongoose.model('NewTask', NewTaskSchema);
