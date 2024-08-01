import dbConnect from '../../../lib/dbconnect';
import NewDailyTask from '../../../models/DailyTasks';
import User from '../../../models/User';

export default async function handler(req, res) {
  await dbConnect();
  console.log("DB CONNECTED!!!");
  console.log(req.method);
  if (req.method === 'POST') {
    try {
      const { email,title, description, completed, date } = req.body;
      let user = await User.findOne({ email }); // Adjust this if email is not sent

      if (!user) {
        console.log("USER NOT FOUND");
        user = new User({
          email,
          dailyTasks: [],
        });

        await user.save();
       
      }

      const newTask = new NewDailyTask({
        title,
        description,
        completed,
        date,
      });

      await newTask.save();
      user.dailyTasks.push(newTask);
      await user.save();

      return res.status(201).json(newTask);
    } catch (err) {
      console.log("Error in saving task:", err);
      return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id } = req.query;
      const { title, description, completed, date } = req.body;

      const updatedTask = await NewDailyTask.findByIdAndUpdate(
        id,
        { title, description, completed, date },
        { new: true }
      );

      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }

      return res.status(200).json(updatedTask);
    } catch (err) {
      console.log("Error in updating task:", err);
      return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
  }
  else if(req.method==="DELETE"){
    try{
      const { id } = req.query;
      const deletedHabit = await NewDailyTask.findByIdAndDelete(id);
      if(!deletedHabit){
        console.log("DELETION ERROR")
        return res.status(404).json({ message: 'Habit not found' });
        }
        return res.status(200).json({ message: 'Habit deleted successfully' });
        }catch(err){
          console.log("Error in deleting task", err);
          return res.status(500).json({ message: 'Internal Server Error', error: err.message
            });
          }
  }


  return res.status(405).json({ message: 'Method not allowed' });
}
