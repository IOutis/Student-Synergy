import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from 'next/link';

export default function TaskSchedule() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    date: '',
    recurring: ''
  });

  useEffect(() => {
    if (session) {
      const query = new URLSearchParams(filters);
      query.append('user', session.user.name);

      fetch(`/api/tasks?${query.toString()}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch tasks');
          }
          return res.json();
        })
        .then((data) => setTasks(data))
        .catch(error => {
          console.error('Error fetching tasks:', error);
          // Handle error state or display a message to the user
        });
    }
  }, [session, filters]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>Please sign in to view your tasks.</p>;
  }

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleTaskSelect = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedTasks.length > 0) {
      fetch('/api/tasks', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ taskIds: selectedTasks })
      })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to delete tasks');
        }
        return res.json();
      })
      .then(() => {
        setTasks(tasks.filter(task => !selectedTasks.includes(task._id)));
        setSelectedTasks([]);
      })
      .catch(error => console.error('Error deleting tasks:', error));
    }
  };

  const handleDeleteAll = () => {
    fetch('/api/tasks', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user: session.user.name })
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to delete tasks');
      }
      return res.json();
    })
    .then(() => setTasks([]))
    .catch(error => console.error('Error deleting tasks:', error));
  };

  const handleStatusChange = (taskId, newStatus) => {
    fetch('/api/tasks', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ taskId, newStatus })
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to update task status');
      }
      return res.json();
    })
    .then(updatedTask => {
      setTasks(tasks.map(task => task._id === taskId ? updatedTask : task));
    })
    .catch(error => console.error('Error updating task status:', error));
  };

  return (
    <div>
      
      <h1>Task Schedule</h1>
      <h2>Filter the tasks by :</h2>
      <div>
        <label>
          Status:
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            style={{ color: "black" }}
          >
            <option value="">All</option>
            <option value="Planned">Planned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Not Completed">Not Completed</option>
          </select>
        </label>
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            style={{ color: "black" }}
          />
        </label>
        <label>
          Recurring:
          <select
            name="recurring"
            value={filters.recurring}
            onChange={handleFilterChange}
            style={{ color: "black" }}
          >
            <option value="">None</option>
            <option value="one week">One Week</option>
            <option value="one month">One Month</option>
            <option value="six months">Six Months</option>
            <option value="once a week">Once a Week</option>
            <option value="once a month">Once a Month</option>
          </select>
        </label>
      </div>

      <button onClick={handleDeleteSelected} disabled={selectedTasks.length === 0}>Delete Selected</button>
      <button onClick={handleDeleteAll}>Delete All</button>

      {tasks.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Select</th>
              <th>Task</th>
              <th>Description</th>
              <th>Time</th>
              <th>Date</th>
              <th>Status</th>
              <th>Change Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedTasks.includes(task._id)}
                    onChange={() => handleTaskSelect(task._id)}
                  />
                </td>
                <td>{task.task}</td>
                <td>{task.description}</td>
                <td>{new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                <td>{new Date(task.deadline).toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                <td>{task.status}</td>
                <td>
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      style={{ color: "black" }}
                    >
                      <option value="Planned">Planned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tasks found. Add a new task below.</p>
      )}

      <Link href="/services/add-task">Add Task</Link>
    </div>
  );
}
