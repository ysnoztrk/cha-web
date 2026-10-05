import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

export default function Messages({ user }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        sender: user,
        timestamp: serverTimestamp()
      });
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '10px' }}>
      
      <div className="retro-window" style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
        <div className="retro-title-bar">
          <span>Chat with {user === 'Yas' ? 'Cha' : 'Yas'}</span>
          <span>_ [] X</span>
        </div>
        <div className="retro-content" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '15px' }}>
          
          {messages.length === 0 && (
            <p style={{ textAlign: 'center', color: '#888' }}>No messages yet. Say hi!</p>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`message-bubble ${msg.sender === user ? 'sent' : 'received'}`}>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '2px', color: '#555' }}>
                {msg.sender}
              </div>
              <div>{msg.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '5px' }}>
        <input
          type="text"
          className="retro-input"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1 }}
        />
        <button type="submit" className="retro-button">Send</button>
      </form>

    </div>
  );
}
