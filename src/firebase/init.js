// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use

const firebaseConfig = {
  apiKey: "AIzaSyBBaHxJCxygr3x5UzV6_mQNlvfVEyhPtUM",
  authDomain: "meencgm48website.firebaseapp.com",
  projectId: "meencgm48website",
  storageBucket: "meencgm48website.appspot.com",
  messagingSenderId: "18663708953",
  appId: "1:18663708953:web:e682252d577272a179cd88",
  measurementId: "G-RBP1LWVEE6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
