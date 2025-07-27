// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDq86SA1CzxTaRI1Dlh_YvkID8tFb6GK2A",
  authDomain: "vendorseva-hackathon.firebaseapp.com",
  projectId: "vendorseva-hackathon",
  storageBucket: "vendorseva-hackathon.firebasestorage.app",
  messagingSenderId: "825980467726",
  appId: "1:825980467726:web:acbfde8a1f0e5af7651a5f",
  measurementId: "G-T9WHQDQE1W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);