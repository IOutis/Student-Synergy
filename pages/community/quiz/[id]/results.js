import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Users, Clock, FileQuestion } from 'lucide-react';
import { useRouter } from 'next/router';

const QuizResults = () => {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/quiz/${id}/results`);
        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }
        const resultData = await response.json();
        setData(resultData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  // Format question text with proper styling for code and HTML elements
  const formatQuestionText = (text) => {
    // Function to detect and format code blocks
    const formatCodeBlocks = (text) => {
      const parts = text.split('```');
      return parts.map((part, index) => {
        if (index % 2 === 1) { // Code block
          return (
            <pre key={index} className="bg-gray-100 p-3 rounded-lg font-mono text-sm my-2 overflow-x-auto">
              <code>{part.trim()}</code>
            </pre>
          );
        }
        return formatInlineElements(part);
      });
    };

    // Function to format inline elements like bold, code, etc.
    const formatInlineElements = (text) => {
      // Replace HTML tags with styled spans
      const processedText = text
        .split(/(<[^>]+>)/g)
        .map((part, index) => {
          if (part.startsWith('<') && part.endsWith('>')) {
            return (
              <code key={index} className="bg-gray-100 px-1 rounded text-sm font-mono">
                {part}
              </code>
            );
          }
          // Format inline code blocks
          return part.split('`').map((codePart, codeIndex) => {
            if (codeIndex % 2 === 1) {
              return (
                <code key={`${index}-${codeIndex}`} className="bg-gray-100 px-1 rounded text-sm font-mono">
                  {codePart}
                </code>
              );
            }
            return codePart;
          });
        });

      return <span key={Math.random()}>{processedText}</span>;
    };

    return <div className="question-text">{formatCodeBlocks(text)}</div>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading results...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-semibold">Error</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const { quizDetails, overallStats, questionStats, userResult, participants } = data;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Quiz Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{quizDetails.title}</h1>
        <p className="text-gray-600">{quizDetails.description}</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Total Participants</p>
              <p className="text-2xl font-bold">{overallStats.totalParticipants}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Trophy className="h-8 w-8 text-yellow-500 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold">{overallStats.averageScore.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-green-500 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Time Limit</p>
              <p className="text-2xl font-bold">{quizDetails.timeLimit} min</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FileQuestion className="h-8 w-8 text-purple-500 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Pass Rate</p>
              <p className="text-2xl font-bold">{overallStats.passRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Result */}
      {userResult && (
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Your Performance</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Your Score</p>
                <p className="text-3xl font-bold">{userResult.score.toFixed(1)}%</p>
              </div>
              <div className={`px-4 py-2 rounded-full ${
                userResult.isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {userResult.isPassed ? 'Passed' : 'Failed'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Question Details and Performance */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Questions Analysis</h2>
          <div className="space-y-6">
            {questionStats.map((question, index) => (
              <div key={index} className="border-b pb-6 last:border-b-0">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg mb-2">
                      Question {index + 1}: {formatQuestionText(question.questionText)}
                    </h3>
                    <div className="mt-2 p-3 bg-green-50 rounded-lg">
                      <p className="text-green-800 font-medium">Correct Answer:</p>
                      <p className="text-green-700">{question.correctAnswer}</p>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-lg font-bold text-blue-600">
                      {question.correctAnswerRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-500">correct responses</div>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{question.totalAttempts}</span> total attempts
                    {question.commonMistakes && (
                      <>
                        <br />
                        <span className="font-medium">Common mistakes:</span> {question.commonMistakes}
                      </>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Question Performance Chart */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Performance Distribution</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={questionStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="questionId" label={{ value: 'Questions', position: 'bottom' }} />
                <YAxis label={{ value: 'Correct Answer Rate (%)', angle: -90, position: 'left' }} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-4 border rounded shadow">
                          <p className="text-sm">{payload[0].payload.questionText}</p>
                          <p className="font-bold">{`${payload[0].value.toFixed(1)}% Correct`}</p>
                          <p className="text-sm text-gray-600">{`${payload[0].payload.totalAttempts} Attempts`}</p>
                          <p className="text-sm text-green-600 mt-2">Correct: {payload[0].payload.correctAnswer}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="correctAnswerRate" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Participants Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Participants</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Score</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{participant.name}</p>
                        <p className="text-sm text-gray-600">{participant.email}</p>
                      </div>
                    </td>
                    <td className="p-4">{participant.score.toFixed(1)}%</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        participant.isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {participant.isPassed ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(participant.submittedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;