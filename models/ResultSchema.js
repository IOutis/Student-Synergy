import mongoose from 'mongoose'
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

  export default Result;
  