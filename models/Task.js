import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  user: {
    type: String,
    required: [true, 'User required'],
  },
  task: {
    type: String,
    required: [true, 'Task required'],
  },
  deadline: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        const now = new Date();
        const isValid = value.getTime() > now.getTime();
        console.log(`Validating deadline: ${value}, Now: ${now}, IsValid: ${isValid}`);
        return isValid;
      },
      message: 'Please enter a valid deadline',
    },
  },
  status: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  recurring: {
    type: String,
    enum: ['none', 'one week', 'one month', 'six months', 'once a week', 'once a month'],
    default: 'none',
  },
});

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);
