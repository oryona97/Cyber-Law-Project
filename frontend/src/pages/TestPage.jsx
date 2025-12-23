import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const TestPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const testNumber = "972500000000"; // Fixed number for simulator

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Poll for new messages every 2 seconds
  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/admin/simulator/history/${testNumber}`);
      setMessages(res.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const clearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear the chat history?")) return;
    try {
      await axios.delete(`http://localhost:5001/api/admin/simulator/history/${testNumber}`);
      setMessages([]);
    } catch (error) {
      console.error('Error clearing history:', error);
      alert('Failed to clear history');
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Optimistic UI update (optional, but polling handles it too)
    const userMsg = { sender: 'user', text: input, created_at: new Date().toISOString() };
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
      
      // Force immediate fetch after send
      setTimeout(fetchHistory, 500);

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="d-flex align-items-center mb-3 justify-content-between">
            <div className="d-flex align-items-center">
              <div className="bg-success rounded-circle p-2 me-2 text-white d-flex align-items-center justify-content-center" style={{width: 40, height: 40}}>
                <i className="bi bi-whatsapp"></i>
              </div>
              <h4 className="mb-0">WhatsApp Simulator</h4>
            </div>
            <button className="btn btn-outline-danger btn-sm" onClick={clearHistory}>
              <i className="bi bi-trash me-1"></i> Clear
            </button>
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