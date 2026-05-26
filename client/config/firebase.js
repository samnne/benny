// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFjGSCLTXNF8rNVmAgybnLbjhhpk8BzaY",
  authDomain: "gen-lang-client-0211100695.firebaseapp.com",
  projectId: "gen-lang-client-0211100695",
  storageBucket: "gen-lang-client-0211100695.firebasestorage.app",
  messagingSenderId: "504897902930",
  appId: "1:504897902930:web:8b4571681854645c26028b",
  measurementId: "G-NJLLNN6CD1",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const googleProvider = new GoogleAuthProvider();
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
