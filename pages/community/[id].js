import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import SectionsComponent from '../../components/SectionsComponent';

import { ChevronDownIcon } from '@chakra-ui/icons';
import dynamic from 'next/dynamic';
const CustomEditor = dynamic(() => import('../../components/QuestionComp'), { ssr: false });

import {
  Box, Button, FormControl, FormLabel, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, useDisclosure, Textarea, Alert, AlertIcon, Select, Menu, MenuButton, MenuItem, MenuList
} from '@chakra-ui/react';

export default function Community() {
  const [files, setFiles] = useState([null]);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [useraccess, setUseraccess] = useState(false);
  const [adminaccess, setAdminaccess] = useState(false);
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [msg, setMsg] = useState("Successfully joined the community!");
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState(""); 
  const [showPasswordField, setShowPasswordField] = useState(false); 

  //section 
  const [sectionType, setSectionType] = useState("regular");
  const [sectionModalTitle, setSectionModalTitle] = useState("Add New Section");
  const [sectionTitle, setSectionTitle] = useState(""); 
  const [sectionDescription, setSectionDescription] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [sections, setSections] = useState([]);
  const [qaSectionExists, setQaSectionExists] = useState(false);
  
  const {
    isOpen: isQuizModalOpen,
    onOpen: onOpenQuizModal,
    onClose: onCloseQuizModal,
  } = useDisclosure();

  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [questions, setQuestions] = useState([{
    type: 'mcq', 
    questionText: '', 
    options: ['', ''], 
    correctAnswer: '',
    marks: 0
  }]);
  const [quizzes, setQuizzes] = useState([])

  // Clear alert message after 5 seconds
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  //community controls
  const handleJoinCommunity = async () => {
    try {
      const response = await axios.get('/api/communities/join', {
        params: {
          communityId: id,
          userEmail: session.user.email,
          password: showPasswordField ? password : undefined,
        }
      });
      
      const successMsg = community.approvalType === "manual"
        ? 'Your request to join the community has been sent to the admin for approval.'
        : 'Successfully joined the community!';
  
      alert(successMsg);
      window.location.reload(); 
    } catch (err) {
      console.error('Error joining community', err);
      alert('Failed to join community. Try again after sometime');
    }
  };

  useEffect(() => {
    if (id && session) {
      const fetchCommunityData = async () => {
        try {
          const response = await axios.get(`/api/communities/${id}`);
          setCommunity(response.data);
          
          if (response.data.sections?.length > 0) {
            const sectionResponse = await axios.get(`/api/communities/${response.data._id}/sections`, {
              params: { id: response.data._id },
            });
            const sectionsData = sectionResponse.data.sections
            setSections(sectionResponse.data.sections);

            const qaSection = sectionsData.find(section => section.title === "Q&A Section");
            if (qaSection) setQaSectionExists(true);
          }
          
          if(response.data.quizzes?.length > 0) {
            const quizzesResponse = await axios.get(`/api/communities/get_quizzes`, {
              params: { id: response.data._id },
            });
            console.log("Quiz Response", quizzesResponse.data.quizzes);
            setQuizzes(quizzesResponse.data.quizzes);
          }

          if (response.data.adminEmail === session.user.email) {
            setAdminaccess(true);
            setUseraccess(true);
          }
          
          if(response.data.approvalType === "manual"){
            setMsg("Your request to join the community has been sent to the admin for approval.");
          }
          
          if (response.data.approvalType === "password") {
            setShowPasswordField(true);
          }
  
          if (response.data && response.data.members) {
            if (response.data.members.includes(session.user.email)) {
              setUseraccess(true);
            }
          }
        } catch (error) {
          console.error('Error fetching community data', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchCommunityData();
    } else if (!session) {
      setLoading(false);
    }
  }, [id, session]);

  useEffect(() => {
    const fetchSectionPosts = async () => {
      if (sections.length > 0) {
        try {
          const updatedSections = await Promise.all(
            sections.map(async (section) => {
              if (section.posts && section.posts.length > 0) {
                const postResponse = await axios.get(`/api/communities/${community._id}/section/${section._id}`);
                return {
                  ...section,
                  posts: postResponse.data.sections,  
                };
              } else {
                return section;
              }
            })
          );
          setSections(updatedSections);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      }
    };
  
    if (community && community._id) {
      fetchSectionPosts();
    }
  }, [sections, community]);

  // Helper function to truncate HTML content safely
  const truncateHTMLContent = (htmlContent, maxLength) => {
    if (!htmlContent) return '';
    const plainText = DOMPurify.sanitize(htmlContent, { ALLOWED_TAGS: [] });
    return plainText.length > maxLength
      ? plainText.substring(0, maxLength) + "..."
      : plainText;
  };

  //section controls
  const handleAddQASection = async () => {
    try {
      const response = await axios.post(`/api/communities/${id}/sections`, {
        title: "Q&A Section",
        description: "Post your queries and doubts here. Community members will respond.",
        qaSection: true
      });
      alert("Q&A Section added successfully!");
      setQaSectionExists(true);
      window.location.reload();
    } catch (error) {
      console.error('Error adding Q&A section', error);
      alert('Failed to add Q&A Section. Try again later.');
    }
  };
  
  const openSectionModal = (type) => {
    setSectionType(type);
    
    // Reset form fields first
    setSectionTitle("");
    setSectionDescription("");
    
    // Set modal title based on section type
    if (type === "regular") {
      setSectionModalTitle("Add New Section");
    } else if (type === "qa") {
      setSectionModalTitle("Add Q&A Section");
      // Pre-fill fields for Q&A section
      setSectionTitle("Q&A Section");
      setSectionDescription("Post your queries and doubts here. Community members will respond.");
    } else if (type === "tasks") {
      setSectionModalTitle("Add Group Tasks Section");
      // Pre-fill fields for Tasks section
      setSectionTitle("Group Tasks");
      setSectionDescription("Collaborate on tasks and track progress together.");
    }
    
    onOpen();
  };
  
  const handleAddSection = async () => {
    if (!sectionTitle || !sectionDescription) {
      setAlertMessage("Please fill in both the title and description.");
      return;
    }

    try {
      // Add section type to the request
      const response = await axios.post(`/api/communities/${id}/sections`, {
        title: sectionTitle,
        description: sectionDescription,
        sectionType: sectionType,
        qaSection: sectionType === "qa",
        tasksSection: sectionType === "tasks"
      });
      
      alert("Section added successfully!");
      
      // Clear form fields
      setSectionTitle(""); 
      setSectionDescription("");
      
      // Close modal
      onClose();
      
      // Reload the page to show new section
      window.location.reload();
      
    } catch (error) {
      console.error('Error adding section', error);
      alert('Failed to add section. Try again after sometime.');
    }
  };

  const handleDeleteSection = async (sectionId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this section?");
    if (confirmDelete) {
      try {
        const response = await axios.delete(`/api/communities/section_delete?id=${sectionId}`);
        console.log("response : ", response);
  
        if (response.status !== 200) {
          throw new Error('Failed to delete the section');
        }
        alert('Section Deleted successfully');
        window.location.reload();
      } catch(error) {
        console.error('Error deleting section:', error.message);
        alert('Failed to delete the section. Please try again later.');
      }
    }
  };

  //post controls
  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (confirmDelete) {
      try {
        const res = await fetch(`/api/comm_post/delete_post?id=${postId}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          throw new Error('Failed to delete the post');
        }

        setPosts(posts.filter(post => post._id !== postId));
        alert('Post deleted successfully');
        window.location.reload();
      } catch (error) {
        console.error('Error deleting post:', error.message);
        alert('Failed to delete the post. Please try again later.');
      }
    }
  };

  //Quiz APIs and Controls
  const handleDeleteQuiz = async (quizId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this quiz? This will delete all associated questions, answers, and results.");
    
    if (confirmDelete) {
      try {
        const response = await axios.delete(`/api/quiz/delete?id=${quizId}`);
        if (response.status === 200) {
          alert('Quiz deleted successfully');
          // Update the quizzes state to remove the deleted quiz
          setQuizzes(quizzes.filter(quiz => quiz._id !== quizId));
        }
      } catch (error) {
        console.error('Error deleting quiz:', error);
        alert('Failed to delete quiz. Please try again.');
      }
    }
  };

  // Fixed quiz form handlers
  const handleCreateQuiz = async () => {
    if (!quizTitle || !timeLimit || !startTime || !endTime || questions.length === 0) {
      setAlertMessage('Please fill in all required fields.');
      return;
    }
    
    // Validate questions
    for (const question of questions) {
      if (!question.questionText || !question.marks) {
        setAlertMessage('Please complete all questions with text and marks.');
        return;
      }
      
      if (question.type === 'mcq') {
        if (!question.correctAnswer) {
          setAlertMessage('Please provide correct answers for all multiple choice questions.');
          return;
        }
        
        // Check if options are filled
        if (question.options.some(option => !option)) {
          setAlertMessage('Please fill in all options for multiple choice questions.');
          return;
        }
      }
    }
    
    // Prepare quiz data
    const quizData = {
      title: quizTitle,
      description: quizDescription,
      timeLimit: Number(timeLimit),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      community: id,
      questions,
    };

    try {
      const response = await axios.post('/api/quiz/create', quizData);
      alert('Quiz created successfully!');
      onCloseQuizModal();
      resetForm();
      window.location.reload();
    } catch (error) {
      console.error('Error creating quiz', error);
      setAlertMessage('Failed to create quiz. Try again later.');
    }
  };

  const resetForm = () => {
    setQuizTitle('');
    setQuizDescription('');
    setTimeLimit('');
    setStartTime('');
    setEndTime('');
    setQuestions([{ 
      type: 'mcq', 
      questionText: '', 
      options: ['', ''], 
      correctAnswer: '', 
      marks: 0 
    }]);
    setFiles([null]);
    setAlertMessage('');
  };

  // Improved question handling
  const handleQuestionChange = (index, key, value) => {
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [key]: value
      };
      return updatedQuestions;
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      const updatedOptions = [...updatedQuestions[questionIndex].options];
      updatedOptions[optionIndex] = value;
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        options: updatedOptions
      };
      return updatedQuestions;
    });
  };

  const addQuestion = () => {
    setQuestions(prevQuestions => [
      ...prevQuestions, 
      { 
        type: 'mcq', 
        questionText: '', 
        options: ['', ''], 
        correctAnswer: '', 
        marks: 0 
      }
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions(prevQuestions => 
      prevQuestions.filter((_, i) => i !== index)
    );
  };

  const addOption = (questionIndex) => {
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        options: [...updatedQuestions[questionIndex].options, '']
      };
      return updatedQuestions;
    });
  };

  const removeOption = (questionIndex, optionIndex) => {
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      if (updatedQuestions[questionIndex].options.length > 2) {
        const updatedOptions = [...updatedQuestions[questionIndex].options];
        updatedOptions.splice(optionIndex, 1);
        updatedQuestions[questionIndex] = {
          ...updatedQuestions[questionIndex],
          options: updatedOptions
        };
      }
      return updatedQuestions;
    });
  };

  // Improved file handling
  const handleFileChange = (index, e) => {
    const newFiles = [...files];
    newFiles[index] = e.target.files[0];
    setFiles(newFiles);
  };
  
  const deselectFile = (index, e) => {
    setFiles(prevFiles => {
      const newFiles = [...prevFiles];
      newFiles[index] = null;
      return newFiles;
    });
    
    // Reset the file input value
    if (e.target.previousSibling) {
      e.target.previousSibling.value = '';
    }
  };

  const addFileInput = () => {
    setFiles(prevFiles => [...prevFiles, null]);
  };
    
  if (!session) {
    return (
      <div>
        <p>Not Logged in</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {community ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{community.name}</h1>
          <p className="text-lg text-gray-600 mb-6">{community.description}</p>

          {adminaccess && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-700">Admin Controls</h2>
              <p className="text-gray-600 mb-2">Requests: {community.joinRequests.length}</p>
              <p className="text-gray-600 mb-4">Members joined: {community.members.length}</p>
              <Link href={`/community/${id}/requests`}>
                <button className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-700 transition">
                  View Join Requests
                </button>
              </Link>
              <Link href={`/community/${id}/settings`}>
                <button className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition mr-4">
                  Settings
                </button>
              </Link>
              
              <div className="flex flex-wrap gap-4 w-full">
                {/* Section creation dropdown */}
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="teal">
                    Add Section
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => openSectionModal("regular")}>
                      Regular Section
                    </MenuItem>
                    <MenuItem onClick={() => openSectionModal("qa")}>
                      Q&A Section
                    </MenuItem>
                    <MenuItem onClick={() => openSectionModal("tasks")}>
                      Group Tasks Section
                    </MenuItem>
                  </MenuList>
                </Menu>
              </div>
              <Button colorScheme="blue" onClick={onOpenQuizModal} mt={4}>
                Create Quiz
              </Button>
            </div>
          )}

          {useraccess && (
            <div>
              <SectionsComponent 
                sections={sections}
                community={community}
                adminaccess={adminaccess}
                session={session}
                handleDeleteSection={handleDeleteSection}
                handleDelete={handleDelete}
                truncateHTMLContent={truncateHTMLContent}
                id={id}
              />
            </div>
          )}
          
          {useraccess && community.quizzes && community.quizzes.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-blue-700 mb-4">Quizzes</h2>
              <div className="space-y-6">
                {quizzes.map((quiz) => (
                  <div key={quiz._id} className="bg-white rounded-md shadow-md p-6 mb-6">
                    <h2 className="font-semibold text-lg text-gray-900">{quiz.title}</h2>
                    <h4 className="font-medium text-gray-700 mt-2">Time Limit: {quiz.timeLimit} minutes</h4>
                    <h4 className="font-medium text-gray-700 mt-2">
                      Start Time: {new Date(quiz.startTime).toLocaleString()}
                    </h4>
                    <h4 className="font-medium text-gray-700 mt-2">
                      End Time: {new Date(quiz.endTime).toLocaleString()}
                    </h4>
                    <Link className="font-medium text-gray-700 mt-2" href={`/community/quiz/${quiz._id}`}>
                      <button>Click Here to attempt</button>
                    </Link>

                    {adminaccess && (
                      <button
                        onClick={() => handleDeleteQuiz(quiz._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
                      >
                        Delete Quiz
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!useraccess && (
            <div className="mt-6">
              <p className="text-red-500 text-lg mb-4">You are not authorized to view this community&apos;s content.</p>
              {showPasswordField && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Enter Community Password:</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Password"
                  />
                </div>
              )}
              <button
                onClick={handleJoinCommunity}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Join Community
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-600 text-xl">Community not found or error loading data.</p>
        </div>
      )}

      {/* Modal for Adding Section */}
      <Modal isOpen={isOpen} onClose={() => {
        setAlertMessage('');
        onClose();
      }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{sectionModalTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {alertMessage && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                {alertMessage}
              </Alert>
            )}
            <FormControl>
              <FormLabel>Section Title</FormLabel>
              <Input
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                placeholder="Enter section title"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Section Description</FormLabel>
              <Textarea
                value={sectionDescription}
                onChange={(e) => setSectionDescription(e.target.value)}
                placeholder="Enter section description"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddSection}>
              Add Section
            </Button>
            <Button variant="ghost" onClick={() => {
              setAlertMessage('');
              onClose();
            }}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal for Creating Quiz */}
      <Modal isOpen={isQuizModalOpen} onClose={() => {
        setAlertMessage('');
        onCloseQuizModal();
      }}>
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
                    type="number"
                    value={question.marks}
                    onChange={(e) => handleQuestionChange(index, 'marks', e.target.value)}
                    placeholder="Enter marks for this question"
                  />
                </FormControl>

                {/* File upload section */}
                <FormControl mt={4}>
                  <FormLabel>Attachments (Optional)</FormLabel>
                  <Box>
                    {index === 0 && files.map((file, fileIndex) => (
                      <Box key={fileIndex} mb={2}>
                        <Input
                          type="file"
                          onChange={(e) => handleFileChange(fileIndex, e)}
                          p={1}
                          height="auto"
                        />
                        {file && (
                          <Button 
                            size="sm"
                            colorScheme="red" 
                            mt={1}
                            onClick={(e) => deselectFile(fileIndex, e)}
                          >
                            Remove File
                          </Button>
                        )}
                      </Box>
                    ))}
                    {index === 0 && (
                      <Button 
                        size="sm"
                        colorScheme="green" 
                        mt={2}
                        onClick={addFileInput}
                      >
                        Add Another File
                      </Button>
                    )}
                  </Box>
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
            <Button variant="ghost" onClick={() => {
              setAlertMessage('');
              onCloseQuizModal();
            }}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}