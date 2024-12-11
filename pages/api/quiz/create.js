// pages\api\quiz\create.js
import Quiz from '../../../models/QuizSchema';
import Question from '../../../models/QuestionSchema';
import Community from '../../../models/CommunityModel';
import mongoose from 'mongoose';

export default async function createQuiz(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { title, description, timeLimit, startTime, endTime, community, questions } = req.body;

    if (!title || !timeLimit || !startTime || !endTime || !community || !questions || questions.length === 0) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        // Step 1: Create the Quiz
        const quiz = new Quiz({
            title,
            description,
            timeLimit,
            startTime,
            endTime,
            community,
            questions: [] // Will populate with question IDs later
        });

        await quiz.save({ session });

        // Step 2: Create the Questions and associate them with the quiz
        const questionPromises = questions.map(async (q) => {
            const question = new Question({
                parent: quiz._id,
                parentModel: 'Quiz',
                type: q.type,
                questionText: q.questionText,
                options: q.options,
                correctAnswers: [q.correctAnswer], // assuming single correct answer for simplicity
                marks: q.marks
            });

            await question.save({ session });

            // Push the question ID into the quiz
            quiz.questions.push(question._id);
        });

        await Promise.all(questionPromises);

        // Step 3: Save the quiz with the updated questions
        await quiz.save({ session });

        // Step 4: Add the quiz to the community's quizzes array
        await Community.updateOne(
            { _id: community },
            { $push: { quizzes: quiz._id } },
            { session }
        );

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({ message: 'Quiz created successfully', quiz });

    } catch (error) {
        console.error('Error creating quiz:', error);

        // Rollback the transaction if an error occurs
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }

        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
