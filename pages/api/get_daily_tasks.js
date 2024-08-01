import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]'; // Adjust path as needed
import dbConnect from '../../lib/dbconnect';
// import User from '../../models/User';
import {User} from '../../models/AllTaskModels';
export default async function habitHandler(req, res) {
  await dbConnect();
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      // Fetch the user based on session
      const user = await User.findOne({ email: session.user.email }).populate('dailyTasks');
      // console.log("User got : ", user)
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Return the fetched habits
      return res.status(200).json(user.dailyTasks);
    } catch (err) {
      console.log("ERROR GETTING Dailies: ", err);
      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
