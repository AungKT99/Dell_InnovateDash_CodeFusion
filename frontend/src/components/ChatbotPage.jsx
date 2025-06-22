import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/userApi';
import { localFAQAnswer } from '../utils/faq';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);

    // Try FAQ
    const faqAnswer = localFAQAnswer(input);
    if (faqAnswer) {
      setMessages((prev) => [...prev, { sender: 'bot', text: faqAnswer }]);
      setInput('');
      return;
    }

    // Otherwise, use API
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

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-100 to-blue-100 flex flex-col relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-3xl font-bold text-pink-800 px-6 py-6">Cancer Awareness Chatbot</h2>
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 bg-white border border-gray-300 hover:bg-pink-200 text-gray-700 text-xl rounded-full w-10 h-10 flex items-center justify-center shadow"
          aria-label="Close chatbot"
        >
          ✖
        </button>
      </div>

      {/* Chat window */}
      <div className="flex-1 overflow-y-auto px-2 md:px-0">
        <div className="max-w-xl mx-auto bg-white bg-opacity-90 p-4 rounded-2xl shadow-lg h-[60vh] md:h-[65vh] overflow-y-auto flex flex-col">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end`}
            >
              {/* Bot avatar (left) */}
              {msg.sender === 'bot' && (
                <span className="mr-2 flex-shrink-0">
                  {/* Replace emoji with image if you want: */}
                  {/* <img src="/bot-avatar.png" alt="Bot" className="w-8 h-8 rounded-full border shadow" /> */}
                  <span className="text-2xl">🤖</span>
                </span>
              )}
              <span
                className={`inline-block px-4 py-2 rounded-2xl shadow transition-all
                  ${msg.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-br-md'
                    : 'bg-pink-500 bg-opacity-80 text-white rounded-bl-md'
                  }
                  text-base max-w-xs md:max-w-md break-words`}
              >
                {msg.text}
              </span>
              {/* User avatar (right) */}
              {msg.sender === 'user' && (
                <span className="ml-2 flex-shrink-0">
                  {/* <img src="/user-avatar.png" alt="You" className="w-8 h-8 rounded-full border shadow" /> */}
                  <span className="text-2xl">🧑</span>
                </span>
              )}
            </div>
          ))}
          {/* Loading Spinner */}
          {loading && (
            <div className="flex justify-start mb-2">
              <span className="flex items-center text-gray-400 text-base">
                <svg className="animate-spin mr-2 h-5 w-5 text-pink-400" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" strokeWidth="4" stroke="currentColor"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Generating reply...
              </span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input area pinned at the bottom */}
      <form
        onSubmit={e => { e.preventDefault(); sendMessage(); }}
        className="w-full max-w-xl mx-auto px-2 md:px-0 pt-2 pb-8 flex-shrink-0"
        autoComplete="off"
      >
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 border border-gray-300 rounded-2xl px-4 py-2 text-lg shadow focus:outline-pink-400"
            placeholder="Type your question..."
            onKeyDown={e => { if (e.key === 'Enter' && !loading) sendMessage(); }}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className={`transition bg-gradient-to-r from-pink-600 to-blue-600 text-white px-5 py-2 rounded-2xl shadow hover:from-pink-500 hover:to-blue-500 disabled:opacity-60 text-lg font-semibold`}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatbotPage;
