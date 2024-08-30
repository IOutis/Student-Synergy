import dbConnect from '../../lib/dbconnect'; // Adjust path as needed
import Community from '../../models/CommunityModel'; // Adjust path as needed
import User from '../../models/User';
export default async function handler(req, res) {
  if (req.method === 'POST') {
    await dbConnect();
    
    const { name, description, approvalType,email } = req.body;

    if (!name || !description || !approvalType) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const newCommunity = new Community({
        name,
        description,
        adminEmail: email, // Assuming user info is available
        approvalType,
      });

      await newCommunity.save();
      const user = await User.findOneAndUpdate(
        { email },
        { $push: { communityIds: newCommunity._id } },
        { new: true } // Return the updated user document
      );

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(201).json(newCommunity);
    } catch (error) {
      res.status(500).json({ error: 'Error creating community' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
