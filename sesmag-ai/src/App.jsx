import React, { useState } from 'react';
import axios from 'axios';
import './app.css';
import Fee from './assets/Fee.png';  // Import the image

const App = () => {
  const [file, setFile] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]); // New state for messages
  const [loading, setLoading] = useState(false);

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('pdf', file);

    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessages([...messages, { sender: 'fee', text: data.response }]);
    } catch (error) {
      setMessages([...messages, { sender: 'fee', text: 'Error analyzing the PDF. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Handle chatbot message
  const handleChat = async () => {
    if (chatInput.trim() === '') return;

    setMessages([...messages, { sender: 'user', text: chatInput }]); // Add user message
    setChatInput(''); // Clear input field

    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/chat', {
        userMessage: chatInput,
      });
      setMessages([...messages, { sender: 'user', text: chatInput }, { sender: 'fee', text: data.response }]);
    } catch (error) {
      setMessages([...messages, { sender: 'user', text: chatInput }, { sender: 'fee', text: 'Error processing your message. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Chat with Fee</h1>

      {/* Add Fee's image */}
      <div className="chat-avatar mb-4">
        <img src={Fee} alt="Fee's Avatar" className="small-avatar" />
      </div>

      {/* Response section (Conversation) */}
      <div className="chat-container mb-4">
        {messages.map((message, index) => (
          <div key={index} className={`response ${message.sender === 'user' ? 'user-message' : 'fee-message'}`}>
            {message.text}
          </div>
        ))}
      </div>

      {/* PDF upload section */}
      <div className="mb-4">
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={handleFileChange} 
        />
        <button
          onClick={handleUpload}
          disabled={loading}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? 'Analyzing...' : 'Upload PDF'}
        </button>
      </div>

      {/* Chat input section */}
      <div className="mb-4">
        <textarea
          className="border w-full p-2 rounded"
          placeholder="Ask Fee something..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
        />
        <button
          onClick={handleChat}
          disabled={loading}
          className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
        >
          {loading ? 'Processing...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default App;
