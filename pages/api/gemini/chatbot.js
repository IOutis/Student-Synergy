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
            parts: [{ text: `I am going to share some html content analyse it. I am sharing the html content for every conversion even though sometimes its not needed. Because I am using gemini api and this is the simplest method to apply.` }],
        },
        {
            role: 'model',
            parts: [{ text: 'OK sir' }],
        },
        {
            role: 'user',
            parts: [{ text: "Ok from this moment users will interact with you. Sometimes the users question may or maynot be regarding the html content. If the user specifically asks like quiz me or give summary or something like that then you can use the html content. " }],
        },
        {
            role: 'model',
            parts: [{ text: 'OK sir' }],
        },
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

    const msg = req.body.message+"This is html content: "+req.body.htmlContent;
    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    const formattedResponse = marked.parse(text);

    res.send(formattedResponse);
});

// Export the router handler
export default router.handler();
