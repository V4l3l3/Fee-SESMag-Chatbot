const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { OpenAI } = require('openai');
const cors = require('cors');
const { insertConversation, insertFile } = require('./database'); // Import database functions

// Initialize the express app
const app = express();
const port = 5000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Setup file upload handling using multer
const upload = multer({ storage: multer.memoryStorage() });

// Initialize OpenAI with API Key
const openai = new OpenAI({
  apiKey: 'YOUR_API_KEY', // Replace with your OpenAI API key
});

// Route to handle file uploads and PDF parsing
app.post('/upload', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  try {
    // Parse the uploaded PDF file
    const dataBuffer = req.file.buffer;
    const pdfData = await pdfParse(dataBuffer);

    // Communicate with OpenAI to analyze the PDF content
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `
            You are Fee, a professional accountant with a friendly, confident personality.
            Respond in a mix of professionalism and warmth, showing your expertise in analyzing documents.
          `,
        },
        {
          role: 'user',
          content: `Analyze the following PDF content as Fee:\n\n${pdfData.text}`,
        },
      ],
    });

    // Insert the file data into the database
    console.log('File name:', req.file.originalname); // Debugging log
    console.log('File is stored in memory (no path).');
    await insertFile(req.file.originalname, 'in-memory'); // Use 'in-memory' or another placeholder for the file path

    // Send the AI response back to the client
    res.json({ response: aiResponse.choices[0].message.content });
  } catch (error) {
    console.error('Error processing the PDF:', error);
    res.status(500).json({ message: 'Error processing the PDF', error: error.message });
  }
});

// Route to handle chatbot conversation
// Route to handle chatbot conversation
app.post('/chat', async (req, res) => {
  const { userMessage } = req.body; // The message sent from the frontend

  if (!userMessage) {
    return res.status(400).send('No message received');
  }

  try {
    // Call OpenAI GPT to generate a response based on the user message
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4', // Specify the GPT model you're using
      messages: [
        {
          role: 'system',
          content: `You are Fee, a professional accountant with a friendly, confident personality. Respond in a mix of professionalism and warmth, showing your expertise in analyzing documents.`,
        },
        {
          role: 'user',
          content: userMessage, // Use the extracted 'userMessage' here
        },
      ],
    });

    // Log the conversation in the database
    await insertConversation(userMessage, aiResponse.choices[0].message.content);

    // Return the response from OpenAI to the frontend
    res.json({ response: aiResponse.choices[0].message.content });
  } catch (error) {
    console.error('Error handling chat request:', error);
    res.status(500).json({ message: 'Error handling chat request', error: error.message });
  }
});


// Start the backend server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
