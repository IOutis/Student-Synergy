"use client";
import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';

const DailyTasks = () => {
  const [dailyTasks, setDailyTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

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

    const method = editTask ? 'PUT' : 'POST';
    const url = editTask ? `/api/newtasks/daily_tasks?id=${editTask._id}` : `/api/newtasks/daily_tasks`;

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
        setDailyTasks(dailyTasks.map(task => task._id === savedTask._id ? savedTask : task));
      } else {
        setDailyTasks([...dailyTasks, savedTask]);
      }
      onClose();
      setEditTask(null);
      setTitle('');
      setDescription('');
    } else {
      console.error('Failed to save task');
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setTitle(task.title || '');
    setDescription(task.description || '');
    onOpen();
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
      onClose();
      setEditTask(null);
      setTitle('');
      setDescription('');
    } else {
      console.error('Failed to delete task');
    }
  };

  const toggleCompletion = async (task) => {
    const updatedTask = { ...task, isCompleted: !task.isCompleted };

    const response = await fetch(`/api/daily_tasks_status/${task._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`
      },
      body: JSON.stringify({ isCompleted: updatedTask.isCompleted }),
    });

    if (response.ok) {
      const updatedDailyTask = await response.json();
      setDailyTasks(dailyTasks.map(t => t._id === updatedDailyTask._id ? updatedDailyTask : t));
    } else {
      console.error('Failed to update task status');
    }
  };

  return (
    <Box>
      {/* <Button onClick={() => {
        setEditTask(null);
        setTitle('');
        setDescription('');
        onOpen();
      }}>+ Add Daily Task</Button> */}
      <button type="button" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" 
      onClick={() => {
        setEditTask(null);
        setTitle('');
        setDescription('');
        onOpen();
      }}
      >+ Add Daily Task</button>


      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="rgba(0, 0, 0, 0.9)" />
        <ModalContent bg="gray.800" color="white" borderRadius="md" maxWidth="md" mx="auto" mt="10">
          <ModalHeader style={{display:"flex", justifyContent:"center", alignItems:"center", marginTop:"30px", marginBottom:"10px", fontWeight:"bold"}}>{editTask ? 'Edit Daily Task' : 'Add Daily Task'}</ModalHeader>
          <ModalCloseButton style={{marginLeft:"30%"}}/>
          <ModalBody >
            <form onSubmit={handleAddOrEditTask} style={{ height: "fitContent",  }}>
              <FormControl mb="4">
                <FormLabel>Title</FormLabel>
                <Input
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{  }}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Description</FormLabel>
                <Input
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{  }}
                />
              </FormControl>
              <button type="submit" class="mt-3 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Save</button>

              {editTask && (
                // <Button colorScheme="red" onClick={handleDelete} style={{ marginLeft: '10px' }}>
                //   Delete
                // </Button>
                <button type="button" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                onClick={handleDelete}>Delete
                </button>
              )}
            </form>
            {/* <Button variant="ghost" onClick={onClose}>Cancel</Button> */}
            <button type="button" onClick={onClose} class="ml-[40%] mt-2 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Cancel</button>

          </ModalBody>
          <ModalFooter>
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
            style={{ backgroundColor: task.isCompleted ? "rgb(34 197 94)" : "rgb(239 68 68)" , color:"White", fontWeight:"bold",borderRadius:"15px", paddingLeft:"10px", paddingTop:"4px", boxShadow:"1px 1px 10px 1px grey", marginBottom:"10px"}}
          >
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <p>Streak : {task.streak}</p>
            <p>{task.isCompleted ? 'Completed' : 'Incomplete'}</p>
            {/* <Button onClick={() => toggleCompletion(task)}>
              {task.isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
            </Button> */}
            <button
            type="button"
            className={`mt-[6px] focus:outline-none text-white ${!task.isCompleted ? 'bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800' : 'bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800'} font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2`}
            onClick={() => toggleCompletion(task)}>
            {task.isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
            {/* <Button onClick={() => handleEdit(task)} style={{ marginLeft: '10px' }}>
              Edit
            </Button> */}
            <button type="button" class=" text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={() => handleEdit(task)}>
              Edit
            </button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default DailyTasks;
