import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  projectId: "yas-and-cha-love",
  appId: "1:725842750114:web:b9ebdba767653c2b1945fb",
  storageBucket: "yas-and-cha-love.firebasestorage.app",
  apiKey: "AIzaSyA1L5Ectyh22EibgDWE3h5p3C-7W669FJQ",
  authDomain: "yas-and-cha-love.firebaseapp.com",
  messagingSenderId: "725842750114"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
