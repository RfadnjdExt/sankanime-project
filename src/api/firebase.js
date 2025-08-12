import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDOTyCy9Zib0UL_rsG14jGdi79yrD80Dsk",
  authDomain: "login.sankanime.site",
  projectId: "sanka-uploader",
  storageBucket: "sanka-uploader.firebasestorage.app",
  messagingSenderId: "510601697607",
  appId: "1:510601697607:web:d19b8a67958f0eeb6dd462",
  measurementId: "G-KWRYC77XKR",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, db, provider, doc, getDoc, setDoc, onSnapshot };
