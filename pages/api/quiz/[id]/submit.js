import dbConnect from '../../../../lib/dbconnect';
import Answer from '../../../../models/AnswerSchema';
import Question from '../../../../models/QuestionSchema';
import Quiz from '../../../../models/QuizSchema';
import Result from '../../../../models/ResultSchema';
import User from '../../../../models/User';
import { getServerSession } from 'next-auth/next';
import NextAuth from '../../auth/[...nextauth]';

const handleSubmit = async (req, res) => {
  if (req.method !== 'POST') {
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

    // 2. Get quiz and validate submission
    const { answers } = req.body;
    const { id: quizId } = req.query;

    const quiz = await Quiz.findById(quizId)
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

    // 4. Check if user has already submitted
    const existingResult = await Result.findOne({
      user: user._id,
      reference: quizId,
      referenceType: 'Quiz'
    });

    if (existingResult) {
      return res.status(400).json({ error: 'Quiz already submitted' });
    }

    // 5. Validate that all questions are answered
    const answeredQuestionIds = Object.keys(answers);
    const quizQuestionIds = quiz.questions.map(q => q._id.toString());
    
    if (!quizQuestionIds.every(id => answeredQuestionIds.includes(id))) {
      return res.status(400).json({ error: 'All questions must be answered' });
    }

    // 6. Process answers and calculate score
    let correctAnswers = 0;
    let totalMarks = 0;
    const answerPromises = [];

    for (const question of quiz.questions) {
      const userAnswer = answers[question._id];
      const isCorrect = question.correctAnswers.includes(userAnswer);
      
      totalMarks += question.marks;
      if (isCorrect) {
        correctAnswers += question.marks;
      }

      // Create new answer document
      const answer = new Answer({
        question: question._id,
        answer: userAnswer,
        user: user._id,
        isCorrect
      });

      answerPromises.push(answer.save());
    }

    // 7. Save all answers in parallel
    await Promise.all(answerPromises);

    // 8. Create quiz result
    const result = new Result({
      user: user._id,
      reference: quizId,
      referenceType: 'Quiz',
      totalMarks,
      marksObtained: correctAnswers,
      isPassed: (correctAnswers / totalMarks) >= 0.5, // 50% passing criteria
      submittedAt: now
    });

    await result.save();

    // 9. Update quiz participants
    if (!quiz.participants.includes(user._id)) {
      quiz.participants.push(user._id);
      await quiz.save();
    }

    return res.status(200).json({
      message: 'Quiz submitted successfully',
      result: {
        totalQuestions: quiz.questions.length,
        correctAnswers,
        totalMarks,
        marksObtained: correctAnswers,
        percentage: ((correctAnswers / totalMarks) * 100).toFixed(2)
      }
    });

  } catch (error) {
    console.error('Quiz submission error:', error);
    return res.status(500).json({
      error: 'Failed to submit quiz',
      message: error.message
    });
  }
};

export default handleSubmit;