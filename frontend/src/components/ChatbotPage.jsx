import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/userApi'; // Your axios instance

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await API.post('/api/chat', { message: input });
      const cleanedReply = res.data.reply.replace(
        /^Here['’]s a rewritten version with a more conversational and kind tone:\s*/i,
        ''
      );
      const botMsg = { sender: 'bot', text: cleanedReply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Error connecting to server.' }]);
    }

    setInput('');
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      {/* Floating Close Button */}
      <button
        onClick={handleClose}
        className="fixed top-4 right-4 z-50 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm px-3 py-1 rounded shadow-md"
        aria-label="Close chatbot"
      >
        ✖
      </button>

      <h2 className="text-2xl font-bold mb-4 text-pink-800">Cancer Awareness Chatbot</h2>

      <div className="bg-white p-4 rounded shadow-md h-[60vh] overflow-y-auto mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
          >
            <span
              className={`inline-block p-2 rounded text-white ${
                msg.sender === 'user' ? 'bg-blue-200 text-black' : 'bg-[#a30059]'
              }`}
           >
              {msg.text}
           </span>
         </div>
       ))}
     </div>



      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2"
          placeholder="Type your question..."
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatbotPage;
