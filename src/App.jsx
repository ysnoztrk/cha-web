import React, { useState } from 'react';
import Auth from './components/Auth';
import Home from './components/Home';
import Messages from './components/Messages';
import Flowers from './components/Flowers';
import Photobooth from './components/Photobooth';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  if (!user) {
    return <Auth setUser={setUser} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home user={user} />;
      case 'messages':
        return <Messages user={user} />;
      case 'flowers':
        return <Flowers user={user} />;
      case 'photobooth':
        return <Photobooth user={user} />;
      default:
        return <Home user={user} />;
    }
  };

  return (
    <>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {renderContent()}
      </div>
      
      {/* Navigation Bar */}
      <div className="nav-bar">
        <button 
          className="retro-button nav-button" 
          style={{ backgroundColor: activeTab === 'home' ? 'var(--hot-pink)' : 'var(--window-bg)' }}
          onClick={() => setActiveTab('home')}
        >
          Home 🏠
        </button>
        <button 
          className="retro-button nav-button" 
          style={{ backgroundColor: activeTab === 'messages' ? 'var(--hot-pink)' : 'var(--window-bg)' }}
          onClick={() => setActiveTab('messages')}
        >
          Messages 💬
        </button>
        <button 
          className="retro-button nav-button" 
          style={{ backgroundColor: activeTab === 'flowers' ? 'var(--hot-pink)' : 'var(--window-bg)' }}
          onClick={() => setActiveTab('flowers')}
        >
          Flowers 🌸
        </button>
        <button 
          className="retro-button nav-button" 
          style={{ backgroundColor: activeTab === 'photobooth' ? 'var(--hot-pink)' : 'var(--window-bg)' }}
          onClick={() => setActiveTab('photobooth')}
        >
          Photobooth 📸
        </button>
      </div>
    </>
  );
}
