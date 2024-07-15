import React, { useState, useEffect } from "react";
import NavComp from '../../components/NavComp';
import { useSession } from "next-auth/react";
import Link from 'next/link';

export default function TaskSchedule() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState([]);
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

  return (
    <div>
      <NavComp />
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

      {tasks.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Description</th>
              <th>Time</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.task}</td>
                <td>{task.description}</td>
                <td>{new Date(task.time).toLocaleString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                <td>{new Date(task.date).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                <td>{task.status}</td>
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
