import mongoose from 'mongoose';

const CommunitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    adminEmail: { type: String, required: true },  // Renamed for clarity
    members: [{ type: String }],  // Assuming these are emails
    joinRequests: [{ type: String }],  // Assuming these are emails
    posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PostData'  // Referencing posts from PostData model
    }]
}, { collection: 'Communities' });

const Community = mongoose.models.Community || mongoose.model('Community', CommunitySchema);

export default Community;
