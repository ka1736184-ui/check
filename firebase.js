// === Firebase подключение ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDscNdDchq0gKiAhwParq8G3cmdVHSxh3I",
  authDomain: "check-50454.firebaseapp.com",
  projectId: "check-50454",
  storageBucket: "check-50454.firebasestorage.app",
  messagingSenderId: "1027090650729",
  appId: "1:1027090650729:web:e7f315793795935292b4f8",
  measurementId: "G-FCHY9Y0BCJ"
};

// Инициализация
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
