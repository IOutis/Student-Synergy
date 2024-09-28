// import React from 'react'
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
export default function Gemini() {
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const [chatHistory,setChatHistory] = useState([]);
    const [loadingState , setLoadingState] = useState(false);


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
                    // htmlContent: note.content,  // Include the HTML content here
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
    <div>
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
  )
}
