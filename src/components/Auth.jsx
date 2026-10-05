import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function IntroAnimation({ onComplete }) {
  return (
    <div className="flower-intro">
      <motion.div
        className="flower-left"
        initial={{ x: 0, opacity: 1, rotate: 0 }}
        animate={{ x: -200, opacity: 0, rotate: -45 }}
        transition={{ duration: 2, delay: 1 }}
        onAnimationComplete={onComplete}
      >
        🌸
      </motion.div>
      <motion.div
        className="flower-right"
        initial={{ x: 0, opacity: 1, rotate: 0 }}
        animate={{ x: 200, opacity: 0, rotate: 45 }}
        transition={{ duration: 2, delay: 1 }}
      >
        🌺
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        style={{ position: 'absolute', fontSize: '2rem', fontFamily: 'var(--font-retro)' }}
      >
        Welcome to our space &lt;3
      </motion.div>
    </div>
  );
}

export default function Auth({ setUser }) {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [introDone, setIntroDone] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (selectedProfile === 'Cha' && pin === '250508') {
      setUser('Cha');
    } else if (selectedProfile === 'Yas' && pin === '160306') {
      setUser('Yas');
    } else {
      setError('Wrong PIN! Try again :)');
    }
  };

  if (!introDone) {
    return <IntroAnimation onComplete={() => setIntroDone(true)} />;
  }

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
      
      {!selectedProfile ? (
        <div className="retro-window" style={{ width: '100%', maxWidth: '300px' }}>
          <div className="retro-title-bar">
            <span>Login.exe</span>
            <span>X</span>
          </div>
          <div className="retro-content" style={{ textAlign: 'center' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Who are you?</h2>
            <div style={{ display: 'flex', justifyContent: 'space-around', gap: '10px' }}>
              <button className="retro-button" onClick={() => setSelectedProfile('Yas')}>Yas 🧍‍♂️</button>
              <button className="retro-button" onClick={() => setSelectedProfile('Cha')}>Cha 🧍‍♀️</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="retro-window" style={{ width: '100%', maxWidth: '300px' }}>
          <div className="retro-title-bar">
            <span>Enter PIN for {selectedProfile}</span>
            <span style={{cursor:'pointer'}} onClick={() => { setSelectedProfile(null); setPin(''); setError(''); }}>X</span>
          </div>
          <div className="retro-content">
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <p>Please enter your secret birthday PIN:</p>
              <input
                type="password"
                className="retro-input"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="******"
                maxLength={6}
                autoFocus
              />
              {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
              <button type="submit" className="retro-button">Login &lt;3</button>
            </form>
          </div>
        </div>
      )}

      {/* Marquee for nostalgia */}
      <div className="marquee-container" style={{ width: '100%', maxWidth: '300px', marginTop: 'auto' }}>
        <div className="marquee-text">~ Welcome to our little internet corner ~ Welcome to our little internet corner ~</div>
      </div>
    </div>
  );
}
