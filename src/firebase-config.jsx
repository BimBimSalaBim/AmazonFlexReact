import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import {dotenvExpand} from 'dotenv-expand';

// const env = dotenvExpand();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_REACT_APP_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_REACT_APP_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_REACT_APP_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_REACT_APP_FIREBASE_APPID,
  measurementId: import.meta.env.VITE_REACT_APP_FIREBASE_MEASUREMENTID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth ,db};