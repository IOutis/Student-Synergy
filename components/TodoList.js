// components/TodoList.js
import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch('/api/todo/get_tasks');
      const data = await res.json();
      setTasks(data);
    };

    fetchTasks();
  }, []);

  const handleAddOrEditTask = async (e) => {
    e.preventDefault();
    const taskData = {
      title: e.target.title.value,
      description: e.target.description.value,
      dueDate: new Date(e.target.dueDate.value),
      priority: parseInt(e.target.priority.value, 10),
      completed: currentTask ? currentTask.completed : false,
    };

    const method = currentTask ? 'PUT' : 'POST';
    const url = currentTask ? `/api/todo/update_task?id=${currentTask._id}` : '/api/todo/add_task';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (response.ok) {
      const savedTask = await response.json();
      if (currentTask) {
        setTasks(tasks.map(t => t._id === savedTask._id ? savedTask : t));
      } else {
        setTasks([...tasks, savedTask]);
      }
      onClose();
      setCurrentTask(null);
    }
  };

  const handleUpdateStatus = async (taskId, status) => {
    const response = await fetch(`/api/todo/update_status?id=${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: status }),
    });

    if (response.ok) {
      const updatedTask = await response.json();
      setTasks(tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
    }
  };

  const handleDeleteTask = async (taskId) => {
    const response = await fetch(`/api/todo/get_tasks?id=${taskId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setTasks(tasks.filter(t => t._id !== taskId));
    }
  };

  return (
    <Box>
      <Button onClick={() => {
        setCurrentTask(null);
        onOpen();
      }}>+ Add Task</Button>
      <Button onClick={() => setShowCompleted(!showCompleted)}>
        {showCompleted ? 'Show Not Completed Tasks' : 'Show Completed Tasks'}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="rgba(0, 0, 0, 0.9)" />
        <ModalContent bg="gray.800" color="white" borderRadius="md" maxWidth="md" mx="auto" mt="10">
          <ModalHeader>{currentTask ? 'Edit Task' : 'Add Task'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleAddOrEditTask} style={{ width: "100%", marginLeft: "30%" }}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input style={{color:"black", paddingLeft:"6px" }} name="title" defaultValue={currentTask ? currentTask.title : ''} />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input style={{color:"black", paddingLeft:"6px" }} name="description" defaultValue={currentTask ? currentTask.description : ''} />
              </FormControl>
              <FormControl>
                <FormLabel>Due Date</FormLabel>
                <Input style={{color:"black", paddingLeft:"6px" }} name="dueDate" type="date" defaultValue={currentTask ? new Date(currentTask.dueDate).toISOString().split('T')[0] : ''} />
              </FormControl>
              <FormControl>
                <FormLabel>Priority</FormLabel>
                <Input style={{color:"black", paddingLeft:"6px" }} name="priority" type="number" defaultValue={currentTask ? currentTask.priority : 1} />
              </FormControl>
              <Button type="submit">{currentTask ? 'Update Task' : 'Add Task'}</Button>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Box>
        {tasks
          .filter(task => task.completed === showCompleted)
          .map((task, index) => (
            <Box key={index} borderWidth="1px" borderRadius="lg" p="4" my="2">
              <h2>{task.title}</h2>
              <p>{task.description}</p>
              <p>Due: {new Date(task.dueDate).toDateString()}</p>
              <p>Priority: {task.priority}</p>
              <p>{task.completed ? 'Completed' : 'Incomplete'}</p>
              <Button onClick={() => handleUpdateStatus(task._id, !task.completed)}>
                Mark as {task.completed ? 'Incomplete' : 'Complete'}
              </Button>
              <Button onClick={() => {
                setCurrentTask(task);
                onOpen();
              }}>
                Edit
              </Button>
              <Button onClick={() => handleDeleteTask(task._id)}>
                Delete
              </Button>
            </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TodoList;
