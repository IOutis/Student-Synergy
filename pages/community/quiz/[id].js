import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const QuizPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch quiz and initialize timer
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`/api/quiz/get_quiz`, {
          params: { id }
        });
        
        const quizData = response.data;
        setQuiz(quizData);
        
        // Initialize timer if quiz has time limit
        if (quizData.timeLimit) {
          const endTime = new Date(quizData.endTime).getTime();
          const now = new Date().getTime();
          setTimeLeft(Math.max(0, Math.floor((endTime - now) / 1000)));
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
  };
  const handleDescriptiveAnswer = (questionId, text) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: text
    }));
  };

  const validateAnswers = () => {
    const answeredQuestions = Object.keys(answers);
    const totalQuestions = quiz.questions.length;
    
    if (answeredQuestions.length < totalQuestions) {
      setError(`Please answer all questions (${answeredQuestions.length}/${totalQuestions} answered)`);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateAnswers()) return;

    try {
      setError(null);
      const response = await axios.post(`/api/quiz/${id}/submit`, {
        answers,
        submittedAt: new Date().toISOString()
      });
      
      setIsSubmitted(true);
      router.push(`/community/quiz/${id}/results`); // Redirect to results page
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit quiz');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative max-w-2xl mx-auto mt-4" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!quiz) return null;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md mb-6 p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
          {timeLeft !== null && (
            <div className="text-orange-600 font-semibold">
              Time remaining: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </div>
          )}
        </div>
        <p className="text-gray-600">{quiz.description}</p>
      </div>

      <div className="space-y-6">
        {quiz.questions.map((question, index) => (
          <div key={question._id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              Question {index + 1}: {question.questionText}
            </h3>
            {question.type === 'mcq' && (
              <div className="space-y-3">
                {question.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-200"
                  >
                    <input
                      type="radio"
                      name={`question-${question._id}`}
                      value={option}
                      checked={answers[question._id] === option}
                      onChange={() => handleOptionChange(question._id, option)}
                      className="h-4 w-4"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}
            {question.type === 'descriptive' && (
              <div className="mt-2">
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-32 resize-y"
                  placeholder="Type your answer here..."
                  value={answers[question._id] || ''}
                  onChange={(e) => handleDescriptiveAnswer(question._id, e.target.value)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizPage;