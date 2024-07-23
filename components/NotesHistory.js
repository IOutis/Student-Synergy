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
                    const res = await fetch(`/api/get_notes?user=${session.user.name}`);
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
        // console.log("Id: ",id);
        // await fetch(`/api/get_note?id=${id}`)
        // .then((data) => console.log(data))
        // .catch(error => {
        //     console.error('Error fetching tasks:', error);
        //     // Handle error state or display a message to the user
        //   });
          router.push(`/services/note?id=${id}`);
    }

    return (
        <div>
    <h3>Notes History</h3>
    <ul style={{ color: "white", paddingBottom: "6px" }}>
        {notes.map(note => (
            <li style={{ marginBottom: '10px', cursor:"progress" }} key={note._id} onClick={() => handleSubmit(note._id)}>{note.content}</li>
        ))}
    </ul>
</div>

    );
}
