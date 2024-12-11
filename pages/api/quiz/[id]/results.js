import dbConnect from '../../../../lib/dbconnect';
import Answer from '../../../../models/AnswerSchema';
import Question from '../../../../models/QuestionSchema';
import Quiz from '../../../../models/QuizSchema';
import Result from '../../../../models/ResultSchema';
import NextAuth from '../../auth/[...nextauth]';
import User from '../../../../models/User';
import { getServerSession } from 'next-auth/next';

const handleResults = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // 1. Validate session and get user
    const session = await getServerSession(req, res, NextAuth);
    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 2. Get quiz and validate
    const { id } = req.query;
    const quiz = await Quiz.findById(id)
      .populate('questions')
      .select('title description questions timeLimit startTime endTime participants');

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // 3. Validate quiz timing
    const now = new Date();
    if (now < new Date(quiz.endTime)) {
      return res.status(400).json({ error: 'Quiz has not ended yet' });
    }

    // 4. Get all results for this quiz
    const allResults = await Result.find({
      reference: id,
      referenceType: 'Quiz'
    }).populate('user', 'name email');

    // 5. Get all answers for this quiz
    const allAnswers = await Answer.find({
      question: { $in: quiz.questions.map(q => q._id) }
    }).populate('user', 'name email');

    // 6. Process and format results
    const questionStats = quiz.questions.map(question => {
      const answersForQuestion = allAnswers.filter(
        a => a.question.toString() === question._id.toString()
      );

      const correctAnswers = answersForQuestion.filter(a => a.isCorrect).length;
      const totalAnswers = answersForQuestion.length;

      return {
        questionId: question._id,
        questionText: question.questionText,
        correctAnswerRate: totalAnswers ? (correctAnswers / totalAnswers) * 100 : 0,
        totalAttempts: totalAnswers
      };
    });

    // 7. Calculate overall statistics
    const stats = {
      totalParticipants: allResults.length,
      averageScore: allResults.length 
        ? (allResults.reduce((acc, curr) => acc + (curr.marksObtained / curr.totalMarks) * 100, 0) / allResults.length)
        : 0,
      highestScore: allResults.length 
        ? Math.max(...allResults.map(r => (r.marksObtained / r.totalMarks) * 100))
        : 0,
      lowestScore: allResults.length 
        ? Math.min(...allResults.map(r => (r.marksObtained / r.totalMarks) * 100))
        : 0,
      passRate: allResults.length 
        ? (allResults.filter(r => r.isPassed).length / allResults.length) * 100
        : 0
    };

    // 8. Get user's own result if they participated
    const userResult = allResults.find(
      r => r.user._id.toString() === user._id.toString()
    );

    // 9. Return formatted response
    return res.status(200).json({
      quizDetails: {
        title: quiz.title,
        description: quiz.description,
        timeLimit: quiz.timeLimit,
        totalQuestions: quiz.questions.length
      },
      overallStats: stats,
      questionStats,
      userResult: userResult ? {
        score: (userResult.marksObtained / userResult.totalMarks) * 100,
        isPassed: userResult.isPassed,
        submittedAt: userResult.submittedAt
      } : null,
      participants: allResults.map(r => ({
        name: r.user.name,
        email: r.user.email,
        score: (r.marksObtained / r.totalMarks) * 100,
        isPassed: r.isPassed,
        submittedAt: r.submittedAt
      }))
    });

  } catch (error) {
    console.error('Quiz results error:', error);
    return res.status(500).json({
      error: 'Failed to fetch quiz results',
      message: error.message
    });
  }
};

export default handleResults;