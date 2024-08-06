import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Select, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, Checkbox } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [editHabit, setEditHabit] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dueDate, setDueDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [isCompleted, setIsCompleted] = useState(false);
  const { data: session } = useSession();

  // Function to reset form fields
  const resetFormFields = () => {
    setTitle('');
    setDescription('');
    setFrequency('daily');
    setDueDate('');
    setStartDate('');
    setReminderTime('');
    setIsCompleted(false);
  };

  useEffect(() => {
    if (session) {
      const fetchHabits = async () => {
        try {
          const res = await fetch('/api/get_habits', {
            method: 'GET',
          });

          if (res.ok) {
            const data = await res.json();
            setHabits(data);
          } else {
            console.error('Failed to fetch habits');
          }
        } catch (error) {
          console.error('Error fetching habits:', error);
        }
      };

      fetchHabits();
    }
  }, [session]);

  const handleAddHabit = async (e) => {
    e.preventDefault();
    const habitData = {
      title,
      description,
      frequency,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      startDate: startDate ? new Date(startDate).toISOString() : null,
      reminderTime: reminderTime ? new Date(reminderTime).toISOString() : null,
      isCompleted,
    };

    const method = editHabit ? 'PUT' : 'POST';
    const url = editHabit ? `/api/habits?id=${editHabit._id}` : '/api/habits';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(habitData),
    });

    if (response.ok) {
      const savedHabit = await response.json();
      if (editHabit) {
        setHabits(habits.map(habit => habit._id === savedHabit._id ? savedHabit : habit));
      } else {
        setHabits([...habits, savedHabit]);
      }
      onClose();
      resetFormFields();
    } else {
      console.error('Failed to save habit');
    }
  };

  const handleDelete = async () => {
    if (!editHabit) return;

    const response = await fetch(`/api/habits?id=${editHabit._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      setHabits(habits.filter(habit => habit._id !== editHabit._id));
      onClose();
      resetFormFields();
    } else {
      console.error('Failed to delete habit');
    }
  };

  const handleDisplay = (index) => {
    const habit = habits[index];
    setEditHabit(habit);
    setTitle(habit.title);
    setDescription(habit.description);
    setFrequency(habit.frequency);
    setDueDate(habit.dueDate ? new Date(habit.dueDate).toISOString().slice(0, 16) : '');
    setStartDate(habit.startDate ? new Date(habit.startDate).toISOString().slice(0, 16) : '');
    setReminderTime(habit.reminderTime ? new Date(habit.reminderTime).toISOString().slice(0, 16) : '');
    setIsCompleted(habit.isCompleted);
    onOpen();
  };

  const handleStatus = async (habitId, isCompleted) => {
    try {
      const response = await fetch(`/api/habits_status/${habitId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isCompleted,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update habit status');
      }

      const updatedHabit = await response.json();
      if(!response.ok){
        alert("Error in changing the status,",response.error)
      }
      setHabits(prevHabits => prevHabits.map(habit => habit._id === habitId ? updatedHabit : habit));
    } catch (error) {
      console.error('Error updating habit status:', error);
    }
  };

  const handleOpenAddHabit = () => {
    resetFormFields();
    setEditHabit(null);
    onOpen();
  };

  return (
    <Box>
      {/* <Button onClick={handleOpenAddHabit}>+ Add Habit</Button> */}
      <button type="button" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={handleOpenAddHabit}>+ Add Habit</button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="rgba(0, 0, 0, 0.9)" />
        <ModalContent bg="gray.800" color="white" borderRadius="md" maxWidth="md" mx="auto" mt="10">
          <ModalHeader>{editHabit ? 'Edit Habit' : 'Add Habit'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleAddHabit} style={{ width: "100%",  }}>
              <FormControl mb="4">
                <FormLabel>Title</FormLabel>
                <Input 
                  name="title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Description</FormLabel>
                <Input 
                  name="description" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                   
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Frequency</FormLabel>
                <Select 
                  name="frequency" 
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  
                >
                  <option value="daily" style={{color:"black"}}>Daily</option>
                  <option value="weekly" style={{color:"black"}}>Weekly</option>
                  <option value="monthly" style={{color:"black"}}>Monthly</option>
                </Select>
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Due Date</FormLabel>
                <Input 
                  type="datetime-local" 
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                   
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Start Date</FormLabel>
                <Input 
                  type="datetime-local" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                   
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Reminder Time</FormLabel>
                <Input 
                  type="datetime-local" 
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  
                />
              </FormControl>
              <button type="submit" class="ml-[40%] focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Save</button>
              {editHabit && (
                <button type="button" class="ml-[40%] focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                onClick={handleDelete}>Delete
                </button>
              )}
            </form>
            <button type="button" onClick={onClose} class="ml-[40%] text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Close</button>
            {/* <Button variant="outline" ml="30%" onClick={onClose}>
              Close
            </Button> */}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Box mt="6">
        {habits.map((habit, index) => (
          <Box key={habit._id} p="4" borderWidth="1px" borderRadius="md" mb="4"  style={{ backgroundColor: habit.isCompleted ? "rgb(34 197 94)" : "rgb(239 68 68)" , color:"White", fontWeight:"bold", borderRadius:"15px", paddingLeft:"10px", paddingTop:"4px",boxShadow:"1px 1px 10px 1px grey", marginBottom:"10px"}}>
            <Box fontWeight="bold">{habit.title}</Box>
            <Box>{habit.description}</Box>
            <Box>Streak : {habit.streak}</Box>
            <Box>{habit.isCompleted ? 'Completed':'Not Completed'}</Box>
            <button type="button" class="mt-[6px] text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={() => handleDisplay(index)}>
              Edit
            </button>
            <button
            type="button"
            className={`focus:outline-none text-white ${!habit.isCompleted ? 'bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800' : 'bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800'} font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2`}
            onClick={() => handleStatus(habit._id, !habit.isCompleted)}>
            {habit.isCompleted ? 'Mark as Not Done' : 'Mark as Done'}
            </button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Habits;
