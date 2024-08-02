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
        return (<div> <NavComp></NavComp>
            <div style={{ display:"flex", justifyContent:"center", marginTop:"6vh"}}>
            <p>Please sign in to view your tasks.</p></div>
            </div>);
    }
    const  handleSubmit = async (id) =>{
          router.push(`/services/note?id=${id}`);
    }

    return (
        <div className="overflow-y-scroll" style={{ maxHeight:"87vh"}}>
    <h3 className='mt-3 pb-3'>Notes History</h3>
    {notes.length ? (
    <ul style={{ paddingBottom: "3px",}}>
        {notes.map(note => (
            <div className='h-[6vh]  bg-gray-200 hover:bg-gray-200 hover:scale-110 ' 
            style={{ marginBottom:"3px",marginTop:"6px" }}
            >
            <li 
                 // Changed cursor to pointer
                style={{paddingLeft:"5vw",marginTop:"6px", paddingTop:"3px" }}
                key={note._id}
                onClick={() => handleSubmit(note._id)}
            >
                <p style={{ marginTop:"6px", }}>{note.title}</p>
            </li>
            </div>
        ))}
    </ul>
) : (
    <p>No Notes saved</p>
)}
</div>

    );
}
