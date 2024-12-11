import { Question, Quiz, Answer, Result } from '../../../models/AllTaskModels';
import dbConnect from '../../../lib/dbconnect';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Quiz ID is required' });
  }

  try {
    await dbConnect();

    // Get the quiz first to check if it exists
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Delete all associated data in this order:
    // 1. Delete all answers associated with the quiz's questions
    await Answer.deleteMany({
      question: { $in: quiz.questions }
    });

    // 2. Delete all results associated with this quiz
    await Result.deleteMany({
      reference: id,
      referenceType: 'Quiz'
    });

    // 3. Delete all questions associated with this quiz
    await Question.deleteMany({
      parent: id,
      parentModel: 'Quiz'
    });

    // 4. Finally, delete the quiz itself
    await Quiz.findByIdAndDelete(id);

    return res.status(200).json({ message: 'Quiz and all associated data deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return res.status(500).json({ message: 'Error deleting quiz', error: error.message });
  }
}