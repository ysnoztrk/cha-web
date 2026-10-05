import React, { useState, useEffect } from 'react';

const lovePhrases = [
  "I Love You <3",
  "Ich liebe dich <3",
  "Seni seviyorum <3",
  "Mahal kita <3"
];

export default function Home({ user }) {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % lovePhrases.length);
    }, 2500); // Change every 2.5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '20px' }}>
      
      <div className="retro-window" style={{ width: '100%', maxWidth: '350px', marginBottom: '30px' }}>
        <div className="retro-title-bar">
          <span>Welcome.txt</span>
        </div>
        <div className="retro-content" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
            Hello, {user}! Welcome to our special place.
          </p>
          <p>I built this just for us. ❤️</p>
        </div>
      </div>

      <div className="love-loop">
        {lovePhrases[phraseIndex]}
      </div>

      <div style={{ marginTop: 'auto', textAlign: 'center', width: '100%', fontSize: '5rem', animation: 'bounce 2s infinite alternate' }}>
        💖
      </div>

    </div>
  );
}
