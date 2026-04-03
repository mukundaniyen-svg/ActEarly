
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByxynDlIpJAH-ECMNxxGmBx1VNSS5AFXk",
  authDomain: "actearly-app.firebaseapp.com",
  projectId: "actearly-app",
  storageBucket: "actearly-app.firebasestorage.app",
  messagingSenderId: "105910329428",
  appId: "1:105910329428:web:40e8ad343fe9ada7594dc1",
  measurementId: "G-HHX86RDSTX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analyticsInstance = null;

export const getFirebaseAnalytics = async () => {
  if (analyticsInstance) return analyticsInstance;

  const supported = await isSupported();

  if (!supported) {
    console.log("Firebase analytics not supported");
    return null;
  }

  analyticsInstance = getAnalytics(app);

  console.log("✅ Firebase Analytics Initialized", analyticsInstance);

  return analyticsInstance;
};