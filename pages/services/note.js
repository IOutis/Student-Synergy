import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { asBlob } from 'html-docx-js-typescript';
import { saveAs } from 'file-saver';
import LoadingComp from '../../components/LoadingComp';
import { useSession } from "next-auth/react";


// Import the component dynamically with the correct capitalization
const DisplayEditor = dynamic(() => import('../../components/display_notes'), { ssr: false });

export default function Note() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { id } = router.query;
    const [note, setNote] = useState(null);
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const [chatHistory,setChatHistory] = useState([]);
    const [access,setAccess] = useState(false);
    const [loadingState , setLoadingState] = useState(false);
    const [loadingDataState , setLoadingDataState] = useState(false);
    const [files,setFiles] = useState([]);

    useEffect(() => {
        if (id) {
            fetchNoteDetails(id);
        }
    }, [id,session,status]);
    

    const fetchNoteDetails = async (id) => {
        try {
            setLoadingDataState(true);
            const res = await fetch(`/api/get_note?id=${id}`);
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await res.json();
            setNote(data);

            const fileRes = await fetch(`/api/get_file?id=${id}`);
            const fileData = await fileRes.json();
            setFiles(fileData.files);
            // console.log("Files :", fileData)
            
            // Access check
            if (data.user === session.user.email) {
                setAccess(true);
            } else {
                setAccess(false);
            }
            
            setLoadingDataState(false);
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

    const handleFileDelete= async(id)=>{
        console.log("ID : ",id)
        const response = await fetch(`/api/delete_file?id=${id}`, {
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
    }
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
        return <LoadingComp></LoadingComp>;
    }
    if (status === 'loading') {
        return <LoadingComp />;
    }
    if (!session) {
        return (<div> 
        <div style={{ display:"flex", justifyContent:"center", marginTop:"6vh"}}>
        <p>Please sign in to view your notes.</p></div>
        </div>);
      }

     
    
       const surpriseOptions=[
        'What is stoicism?',
        'Why is Stoicism important?',
        'How will Student Synergy help students?',
       ]
    
    
       const surprise = () =>{
        const random = Math.floor(Math.random()*surpriseOptions.length)
        setValue(surpriseOptions[random])
       }
    
       const getResponse = async () => {
        if (!value) {
            setError("Error! Please ask a Question");
            return;
        }
        
        try {
            setLoadingState(true);
            const options = {
                method: 'POST',
                body: JSON.stringify({
                    history: chatHistory,
                    message: value,
                    htmlContent: note.content,  // Include the HTML content here
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            
            const response = await fetch('/api/gemini/chatbot', options);
            const data = await response.text();
            
            setChatHistory((oldChatHistory) => [
                ...oldChatHistory,
                {
                    role: 'user',
                    parts: [{ text: value }],
                },
                {
                    role: 'model',
                    parts: [{ text: data }],
                },
            ]);
            
            setValue('');
            setLoadingState(false);
        } catch (error) {
            setError(`Error! Something went wrong! Please try later ${error}`);
        }
    };
    
    
    

    return (
        <div className='flex-col justify-between max-w-full'>
            
            <div style={{ alignItems:"center",  marginTop:"2vh",paddingBottom:"2vh", display:"flex", flexDirection:"column", alignContent:"center", alignItems:"center"
            }}>
                {/* <LoadingComp></LoadingComp> */}
                <h1 style={{ textAlign: "center", fontWeight: "bold" }} aria-readonly>
                        {note.title}
                        </h1>
                        {files.length > 0 && (
                        <div>
                            <h2 style={{ textAlign: "center", fontWeight: "bold", paddingBottom: "6px" }}>
                            Attached Files:
                            </h2>
                            <div 
                            className='items-center'
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "center",
                                gap: "15px",
                                marginLeft: "10px",
                            }}
                            >
                            {files.map((file, index) => (
                                <div
                                key={index}
                                style={{
                                    border: "1px solid #ccc",
                                    borderRadius: "8px",
                                    padding: "10px",
                                    textAlign: "center",
                                    width: "150px",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                }}
                                >
                                <a href={file.url} download style={{ textDecoration: "none", color: "#000" }}>
                                    <strong>{file.filename}</strong>
                                    <p style={{ marginTop: "8px", color: "#007bff" }}>Download</p></a>
                                    {access && <button style={{color:"red"}} onClick={()=>{handleFileDelete(file.id)}}>Delete</button>}
                                
                                </div>
                            ))}
                            </div>
                        </div>
                        )}

                

                        <div 
                        className="ck-editor-container w-full relative"                        style={{ padding: "10px" }}
                        >
                        <DisplayEditor note={note} access={access} />
                        </div>
{        access&&        <button onClick={() => handleDelete(note._id)} type="button" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete</button>
}                {/* <button onClick={() => handleDelete(note._id)}>Delete</button> */}
                {/* <button onClick={() => { handleDownload(note.content) }}>Download DOCX</button> */}
                <p>Download the text saved</p>
                <button onClick={() => { handleDownload(note.content) }} type="button" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Download DOCX</button>
                <p><em>Works only in Desktop for some silly reason. Format error in the mobiles</em></p>
                <p><strong>For mobiles, after downloading the document convert it into PDF on <u><a href="https://cloudconvert.com/" target="_blank">cloudconvert website</a></u> , then you can view the document</strong></p>
                <br />
             </div>   
            
            <div className='app'>
      
      <p>
        Chat with your note
        {/* <button className='surprise' onClick={surprise} disabled={!chatHistory}>Surprise</button> */}
      </p>
      <div className='input-container'> 
        <input type="text" value={value} placeholder='Say "Hi" to Galahad' onChange={(e)=>setValue(e.target.value)} />
        {!error && <button onClick={getResponse}>Submit</button>}
        {error && <button onClick={clear}>Clear</button>}
        {error && <p>{error}</p>}
      </div>
        <div className='search-results'>
            {loadingState && <p>Loading...</p>}
        {chatHistory.map((chatItem, index) => (
          <div key={index}>
            <p className='answer'>
              {chatItem.role}: {chatItem.parts.map((part, partIndex) => (
                chatItem.role === 'model'
                  ? <span key={partIndex} dangerouslySetInnerHTML={{ __html: part.text }} />
                  : <span key={partIndex}>{part.text}</span>
              ))}
            </p>
          </div>
        ))}
      </div>
      </div>

        </div>
    );
}
