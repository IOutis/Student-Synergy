import mongoose from 'mongoose'

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
export default Poll
