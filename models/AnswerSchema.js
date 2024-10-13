import mongoose from 'mongoose'
const answerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    answer: { type: String }, // The user's answer (could be a string, option index, or descriptive text)
    submittedAt: { type: Date, default: Date.now },
    isCorrect: { type: Boolean }, // For automatic marking (based on multiple-choice questions)
  }, { timestamps: true });
  
const Answer = mongoose.models.Answer || mongoose.model('Answer', answerSchema);

export default Answer;