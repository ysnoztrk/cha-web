import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Flowers({ user }) {
  const [flowers, setFlowers] = useState([]);
  const [file, setFile] = useState(null);
  const [note, setNote] = useState('');
  const [uploading, setUploading] = useState(false);
  const [activeNote, setActiveNote] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'flowers'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fls = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFlowers(fls);
    });
    return () => unsubscribe();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `flowers/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'flowers'), {
        imageUrl: url,
        note: note,
        sender: user,
        receiver: user === 'Yas' ? 'Cha' : 'Yas',
        timestamp: serverTimestamp()
      });

      setFile(null);
      setNote('');
    } catch (error) {
      console.error("Error sending flower: ", error);
      alert("Failed to upload flower :(");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '10px' }}>
      
      {/* Upload Window */}
      <div className="retro-window" style={{ marginBottom: '10px' }}>
        <div className="retro-title-bar">
          <span>Send a Flower 🌸</span>
        </div>
        <div className="retro-content">
          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setFile(e.target.files[0])} 
              style={{ fontSize: '0.9rem' }}
            />
            <input
              type="text"
              className="retro-input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a cute note..."
            />
            <button type="submit" className="retro-button" disabled={uploading || !file}>
              {uploading ? 'Sending...' : 'Send to ' + (user === 'Yas' ? 'Cha' : 'Yas')}
            </button>
          </form>
        </div>
      </div>

      {/* Flower Gallery */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {flowers.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888' }}>No flowers yet...</p>
        )}
        
        {flowers.map((fl) => (
          <div key={fl.id} className="retro-window" style={{ display: 'flex', alignItems: 'center', padding: '10px', position: 'relative' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={fl.imageUrl} alt="flower" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '5px', border: '2px solid black' }} />
              <p style={{ fontSize: '0.8rem', marginTop: '5px' }}>From: {fl.sender}</p>
            </div>
            {fl.note && (
              <div 
                style={{ marginLeft: '10px', cursor: 'pointer', fontSize: '2rem' }}
                onClick={() => setActiveNote(fl.note)}
              >
                ✉️
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Note Modal */}
      {activeNote && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, 
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div className="retro-window" style={{ maxWidth: '300px', width: '90%' }}>
            <div className="retro-title-bar">
              <span>Note.txt</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setActiveNote(null)}>X</span>
            </div>
            <div className="retro-content" style={{ minHeight: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontSize: '1.2rem', textAlign: 'center' }}>
              {activeNote}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
