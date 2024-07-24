import mongoose from 'mongoose';

const { Schema } = mongoose;

const EditorDataSchema = new Schema({
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

});

const EditorData = mongoose.models.EditorData || mongoose.model('EditorData', EditorDataSchema);

export default EditorData;
