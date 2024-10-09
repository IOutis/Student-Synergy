import mongoose from "mongoose";
const SectionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PostData', // Reference to your existing Post model
    }],
  });

  const Section = mongoose.models.Section || mongoose.model('Section', SectionSchema);

export default Section;