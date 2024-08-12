import mongoose from 'mongoose';

const { Schema } = mongoose;

const PostDataSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    },
  user: {
    type: String,
    required: [true, 'User required'],
  },
  fileData: { // Field for storing binary data
    type: Buffer,
    required: false, // Set according to your needs
  },
  contentType: { // Field for storing MIME type of the file
    type: String,
    required: false, // Set according to your needs
  },
 
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default:0,
  },
  keywords: [{ 
    type: String,
    required: true, // Ensures that posts have relevant keywords
  }],
  comments :{
    type: Array,
    default:[]
  }

});

const PostData = mongoose.models.PostData || mongoose.model('PostData', PostDataSchema);

export default PostData;