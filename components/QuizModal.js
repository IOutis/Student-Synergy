// components/QuizModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import {
  Button, FormControl, FormLabel, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Textarea, Alert, AlertIcon, Select, Box
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
const CustomEditor = dynamic(() => import('./QuestionComp'), { ssr: false });

const QuizModal = ({ isOpen, onClose, communityId, onQuizCreated }) => {
  const [alertMessage, setAlertMessage] = useState('');
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [questions, setQuestions] = useState([{
    type: 'mcq', 
    questionText: '', 
    options: ['', ''], // Minimum two options initially
    correctAnswer: '', 
    marks: null || 0
  }]);
  const [files, setFiles] = useState([null]);

  const handleCreateQuiz = async () => {
    if (!quizTitle || !timeLimit || !startTime || !endTime || questions.length === 0) {
      setAlertMessage('Please fill in all required fields.');
      return;
    }
    // Prepare quiz data
    const quizData = {
      title: quizTitle,
      description: quizDescription,
      timeLimit: Number(timeLimit),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      community: communityId,
      questions,
    };

    try {
      const response = await axios.post('/api/quiz/create', quizData);
      alert('Quiz created successfully!');
      resetForm();
      onClose();
      if (onQuizCreated) {
        onQuizCreated(response.data);
      }
    } catch (error) {
      console.error('Error creating quiz', error);
      alert('Failed to create quiz. Try again later.');
    }
  };

  const resetForm = () => {
    setQuizTitle('');
    setQuizDescription('');
    setTimeLimit('');
    setStartTime('');
    setEndTime('');
    setQuestions([{ type: 'mcq', questionText: '', options: ['', ''], correctAnswer: '', marks: 0 }]);
    setFiles([null]);
    setAlertMessage('');
  };

  const handleQuestionChange = (index, key, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][key] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { type: 'mcq', questionText: '', options: ['', ''], correctAnswer: '', marks: '' }]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push(''); // Add a new empty option
    setQuestions(updatedQuestions);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].options.length > 2) { // Ensure at least two options remain
      updatedQuestions[questionIndex].options.splice(optionIndex, 1);
      setQuestions(updatedQuestions);
    }
  };

  const handleFileChange = (index, e) => {
    const newFiles = [...files];
    newFiles[index] = e.target.files[0];
    setFiles(newFiles);
  };

  const deselectFile = (index, e) => {
    const newFiles = [...files];
    newFiles[index] = null; // Remove the specific file
    setFiles(newFiles);

    // Reset the file input field itself
    e.target.previousSibling.value = '';
  };

  const addFileInput = () => {
    setFiles([...files, null]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Quiz</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {alertMessage && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              {alertMessage}
            </Alert>
          )}
          <FormControl isRequired>
            <FormLabel>Quiz Title</FormLabel>
            <Input
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="Enter quiz title"
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Quiz Description</FormLabel>
            <Textarea
              value={quizDescription}
              onChange={(e) => setQuizDescription(e.target.value)}
              placeholder="Enter quiz description"
            />
          </FormControl>
          <FormControl mt={4} isRequired>
            <FormLabel>Time Limit (in minutes)</FormLabel>
            <Input
              type="number"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              placeholder="Enter time limit"
            />
          </FormControl>
          <FormControl mt={4} isRequired>
            <FormLabel>Start Time</FormLabel>
            <Input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </FormControl>
          <FormControl mt={4} isRequired>
            <FormLabel>End Time</FormLabel>
            <Input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </FormControl>

          {questions.map((question, index) => (
            <Box key={index} mt={4} p={4} border="1px solid #ddd" borderRadius="md">
              <FormControl isRequired>
                <FormLabel>Question {index + 1}</FormLabel>
                <CustomEditor
                  initialContent={question.questionText}
                  onContentChange={(content) => handleQuestionChange(index, 'questionText', content)}
                />

                {files.map((file, fileIndex) => (
                  <div key={fileIndex} style={{ marginBottom: '10px' }}>
                    <input 
                      type="file" 
                      onChange={(e) => handleFileChange(fileIndex, e)} 
                      style={{ display: 'block', marginBottom: '5px' }} 
                    />
                    {file && (
                      <button 
                        type="button" 
                        onClick={(e) => deselectFile(fileIndex, e)} 
                        className="text-red-500 underline"
                      >
                        Deselect File
                      </button>
                    )}
                  </div>
                ))}

                <button 
                  type="button" 
                  onClick={addFileInput} 
                  style={{ marginBottom: '10px' }}
                  className="mt-3 text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
                >
                  Add another file
                </button>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Question Type</FormLabel>
                <Select
                  value={question.type}
                  onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                >
                  <option value="mcq">Multiple Choice</option>
                  <option value="descriptive">Descriptive</option>
                </Select>
              </FormControl>

              {question.type === 'mcq' && (
                <>
                  <FormControl mt={4}>
                    <FormLabel>Options</FormLabel>
                    {question.options.map((option, optionIndex) => (
                      <Box key={optionIndex} display="flex" alignItems="center" mt={2}>
                        <Input
                          value={option}
                          onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                        {question.options.length > 2 && (
                          <Button colorScheme="red" ml={2} onClick={() => removeOption(index, optionIndex)}>
                            Remove
                          </Button>
                        )}
                      </Box>
                    ))}
                    <Button mt={2} colorScheme="blue" onClick={() => addOption(index)}>
                      Add Option
                    </Button>
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Correct Answer</FormLabel>
                    <Input
                      value={question.correctAnswer}
                      onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                      placeholder="Enter correct answer"
                    />
                  </FormControl>
                </>
              )}

              <FormControl mt={4} isRequired>
                <FormLabel>Marks</FormLabel>
                <Input
                  value={question.marks}
                  onChange={(e) => handleQuestionChange(index, 'marks', e.target.value)}
                  placeholder="Enter marks for this question"
                />
              </FormControl>

              {index > 0 && (
                <Button colorScheme="red" mt={4} onClick={() => removeQuestion(index)}>
                  Remove Question
                </Button>
              )}
            </Box>
          ))}

          <Button colorScheme="blue" mt={4} onClick={addQuestion}>
            Add One More Question
          </Button>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleCreateQuiz}>
            Create Quiz
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default QuizModal;