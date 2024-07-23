import mongoose from 'mongoose';

const { Schema } = mongoose;

const ImageSchema = new Schema({
  imageData: {
    type: Buffer,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
});

const ImageModel = mongoose.models.Image || mongoose.model('Image', ImageSchema);

export default ImageModel;
