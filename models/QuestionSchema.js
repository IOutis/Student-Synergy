import mongoose from "mongoose";
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

export default Question;