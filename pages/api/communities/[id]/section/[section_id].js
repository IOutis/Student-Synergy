import dbConnect from '../../../../../lib/dbconnect'; // Adjust the import based on your project structure
// import Community from '../../../../models/CommunityModel'; // Adjust the path to your Community model
import Section from '../../../../../models/SectionsModel'; // Import your Section model

export default async function handler(req, res) {
  await dbConnect(); // Connect to your database

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { section_id } = req.query;
        console.log("id: ",section_id);

        // Find the community by ID
        const section = await Section.findById(section_id).populate('posts'); 

        if (!section) {
          return res.status(404).json({ success: false, message: 'section not found' });
        }

        // Return the sections associated with the community
        return res.status(200).json({ success: true, sections: section.posts });
      } catch (error) {
        console.error('Error fetching sections:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
      }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
