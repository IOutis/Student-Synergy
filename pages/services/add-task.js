import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function AddTask() {
    const { data: session } = useSession();
    const [task, setTask] = useState('');
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('Planned');
    const [description, setDescription] = useState('');
    const [recurring, setRecurring] = useState('none');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const now = new Date();

        // Append the current date to the time input to create a full datetime string
        const dateTimeString = `${now.toISOString().split('T')[0]}T${time}`;

        try {
            const res = await fetch('/api/task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: session.user.name,
                    task,
                    time: dateTimeString,
                    date,
                    status,
                    description,
                    recurring,
                }),
            });

            if (res.ok) {
                window.location.href = '/services/task-schedule';
            } else {
                console.error('Failed to add task:', res.statusText);
                // Handle error state or display a message to the user
            }
        } catch (error) {
            console.error('Error adding task:', error);
            // Handle error state or display a message to the user
        }
    };

    if (!session) {
        return <p>Please sign in to add a task.</p>;
    }

    return (
        <div>
            <h1>Add Task</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Task:
                    <input
                        type="text"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        required
                        style={{ color: 'black' }}
                    />
                </label>
                <label>
                    Time:
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                        style={{ color: 'black' }}
                    />
                </label>
                <label>
                    Date:
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        style={{ color: 'black' }}
                    />
                </label>
                <label>
                    Status:
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        style={{ color: 'black' }}
                    >
                        <option value="Planned">Planned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Not Completed">Not Completed</option>
                    </select>
                </label>
                <label>
                    Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ color: 'black' }}
                    />
                </label>
                <label>
                    Recurring:
                    <select
                        value={recurring}
                        onChange={(e) => setRecurring(e.target.value)}
                        style={{ color: 'black' }}
                    >
                        <option value="none">None</option>
                        <option value="one week">One Week</option>
                        <option value="one month">One Month</option>
                        <option value="six months">Six Months</option>
                        <option value="once a week">Once a Week</option>
                        <option value="once a month">Once a Month</option>
                    </select>
                </label>
                <button type="submit">Add Task</button>
            </form>
        </div>
    );
}
