import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

// Import the component dynamically with the correct capitalization
const DisplayEditor = dynamic(() => import('../../components/display_notes'), { ssr: false });

export default function Note() {
    const router = useRouter();
    const { id } = router.query;
    const [note, setNote] = useState(null);

    useEffect(() => {
        if (id) {
            fetchNoteDetails(id);
        }
    }, [id]);

    const fetchNoteDetails = async (id) => {
        try {
            const res = await fetch(`/api/get_note?id=${id}`);
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await res.json();
            setNote(data);
        } catch (error) {
            console.error("Error fetching note details:", error);
        }
    };

    if (!note) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>{note.title}</h2>
        
            <p>{note.content}</p>
            <div style={{width:"60vw", height:"100vh"}}>
            <DisplayEditor note={note.content} /></div>
        </div>
    );
}
