import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAE0c0q02BUT59HP_aatGZu1rprejU3Nso",
  authDomain: "buynext-c56b9.firebaseapp.com",
  projectId: "buynext-c56b9",
  storageBucket: "buynext-c56b9.firebasestorage.app",
  messagingSenderId: "341583386356",
  appId: "1:341583386356:web:b87eecdce1f2a99edf30a1",
  measurementId: "G-9VL4TYT1ME"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export default auth