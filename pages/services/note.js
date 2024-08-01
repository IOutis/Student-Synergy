import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { asBlob } from 'html-docx-js-typescript';
import { saveAs } from 'file-saver';

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

    const convertImagesToBase64 = async (htmlContent) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const images = doc.querySelectorAll('img');

        for (let img of images) {
            const src = img.getAttribute('src');
            if (!src.startsWith('data:')) {
                const response = await fetch(src);
                const blob = await response.blob();
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                await new Promise((resolve) => {
                    reader.onloadend = () => {
                        img.setAttribute('src', reader.result);
                        resolve();
                    };
                });
            }
        }
        return doc.documentElement.outerHTML;
    };

    const handleDownload = async (content) => {
        try {
            const updatedContent = await convertImagesToBase64(content);
            const docxBuffer = await asBlob(updatedContent);
            saveAs(docxBuffer, `${note.title}.docx`);
        } catch (error) {
            console.error("Error generating DOCX:", error.message);
        }
    };
    const handlePDF = async () => {
        try {
            const updatedContent = await convertImagesToBase64(note.content);

            // Create a temporary container
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = updatedContent;
            document.body.appendChild(tempContainer);

            // Generate PDF from the temporary container
            const opt = {
                margin: 1,
                filename: `${note.title}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            html2pdf().from(tempContainer).set(opt).save().finally(() => {
                // Remove the temporary container
                document.body.removeChild(tempContainer);
            });
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    const handleDelete = async (id) => {
        const response = await fetch(`/api/editordelete?id=${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
            alert('Network response was not ok');
        } else {
            router.push('/services/notes');
        }
    };

    if (!note) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div style={{ width: "60vw", height: "40vh" }}>
                <h1 style={{ textAlign: "center" }} aria-readonly>{note.title}</h1>
                <DisplayEditor note={note} />
                <button onClick={() => handleDelete(note._id)}>Delete</button>
                <button onClick={() => { handleDownload(note.content) }}>Download DOCX</button>
                <button onClick={() => { handlePDF(note.content) }}>Download PDF</button>
            </div>
        </div>
    );
}
