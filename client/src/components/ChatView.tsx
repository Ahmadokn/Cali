import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useUserContext } from '../hooks/useUserContext';
import { api } from '../constants';

export default function ChatView() {
  const { userState } = useUserContext();
  const [messages, setMessages] = useState<{ role: string; content: string; }[]>([
    { role: 'assistant', content: 'How can i help you today?' }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    // Append user message to local state and prepare payload
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await axios.post(
        `${api}/chat`,
        { messages: newMessages },
        { headers: { Authorization: `Bearer ${userState.user.token}` } }
      );
      const aiMessage = response.data.message;
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Chat error:', err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <span
              className={`inline-block px-4 py-2 my-1 rounded-lg ${
                m.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {m.content}
            </span>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-1 border p-2 rounded-l-lg"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-4 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}