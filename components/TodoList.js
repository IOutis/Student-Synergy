// components/TodoList.js
import React, { useState, useEffect } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, useDisclosure
} from '@chakra-ui/react';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch('/api/todo/get_tasks');
      const data = await res.json();
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        console.error('Unexpected response data:', data);
      }
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
      <button
        type="button"
        className="p-3 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
        onClick={() => {
          setCurrentTask(null);
          onOpen();
        }}
      >
        + Add Task
      </button>
      <button
        type="button"
        className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        onClick={() => setShowCompleted(!showCompleted)}
      >
        {showCompleted ? 'Show Not Completed Tasks' : 'Show Completed Tasks'}
      </button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="rgba(0, 0, 0, 0.9)" />
        <ModalContent bg="gray.800" color="white" borderRadius="md" maxWidth="md" mx="auto" mt="10">
          <ModalHeader
            style={{
              fontWeight: "bold",
              display: "flex",
              justifyContent: "center",
              fontSize: "large",
              marginTop: "6px",
              marginBottom: "6px",
            }}
          >
            {currentTask ? 'Edit Task' : 'Add Task'}
          </ModalHeader>
          <ModalCloseButton style={{ paddingLeft: "16vw" }} />
          <ModalBody>
            <form onSubmit={handleAddOrEditTask} style={{ width: "100%", marginLeft: "44%" }}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  style={{ color: "black", paddingLeft: "6px" }}
                  name="title"
                  defaultValue={currentTask ? currentTask.title : ''}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  style={{ color: "black", paddingLeft: "6px" }}
                  name="description"
                  defaultValue={currentTask ? currentTask.description : ''}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Due Date</FormLabel>
                <Input
                  style={{ color: "black", paddingLeft: "6px" }}
                  name="dueDate"
                  type="date"
                  defaultValue={currentTask ? new Date(currentTask.dueDate).toISOString().split('T')[0] : ''}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Priority (1 is Highest)</FormLabel>
                <Input
                  style={{ color: "black", paddingLeft: "6px" }}
                  placeholder="1 is highest"
                  name="priority"
                  type="number"
                  defaultValue={currentTask ? currentTask.priority : 1}
                />
              </FormControl>
              <button
                type="submit"
                className="mt-3 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                {currentTask ? 'Update Task' : 'Add Task'}
              </button>
            </form>
            <button
              type="button"
              onClick={onClose}
              className="ml-[44%] mt-2 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
              Close
            </button>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Box>
        {Array.isArray(tasks) && tasks
          .filter(task => task.completed === showCompleted)
          .map((task, index) => (
            <Box
              key={index}
              borderWidth="1px"
              borderRadius="lg"
              p="4"
              my="2"
              style={{
                backgroundColor: task.completed ? "rgb(34 197 94)" : "rgb(239 68 68)",
                color: "White",
                fontWeight: "bold",
                borderRadius: "15px",
                paddingLeft: "10px",
                paddingTop: "4px",
                boxShadow: "1px 1px 10px 1px grey",
                marginBottom: "10px"
              }}
            >
              <h2>{task.title}</h2>
              <p>{task.description}</p>
              <p>Due: {new Date(task.dueDate).toDateString()}</p>
              <p>Priority: {task.priority}</p>
              <p>{task.completed ? 'Completed' : 'Incomplete'}</p>
              <button
                type="button"
                className={`focus:outline-none text-white ${!task.completed ? 'bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800' : 'bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800'} font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2`}
                onClick={() => handleUpdateStatus(task._id, !task.completed)}
              >
                Mark as {task.completed ? 'Incomplete' : 'Complete'}
              </button>
              <button
                type="button"
                className="mt-2 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                onClick={() => {
                  setCurrentTask(task);
                  onOpen();
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="mt-2 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                onClick={() => handleDeleteTask(task._id)}
              >
                Delete
              </button>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default TodoList;
