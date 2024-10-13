import mongoose from 'mongoose'
const AssignmentSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
  submissionType: { 
    type: String, 
    // enum: ['file', 'text'], 
    required: true 
  },
  community: { type: Schema.Types.ObjectId, ref: 'Community' },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  submissions: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    submission: { 
      type: Schema.Types.Mixed, // Could be file info or text content 
    },
    files: [{
      type: Schema.Types.ObjectId,
      ref: 'File', // References the File model
      required: false, // Set to true if every post should have files
    }],
    submittedAt: { type: Date, default: Date.now }
  }]
});
const Assignment = mongoose.models.Assignment || mongoose.model('Assignment', AssignmentSchema);
export default Assignment;
