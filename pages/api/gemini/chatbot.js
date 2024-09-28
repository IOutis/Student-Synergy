import { createRouter } from 'next-connect';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { marked } from 'marked';
import dotenv from 'dotenv';

dotenv.config();
console.log("API KEY = ",process.env.GOOGLE_GEN_AI_KEY)

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_KEY);

// Create the router
const router = createRouter();

// Define the POST route for '/api/gemini/chatbot'
router.post(async (req, res) => {
    console.log(req.body.history);
    console.log(req.body.message);

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    let existingHistory = [
        {
            role: 'user',
            parts: [{ text: 'Hello, I have a website called Student Synergy. Imagine your name is Galahad.' }],
        },
        {
            role: 'model',
            parts: [{ text: 'OK sir' }],
        },
        {
            role: 'user',
            parts: [{ text: `I am going to share some HTML content, analyze it. I am sharing the HTML content for every conversation, even though sometimes it's not needed because I am using the Gemini API, and this is the simplest method to apply.` }],
        },
        {
            role: 'model',
            parts: [{ text: 'OK sir' }],
        },
        {
            role: 'user',
            parts: [{ text: "Ok, from this moment users will interact with you. Sometimes the user's question may or may not be regarding the HTML content. If the user specifically asks for something like a quiz, summary, or something else, then you can use the HTML content." }],
        },
        {
            role: 'model',
            parts: [{ text: 'Understood! I will analyze HTML content only when relevant requests are made, like summarizing, quizzing, or other tasks related to it.' }],
        },
        {
            role: 'user',
            parts: [{ text: 'The website is called Student Synergy and it includes a gamified task manager, CKEditor-powered notes, public and private communities, quizzes, and a personalized dashboard.' }],
        },
        {
            role: 'model',
            parts: [{ text: "Got it! I’ll help users by referring to Student Synergy's features like task management, communities, notes, quizzes, and dashboard. I'll also be ready to analyze any HTML content if they request summaries or quizzes." }],
        },
        {
            role: 'user',
            parts: [{ text: "sometimes the html content wont be available if the html content is not available then you just have to answer the user\'s query normally you wont need any html content to answer query. Only if the query contains the html content you have to consider that for context needed." }],
        },
        {
            role: 'model',
            parts: [{ text: "Got it! I’ll help users with their queries accodingly , html content or no html content. If there is no html content I will not consider any context and answer to the best of my knowledge. Only if there is any html content then I will consider it for context" }],
        },
        {
            role: 'user',
            parts: [{text: "Don't worry I will tell when the html content for the notes is being sent in the message. this will be like a code sentence when i say this sentence you have to take the next sentence as html content. I will say 'This is html content galahad you know what to do: ' then its signal to consider the html content to answer the users query "}]
        },
        {
            role: 'model',
            parts: [{ text: "Alright, I understand the signal you'll send when the HTML content is available. When you say 'This is html content galahad you know what to do:' I will consider the next sentence as HTML content and use it for context when answering the user's query." }]
        }
    ];
    

    let combinedHistory = existingHistory;
    const newHistory = req.body.history;

    // Append new messages from the request body to the existing history
    newHistory.forEach(newMessage => {
        combinedHistory.push({
            role: newMessage.role,
            parts: newMessage.parts.map(part => ({ text: part.text })),
        });
    });

    const chat = model.startChat({
        history: combinedHistory,
    });
    let msg =''
    if(req.body.htmlContent){
     msg = req.body.message+"This is html content galahad you know what to do: "+req.body.htmlContent;
    }
    else{
        msg = req.body.message
    }
    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    const formattedResponse = marked.parse(text);

    res.send(formattedResponse);
});

// Export the router handler
export default router.handler();
