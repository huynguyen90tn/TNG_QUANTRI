// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDmnu7PdPye-DVJioBj43zU_PBuXZcoRX8",
  authDomain: "tngcompany11.firebaseapp.com",
  projectId: "tngcompany11",
  storageBucket: "tngcompany11.appspot.com",
  messagingSenderId: "884944093886",
  appId: "1:884944093886:web:9978c618fc7ececaf954ef",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
