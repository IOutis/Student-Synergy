import Community from "../../../models/CommunityModel";
import Quiz from '../../../models/QuizSchema'
import Question from '../../../models/QuestionSchema'
import dbConnect from '../../../lib/dbconnect'

const handleGet = async(req,res)=>{
    await dbConnect();
    try{
        if(req.method==="GET"){
            const {id} = req.query
            console.log("ID =",id)
            // const quiz = await Quiz.findById(req.params.id)
            // const questions = await Question.find({quizId:req.params.id})
            // conosle.log("quiz = ",quiz)
            // res.json({quiz,questions})
            const community = await Community.findById(id).populate('quizzes')
            console.log(community.quizzes)
            return res.status(200).json({"quizzes":community.quizzes})
        }
    }
    catch(err){
        console.log(err)
        return res.status(500).json({"error":err});
    }
}
export default handleGet