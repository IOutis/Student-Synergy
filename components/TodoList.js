// components/TodoList.js
import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const handleAddTask = (e) => {
    e.preventDefault();
    const newTask = {
      title: e.target.title.value,
      description: e.target.description.value,
      dueDate: new Date(e.target.dueDate.value),
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setShowForm(false);
  };

  return (
    <Box>
      <Button onClick={() => setShowForm(!showForm)} style={{color:"white"}}>+ Add Task</Button>
      {showForm && (
        <form onSubmit={handleAddTask} style={{color:"white"}}>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input name="title" style={{color:"black"}} />
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Input name="description" style={{color:"black"}}/>
          </FormControl>
          <FormControl>
            <FormLabel>Due Date</FormLabel>
            <Input name="dueDate" type="date" style={{color:"black"}}/>
          </FormControl>
          <Button type="submit" style={{color:"white"}}>Add Task</Button>
        </form>
      )}
      <Box style={{color:"white"}}>
        {tasks.map((task, index) => (
          <Box key={index} borderWidth="1px" borderRadius="lg" p="4" my="2">
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <p>Due: {task.dueDate.toDateString()}</p>
            <p>{task.completed ? 'Completed' : 'Incomplete'}</p>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TodoList;
