import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/userApi';
import { localFAQAnswer } from '../utils/faq';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  // Handles sending a message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);

    // 1. Try FAQ first
    const faqAnswer = localFAQAnswer(input);
    if (faqAnswer) {
      setMessages((prev) => [...prev, { sender: 'bot', text: faqAnswer }]);
      setInput('');
      return;
    }

    // 2. Otherwise, use API
    setLoading(true);
    try {
      const res = await API.post('/api/chat', { message: input });
      const cleanedReply = res.data.reply.replace(
        /^Here['’‘`"]?s a rewritten version with a more conversational and kind tone:\s*/i,
        ''
      );
      setMessages((prev) => [...prev, { sender: 'bot', text: cleanedReply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Error connecting to server.' }
      ]);
    }
    setLoading(false);
    setInput('');
  };

  // Handles closing the chatbot
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

      <h2 className="text-2xl font-bold mb-4 text-pink-800">
        Cancer Awareness Chatbot
      </h2>

      <div className="bg-white p-4 rounded shadow-md h-[60vh] overflow-y-auto mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
          >
            <span
              className={`inline-block p-2 rounded ${
                msg.sender === 'user'
                  ? 'bg-[#0078D4] text-white'
                  : 'bg-[#a30059] text-white'
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {/* Loading Spinner/Text */}
        {loading && (
          <div className="text-center text-gray-500 my-2">
            <span className="animate-spin mr-2">⏳</span>
            Generating reply...
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2"
          placeholder="Type your question..."
          onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatbotPage;
