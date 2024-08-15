import mongoose from 'mongoose';

const { Schema } = mongoose;

const CommentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'PostData',
    required: true,
  },
  user: {
    type: String,
    required: [true, 'User required'],
  },
  email: {
    type: String,
    required: [true, 'Email required'],
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  fileData: { // Field for storing binary data
    type: Buffer,
    required: false, // Set according to your needs
  },
  contentType: { // Field for storing MIME type of the file
    type: String,
    required: false, // Set according to your needs
  },
});

const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);

export default Comment;
