import dbConnect from '../../../../lib/dbconnect'; // Adjust the import based on your project structure
import Community from '../../../../models/CommunityModel'; // Adjust the path to your Community model
import Section from '../../../../models/SectionsModel'; // Import your Section model

export default async function handler(req, res) {
  await dbConnect(); // Connect to your database

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { id } = req.query;
        

        // Find the community by ID
        const community = await Community.findById(id).populate('sections'); // Assuming sections are referenced in the Community model

        if (!community) {
          return res.status(404).json({ success: false, message: 'Community not found' });
        }

        // Return the sections associated with the community
        return res.status(200).json({ success: true, sections: community.sections });
      } catch (error) {
        console.error('Error fetching sections:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
      }

    case 'POST':
      try {
        const { id } = req.query;
        const { title, description,qaSection } = req.body;

        // Validate input
        if (!title || !description) {
          return res.status(400).json({ success: false, message: 'Title and description are required' });
        }
        console.log("Section : ",qaSection)
        // Create a new section
        const newSection = new Section({
          title,
          description,
          // communityId: id,
          qaSection: qaSection?true:false // Assuming you want to link the section back to the community
        });
        console.log("newSection:",newSection.qaSection)

        // Save the section to the database
        await newSection.save();

        // Update the community to include the new section
        await Community.findByIdAndUpdate(id, { $push: { sections: newSection._id } });

        return res.status(201).json({ success: true, section: newSection });
      } catch (error) {
        console.error('Error adding section:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
