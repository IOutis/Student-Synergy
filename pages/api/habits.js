import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]'; // Adjust path as needed
import dbConnect from '../../lib/dbconnect';
import NewHabit from '../../models/Habits';
import User from '../../models/User';

export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { email } = session.user;

  await dbConnect();
  // console.log("Mehtod = ", req.method)
  if (req.method === 'POST') {
    try {
      const { title, description, frequency } = req.body;
      let user = await User.findOne({ email });

      if (!user) {
        user = new User({
          email,
          habits: [],
        });

        await user.save();
      }
      const today = new Date().toISOString().split('T')[0];
      const newHabit = new NewHabit({
        title,
        description,
        frequency,
        streak: 0,
        lastUpdatedDate : today,
      });

      await newHabit.save();

      user.habits.push(newHabit);
      await user.save();

      return res.status(201).json(newHabit);
    } catch (err) {
      console.log("Error in saving task", err);
      return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
  } else if (req.method === 'PUT') {
    console.log("PUT");
    try {
      const { id } = req.query;
      const { title, description, frequency, dueDate, startDate, reminderTime, isCompleted } = req.body;

      const updatedHabit = await NewHabit.findByIdAndUpdate(
        id,
        { title, description, frequency, dueDate, startDate, reminderTime, isCompleted },
        { new: true } // Return the updated document
      );

      if (!updatedHabit) {
        console.log("UPDATION ERROR");
        return res.status(404).json({ message: 'Habit not found' });
      }

      return res.status(200).json(updatedHabit);
    } catch (err) {
      console.log("Error in updating task", err);
      return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
  
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      const deletedHabit = await NewHabit.findByIdAndDelete(id);
      if (!deletedHabit) {
        console.log("DELETION ERROR");
        return res.status(404).json({ message: 'Habit not found' });
      }
      return res.status(200).json({ message: 'Habit deleted successfully' });
    } catch (err) {
      console.log("Error in deleting task", err);
      return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
  } else if (req.method === 'PATCH') {
    console.log("IN PATCH"); // Handle PATCH requests to update the habit status
    try {
      const { id } = req.query;
      const { isPending, isCompleted } = req.body; // Destructure isPending and isCompleted from the request body
  
      const today = new Date().toISOString().split('T')[0]; // Current date
      const habit = await NewHabit.findById(id);
      console.log("Habit : ",habit )
      if (!habit) {
        console.log("UPDATION ERROR");
        return res.status(404).json({ message: 'Habit not found' });
      }
  
      // Directly update the isPending and isCompleted fields based on the request body
      const updatedHabit = await NewHabit.findByIdAndUpdate(
        id,
        { isPending, isCompleted, lastUpdatedDate: today }, // Include lastUpdatedDate to keep track of the last update
        { new: true } // Return the updated document
      );
  
      return res.status(200).json(updatedHabit);
    } catch (err) {
      console.log("Error in updating task:", err);
      if (err instanceof mongoose.Error.CastError) {
        console.log("Database cast error:", err);
      } else if (err.name === "MongoError") {
        console.log("MongoDB error:", err);
      } else {
        console.log("General error:", err);
      }
      return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
    
  }
  
  

  return res.status(405).json({ message: 'Method not allowed' });
};
