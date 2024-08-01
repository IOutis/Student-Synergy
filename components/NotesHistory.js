"use client";
import React, { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function NotesHistory() {
    const { data: session } = useSession();
    const router = useRouter();

    const [notes, setNotes] = useState([]);

    useEffect(() => {
        if (session) {
            const fetchNotes = async () => {
                try {
                    const res = await fetch(`/api/get_notes?user=${session.user.email}`);
                    if (!res.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await res.json();
                    setNotes(data);
                } catch (error) {
                    console.log(error);
                }
            };

            fetchNotes();
        }
    }, [session]);

    if (!session) {
        return <div><p onClick={() => signIn("google")} style={{ cursor: "pointer" }}>Sign in</p></div>;
    }
    const  handleSubmit = async (id) =>{
          router.push(`/services/note?id=${id}`);
    }

    return (
        <div>
    <h3 >Notes History</h3>
    {notes.length ? (
    <ul style={{ paddingBottom: "6px" }}>
        {notes.map(note => (
            <li
                style={{ marginBottom: '10px', cursor: "pointer" }} // Changed cursor to pointer
                key={note._id}
                onClick={() => handleSubmit(note._id)}
            >
                {note.title}
            </li>
        ))}
    </ul>
) : (
    <p>No Notes saved</p>
)}
</div>

    );
}
