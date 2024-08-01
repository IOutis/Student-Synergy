import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { asBlob } from 'html-docx-js-typescript';

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
    
    const handleDownload = async (content) => {
        try {
          // Convert HTML to DOCX
          const docxBuffer = await asBlob(content);
      
          // Create a link element to trigger download
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(new Blob([docxBuffer]));
          link.download = `${note.title}.docx`;
          link.click();
        } catch (error) {
          console.error("Error generating DOCX:", error.message);
        }
      };
    


    const handleDelete = async(id)=>{
       
        const response = await fetch(`/api/editordelete?id=${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            console.log(data);
            if(!response.ok){
                alert('Network response was not ok');
            }
            else{
                router.push('/services/notes');
                }
    }

    if (!note) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            
            <div style={{width:"60vw", height:"40vh", }}>
                <h1 style={{ textAlign:"center"}} aria-readonly>{note.title}</h1>
            <DisplayEditor note={note} />
            <button onClick={()=>handleDelete(note._id)} >Delete</button>
            <button onClick={()=>{handleDownload(note.content)}}>Download DOCX</button>
            If the image you saved is not displayed then try "enabling editing mode".
            </div>
        </div>
    );
}
