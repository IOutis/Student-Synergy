import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true }, // Link file to the note
  user: { type: String, required: true }, // Ensure the file is linked to a user
  filename: { type: String, required: true }, // File name as required
  contentType: { type: String, required: true }, // MIME type of the file
  path: { type: String, required: true }, // File path or URL where the file is stored
  uploadedAt: { type: Date, default: Date.now }, // Timestamp of when the file was uploaded
});

const FileModel = mongoose.models.File || mongoose.model('File', fileSchema);

export default FileModel;
