import React, { useState, useEffect, useRef } from 'react';
import Auth from './components/Auth';
import Home from './components/Home';
import Messages from './components/Messages';
import Flowers from './components/Flowers';
import Photobooth from './components/Photobooth';
import { db } from './firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { requestNotificationPermission, triggerNotification } from './utils/notifications';

export default function App() {
  const [user, setUser] = useState(() => localStorage.getItem('chayas_user') || null);
  const [activeTab, setActiveTab] = useState('home');
  const [toast, setToast] = useState(null);
  const [notifPermission, setNotifPermission] = useState(() => {
    return 'Notification' in window ? Notification.permission : 'unsupported';
  });

  const sessionStartTime = useRef(Date.now());
  const initialLoadDone = useRef(false);

  const handleSetUser = (u) => {
    setUser(u);
    if (u) {
      localStorage.setItem('chayas_user', u);
      // Auto prompt notification permission on login
      handleEnableNotifs();
    } else {
      localStorage.removeItem('chayas_user');
    }
  };

  const handleEnableNotifs = async () => {
    const res = await requestNotificationPermission();
    setNotifPermission(res);
  };

  // Real-time Global Listeners for Notifications
  useEffect(() => {
    if (!user) return;

    // Listen to new messages
    const qMessages = query(collection(db, 'messages'), orderBy('timestamp', 'desc'), limit(1));
    const unsubMessages = onSnapshot(qMessages, (snapshot) => {
      if (!initialLoadDone.current) return;
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          if (data.sender && data.sender !== user) {
            const title = `💖 New message from ${data.sender}!`;
            const body = 'Someone is thinking of you... Open Cha💖Yas to read it 💕';
            triggerNotification({ title, body, tag: 'msg-' + change.doc.id });
            setToast({ title, body, tab: 'messages' });
          }
        }
      });
    });

    // Listen to flowers
    const qFlowers = query(collection(db, 'flowers'), orderBy('timestamp', 'desc'), limit(1));
    const unsubFlowers = onSnapshot(qFlowers, (snapshot) => {
      if (!initialLoadDone.current) return;
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          if (data.sender && data.sender !== user) {
            const title = `🌸 ${data.sender} sent you flowers!`;
            const body = 'You received a bouquet with a secret note! Open to read it 💌';
            triggerNotification({ title, body, tag: 'flw-' + change.doc.id });
            setToast({ title, body, tab: 'flowers' });
          }
        }
      });
    });

    // Listen to photobooth
    const qPhotos = query(collection(db, 'photos'), orderBy('timestamp', 'desc'), limit(1));
    const unsubPhotos = onSnapshot(qPhotos, (snapshot) => {
      if (!initialLoadDone.current) return;
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          if (data.uploader && data.uploader !== user) {
            const title = `📸 New memory added!`;
            const body = `${data.uploader} shared a cute photo! Open to see ✨`;
            triggerNotification({ title, body, tag: 'pho-' + change.doc.id });
            setToast({ title, body, tab: 'photobooth' });
          }
        }
      });
    });

    // Mark initial load finished after a brief moment
    const timer = setTimeout(() => {
      initialLoadDone.current = true;
    }, 2000);

    return () => {
      unsubMessages();
      unsubFlowers();
      unsubPhotos();
      clearTimeout(timer);
    };
  }, [user]);

  // Auto hide in-app toast after 6s
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!user) {
    return <Auth setUser={handleSetUser} />;
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}>
      
      {/* Top Header */}
      <div style={{
        background: 'linear-gradient(90deg, #ff1493, #ff69b4)',
        color: '#fff',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'var(--font-retro)',
        fontSize: '1.2rem',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <img src="/favicon.png" alt="icon" style={{ width: '22px', height: '22px', borderRadius: '4px' }} />
          <span>Cha💖Yas</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
          {notifPermission !== 'granted' && notifPermission !== 'unsupported' && (
            <button
              onClick={handleEnableNotifs}
              style={{
                background: '#fff',
                color: '#ff1493',
                border: '1px solid #ff1493',
                borderRadius: '12px',
                padding: '2px 8px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🔔 Enable Alerts
            </button>
          )}
          <span
            onClick={() => handleSetUser(null)}
            style={{ cursor: 'pointer', opacity: 0.85, fontSize: '0.8rem', textDecoration: 'underline' }}
            title="Switch profile"
          >
            {user} (Logout)
          </span>
        </div>
      </div>

      {/* Retro In-App Toast Popup */}
      {toast && (
        <div
          onClick={() => {
            if (toast.tab) setActiveTab(toast.tab);
            setToast(null);
          }}
          className="retro-window"
          style={{
            position: 'absolute',
            top: '48px',
            left: '10px',
            right: '10px',
            zIndex: 9999,
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            animation: 'bounce 0.5s ease'
          }}
        >
          <div className="retro-title-bar">
            <span>✨ Sweet Notification!</span>
            <span onClick={(e) => { e.stopPropagation(); setToast(null); }}>X</span>
          </div>
          <div className="retro-content" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px' }}>
            <span style={{ fontSize: '1.8rem' }}>💌</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: '#ff1493' }}>{toast.title}</div>
              <div style={{ fontSize: '0.85rem', color: '#333' }}>{toast.body}</div>
            </div>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {renderContent()}
      </div>

      {/* Navigation Bar */}
      <div className="nav-bar">
        <button
          className="retro-button nav-button"
          style={{ backgroundColor: activeTab === 'home' ? 'var(--hot-pink)' : 'var(--window-bg)', color: activeTab === 'home' ? '#fff' : '#000' }}
          onClick={() => setActiveTab('home')}
        >
          Home 🏠
        </button>
        <button
          className="retro-button nav-button"
          style={{ backgroundColor: activeTab === 'messages' ? 'var(--hot-pink)' : 'var(--window-bg)', color: activeTab === 'messages' ? '#fff' : '#000' }}
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
    </div>
  );
}
