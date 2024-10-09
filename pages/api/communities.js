import dbConnect from '../../lib/dbconnect'; // Adjust path as needed
import Community from '../../models/CommunityModel'; // Adjust path as needed
import User from '../../models/User';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await dbConnect();
    const { name, description, approvalType, password, email } =  req.body;
    console.log("APPROVAL : ",approvalType)
    // Validate required fields
    if (!name || !description || !approvalType || (approvalType === 'password' && !password)) {
      return res.status(400).json({ error: 'All fields are required, including password if approval type is set to password' });
    }

    try {
      // Prepare the new community object, including the password if applicable
      if(!approvalType){
        return res.status(400).json({error:'approval type vanished just before entering into community'})
      }
      const newCommunity = new Community({
        name,
        description,
        adminEmail: email, // Assuming user info is available
        approvalType,
        password: approvalType === 'password' ? password : undefined,
        sections :[],
      });

      // Save the new community to the database
      await newCommunity.save();

      // Update the user's community list
      const user = await User.findOneAndUpdate(
        { email },
        { $push: { communityIds: newCommunity._id } },
        { new: true } // Return the updated user document
      );

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      if(!newCommunity.approvalType){
        return res.status(400).json({ error: 'Approval type is required' });
      }

      res.status(201).json(newCommunity);
    } catch (error) {
      res.status(500).json({ error: 'Error creating community' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
