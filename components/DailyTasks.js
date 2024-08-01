"use client";
import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';

const DailyTasks = () => {
  const [dailyTasks, setDailyTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState(''); // Initialize as empty string
  const [description, setDescription] = useState(''); // Initialize as empty string

  useEffect(() => {
    if (session) {
      const fetchTasks = async () => {
        try {
          const res = await fetch('/api/get_daily_tasks', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.accessToken}`
            }
          });

          if (res.ok) {
            const data = await res.json();
            setDailyTasks(data);
          } else {
            console.error('Failed to fetch daily tasks');
          }
        } catch (error) {
          console.error('Error fetching daily tasks:', error);
        }
      };

      fetchTasks();
    }
  }, [session]);

  const handleAddOrEditTask = async (e) => {
    e.preventDefault();
    const taskData = {
      email: session.user.email,
      title,
      description,
      completed: false,
      date: new Date().toISOString(),
    };

    const method = editTask ? 'PUT' : 'POST'; // Use PUT for updates and POST for new tasks
    const url = editTask ? `/api/newtasks/daily_tasks?id=${editTask._id}` : `/api/newtasks/daily_tasks`; // URL for editing or creating tasks

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`
      },
      body: JSON.stringify(taskData),
    });

    if (response.ok) {
      const savedTask = await response.json();
      if (editTask) {
        // Update existing task in the state
        setDailyTasks(dailyTasks.map(task => task._id === savedTask._id ? savedTask : task));
      } else {
        // Add new task to the state
        setDailyTasks([...dailyTasks, savedTask]);
      }
      onClose(); // Close modal after saving
      // Reset form fields
      setEditTask(null);
      setTitle('');
      setDescription('');
    } else {
      console.error('Failed to save task');
    }
  };

  const handleDisplay = (task) => {
    setEditTask(task); // Set the selected task for editing
    setTitle(task.title || ''); // Ensure title is a string
    setDescription(task.description || ''); // Ensure description is a string
    onOpen(); // Open modal
  };
  const handleDelete = async () => {
    if (!editTask) return;

    const response = await fetch(`/api/newtasks/daily_tasks?id=${editTask._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`
      },
    });

    if (response.ok) {
      setDailyTasks(dailyTasks.filter(task => task._id !== editTask._id));
      onClose(); // Close modal after deleting
      // Reset form fields
      setEditTask(null);
      setTitle('');
      setDescription('');
    } else {
      console.error('Failed to delete task');
    }
  };

  return (
    <Box >
      <Button onClick={() => {
        setEditTask(null); // Ensure we're adding a new task, not editing
        setTitle(''); // Clear title for new task
        setDescription(''); // Clear description for new task
        onOpen();
      }} >+ Add Daily Task</Button>

      {/* Modal for adding/editing daily tasks */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="rgba(0, 0, 0, 0.6)" />
        <ModalContent bg="gray.800" color="white" borderRadius="md" maxWidth="md" mx="auto" mt="10">
          <ModalHeader>{editTask ? 'Edit Daily Task' : 'Add Daily Task'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleAddOrEditTask} style={{ width: "40px", height: "fitContent", marginLeft: "30%" }}>
              <FormControl mb="4">
                <FormLabel>Title</FormLabel>
                <Input
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ color: "black" }}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Description</FormLabel>
                <Input
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ color: "black" }}
                />
              </FormControl>
              <Button colorScheme="blue" type="submit">
                Save
              </Button>
              {editTask && (
                <Button colorScheme="red" onClick={handleDelete} style={{ marginLeft: '10px' }}>
                  Delete
                </Button>
              )}
            </form>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Box>
        {dailyTasks.map((task, index) => (
          <Box
            key={index}
            borderWidth="1px"
            borderRadius="lg"
            p="4"
            my="2"
            onClick={() => handleDisplay(task)}
            style={{ cursor: 'pointer' }}
          >
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <p>{task.completed ? 'Completed' : 'Incomplete'}</p>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default DailyTasks;
