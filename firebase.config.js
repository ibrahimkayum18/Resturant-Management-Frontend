// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCp0D0hOOwFBQ7lMvsQQ1KvvreLiDXALP8",
  authDomain: "first-project-30d64.firebaseapp.com",
  projectId: "first-project-30d64",
  storageBucket: "first-project-30d64.firebasestorage.app",
  messagingSenderId: "705707928604",
  appId: "1:705707928604:web:f785f485bea316c2ed03d9",
  measurementId: "G-LXYPDDWR63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
