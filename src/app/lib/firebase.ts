import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5mnWmZzg-oBwm3MwfT1viC3va4IMeasc",
  authDomain: "anvesha-70ab9.firebaseapp.com",
  projectId: "anvesha-70ab9",
  storageBucket: "anvesha-70ab9.firebasestorage.app",
  messagingSenderId: "613805584401",
  appId: "1:613805584401:web:44b81d8e6a2389ddc6c1b0",
  measurementId: "G-ZQG34Q4C35",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
