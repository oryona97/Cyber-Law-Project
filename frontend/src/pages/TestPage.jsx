import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const TestPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const testNumber = "TEST_BROWSER_USER"; 

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      await axios.post('http://localhost:5001/api/whatsapp/webhook', {
        object: 'whatsapp_business_account',
        entry: [{
          changes: [{
            value: {
              messages: [{
                from: testNumber,
                text: { body: userMsg.text }
              }]
            }
          }]
        }]
      });

      // Simulate a delay for "thinking"
      setTimeout(fetchHistory, 1500);

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const fetchHistory = async () => {
    // Mock response for now as described in previous turn
    setMessages(prev => [...prev, { sender: 'system', text: '✅ Message processed by backend. (Check logs or Admin Dashboard for Lead creation)' }]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="d-flex align-items-center mb-3">
             <div className="bg-success rounded-circle p-2 me-2 text-white d-flex align-items-center justify-content-center" style={{width: 40, height: 40}}>
               <i className="bi bi-whatsapp"></i>
             </div>
             <h4 className="mb-0">WhatsApp Simulator</h4>
          </div>

          <div className="chat-container shadow-sm border">
            {messages.length === 0 && (
              <div className="text-center text-muted mt-5">
                <p>Start typing to simulate a user conversation...</p>
                <small>Try sending "Hi" to see the menu.</small>
              </div>
            )}
            
            {messages.map((m, i) => (
              <div key={i} className={`message-bubble ${m.sender === 'user' ? 'message-user' : 'message-system'}`}>
                {m.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area border d-flex gap-2">
            <input 
              type="text" 
              className="form-control border-0 bg-white shadow-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              autoFocus
            />
            <button className="btn btn-success px-4" onClick={sendMessage}>
              <i className="bi bi-send-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;