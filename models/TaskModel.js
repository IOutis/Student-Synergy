import mongoose from 'mongoose';

const NewTaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  completed: { type: Boolean, default: false },
}, { collection: 'userNewTasks' });

export default mongoose.models.NewTask || mongoose.model('NewTask', NewTaskSchema);
