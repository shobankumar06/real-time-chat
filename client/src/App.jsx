import './App.css';
import { useEffect, useRef, useState } from 'react';

const clientId = crypto.randomUUID(); 

const socket = new WebSocket("wss://real-time-chat-production-c87f.up.railway.app");


function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    ws.onmessage = async (event) => {
      const raw = typeof event.data === 'string' ? event.data : await event.data.text();
      const msg = JSON.parse(raw); // { id, text }

      setMessages((prev) => [...prev, msg]);
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() !== '') {
      const messageObj = {
        id: clientId,
        text: input,
      };
      ws.send(JSON.stringify(messageObj));
      setInput('');
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="app-wrapper">
      <div className="chat-container">
        <div className="chat-header">Real-Time Chat</div>
        <div className="chat-box">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-message ${msg.id === clientId ? 'sent' : 'received'}`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message"
          />
          <button className="chat-button" onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
