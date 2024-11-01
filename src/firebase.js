// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBE9By7-_OXGEyzlZ2jGiyi5D6GP30Ao8s",
  authDomain: "professionals-spotlight.firebaseapp.com",
  projectId: "professionals-spotlight",
  storageBucket: "professionals-spotlight.appspot.com",
  messagingSenderId: "578741833833",
  appId: "1:578741833833:web:4a128c7f73b6e5920412f8",
  measurementId: "G-HFKH2ZJDZ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);
export { storage };
export { analytics };
export default app;