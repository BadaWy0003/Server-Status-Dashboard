// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhEmb2xW6Kre0g7Mh0IjH-b2390G5ccPI",
  authDomain: "server-status-dashboard-ee313.firebaseapp.com",
  projectId: "server-status-dashboard-ee313",
  storageBucket: "server-status-dashboard-ee313.firebasestorage.app",
  messagingSenderId: "941303177549",
  appId: "1:941303177549:web:47ebe0962802131ea79704",
  measurementId: "G-LSXBPCKG1H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User signed in:", user);
      return user; // Return user info
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };
  

export const signUp = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error.message;
    }
  };
  
  export const logIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error.message;
    }
  };
  
  export const logOut = async () => {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      throw error.message;
    }
  };
  
  export default auth;