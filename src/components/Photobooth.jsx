import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Photobooth({ user }) {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'photos'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPhotos(pts);
    });
    return () => unsubscribe();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `photobooth/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'photos'), {
        imageUrl: url,
        uploader: user,
        timestamp: serverTimestamp()
      });

      setFile(null);
    } catch (error) {
      console.error("Error uploading photo: ", error);
      alert("Failed to upload photo :(");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '10px' }}>
      
      {/* Upload Window */}
      <div className="retro-window" style={{ marginBottom: '10px' }}>
        <div className="retro-title-bar">
          <span>Photobooth 📸</span>
        </div>
        <div className="retro-content">
          <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setFile(e.target.files[0])} 
              style={{ fontSize: '0.9rem' }}
            />
            <button type="submit" className="retro-button" disabled={uploading || !file}>
              {uploading ? 'Uploading...' : 'Add Photo'}
            </button>
          </form>
        </div>
      </div>

      {/* Gallery */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
        {photos.length === 0 && (
          <p style={{ width: '100%', textAlign: 'center', color: '#888' }}>No photos yet...</p>
        )}
        
        {photos.map((pt) => (
          <div key={pt.id} style={{ 
            backgroundColor: 'white', 
            padding: '10px 10px 30px 10px', 
            boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
            border: '1px solid #ddd',
            width: '140px',
            transform: `rotate(${Math.random() * 10 - 5}deg)`,
            marginBottom: '10px'
          }}>
            <img src={pt.imageUrl} alt="memory" style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
            <div style={{ textAlign: 'center', marginTop: '5px', fontSize: '0.7rem', color: '#555' }}>
              Added by {pt.uploader}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
