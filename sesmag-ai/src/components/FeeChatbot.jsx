import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const FeeChatbot = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');  // Error state for handling errors

  // Send chat message to backend
  const handleSend = async () => {
    if (!input) return;
  
    setLoading(true);
    setError(''); // Reset previous error
    try {
      const res = await axios.post('http://localhost:5000/chat', {
        userMessage: input, // Ensure this matches the backend
      });
      setResponse(res.data.response);
    } catch (error) {
      console.error('Error communicating with the chatbot:', error);
      setError("I'm sorry, something went wrong while processing your message. Can you try again?");
      setResponse(''); // Clear previous response
    } finally {
      setLoading(false);
    }
  };

  // Handle PDF file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('pdf', file);

    setLoading(true);
    setError(''); // Reset previous error
    try {
      const res = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResponse(res.data.response);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError("I'm sorry, I couldn't process the file. Please try again.");
      setResponse(''); // Clear previous response
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-6 text-gray-800"
      >
        Fee Chatbot
      </motion.h1>

      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Fee something or upload a PDF for analysis"
          className="w-full p-4 mb-4 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          rows="4"
        ></textarea>
        <div className="flex items-center justify-between">
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Send'}
          </button>
          <label className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring cursor-pointer">
            Upload PDF
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {response && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-4 p-4 bg-gray-100 border rounded-md"
          >
            <p className="text-gray-800">{response}</p>
          </motion.div>
        )}

        {/* Display error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-4 p-4 bg-red-100 border rounded-md"
          >
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FeeChatbot;
