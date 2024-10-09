import mongoose from 'mongoose';

const CommunitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    approvalType: { type: String, required: true ,default:'automatic'},
    adminEmail: { type: String, required: true },  // Renamed for clarity
    members: [{ type: String }],  // Assuming these are emails
    joinRequests: [{ type: String }],  // Assuming these are emails
    sections: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section'  // Referencing posts from PostData model
    }],
    password: {type:String, default : null},
}, { collection: 'Communities' });

const Community = mongoose.models.Community || mongoose.model('Community', CommunitySchema);

export default Community;
