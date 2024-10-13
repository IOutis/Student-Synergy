import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
const QuizPage = () => {
    const router = useRouter();

  const { id } = router.query; // Assuming you're passing the quizId in the route
  const [quiz, setQuiz] = useState(null); // To store the quiz data
  const [answers, setAnswers] = useState({}); // To store user's answers
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch the quiz details and questions when the component loads
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`/api/quiz/get_quiz`,{
            params: { id: id }
        });
        console.log(response.data);
        setQuiz(response.data);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    fetchQuiz();
  }, [id]);

  // Handle the answer selection
  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: selectedOption
    }));
  };

  // Handle quiz submission
  const handleSubmit = async () => {
    try {
      const response = await axios.post(`/api/quiz/${id}/submit`, { answers });
      setIsSubmitted(true);
      console.log('Quiz submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  if (!quiz) {
    return <div>Loading...</div>;
  }

  if (isSubmitted) {
    return <div>Quiz submitted! Thank you for participating.</div>;
  }

  return (
    <div className="quiz-container">
      <h1>{quiz.title}</h1>
      <p>{quiz.description}</p>
      <div className="questions-list">
        {quiz.questions.map((question, index) => (
          <div key={question._id} className="question-block">
            <h3>Question {index + 1}: {question.questionText}</h3>
            {question.type === 'mcq' && (
              <ul>
                {question.options.map((option, optionIndex) => (
                  <li key={optionIndex}>
                    <label>
                      <input
                        type="radio"
                        name={`question-${question._id}`}
                        value={option}
                        checked={answers[question._id] === option}
                        onChange={() => handleOptionChange(question._id, option)}
                      />
                      {option}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <button onClick={handleSubmit} className="submit-btn">Submit</button>
    </div>
  );
};

export default QuizPage;
