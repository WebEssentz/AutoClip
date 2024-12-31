// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "tubeguruji-startups.firebaseapp.com",
  databaseURL: "https://tubeguruji-startups-default-rtdb.firebaseio.com",
  projectId: "tubeguruji-startups",
  storageBucket: "tubeguruji-startups.appspot.com",
  messagingSenderId: "706430327770",
  appId: "1:706430327770:web:d8ccd85c1c4a0cecad3ee3",
  measurementId: "G-YSY0Z3WDMW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);