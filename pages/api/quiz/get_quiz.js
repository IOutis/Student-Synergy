import dbConnect from "../../../lib/dbconnect";
import Quiz from "../../../models/QuizSchema";

const handleGetQuiz = async (req, res) => {
  await dbConnect();

  try {
    if (req.method === "GET") {
      const { id } = req.query;
      // console.log("ID : ",req)

      // Fetch the quiz by ID and populate the questions field
      const quiz = await Quiz.findById(id).populate("questions")
      console.log(quiz)

      // Return the quiz with populated questions
      return res.status(200).json(quiz);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json("ERROR!!!");
  }
};

export default handleGetQuiz;
