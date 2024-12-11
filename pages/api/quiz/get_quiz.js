import dbConnect from "../../../lib/dbconnect";
import Quiz from "../../../models/QuizSchema";

const handleGetQuiz = async (req, res) => {
  await dbConnect();

  try {
    if (req.method === "GET") {
      const { id } = req.query;
      // console.log("ID : ",req)

      // Fetch the quiz by ID and populate the questions field
      const quiz = await Quiz.findById(id)
      .populate('questions')
      .select('questions timeLimit startTime endTime participants');
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // 3. Validate quiz timing
    const now = new Date();
    if (now > new Date(quiz.endTime)) {
      return res.status(400).json({ error: 'Quiz has ended' });
    }

    if (now < new Date(quiz.startTime)) {
      return res.status(400).json({ error: 'Quiz has not started yet' });
    }
      

      // Return the quiz with populated questions
      return res.status(200).json(quiz);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json("ERROR!!!");
  }
};

export default handleGetQuiz;
