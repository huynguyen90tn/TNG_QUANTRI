// File: src/services/api/firebase.js
// Nhánh: main
// Link tham khảo: https://firebase.google.com/docs/web/setup

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Cấu hình Firebase cho ứng dụng
const firebaseConfig = {
  apiKey: "AIzaSyDmnu7PdPye-DVJioBj43zU_PBuXZcoRX8",
  authDomain: "tngcompany11.firebaseapp.com", 
  projectId: "tngcompany11",
  storageBucket: "tngcompany11.appspot.com",
  messagingSenderId: "884944093886",
  appId: "1:884944093886:web:9978c618fc7ececaf954ef"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo các services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export các services để sử dụng trong ứng dụng
export { auth, db, storage };