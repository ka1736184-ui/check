import { db } from "./firebase.js";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  let isRegister = false;

  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const loginBtn = document.getElementById("loginBtn");
  const toggleBtn = document.getElementById("toggleForm");

  // --- Переключение между входом и регистрацией ---
  toggleBtn.addEventListener("click", () => {
    isRegister = !isRegister;
    loginBtn.textContent = isRegister ? "Зарегистрироваться" : "Войти";
    toggleBtn.textContent = isRegister
      ? "Уже есть аккаунт? Войти"
      : "Нет аккаунта? Зарегистрироваться";
  });

  // --- Вход / регистрация ---
  loginBtn.addEventListener("click", async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      alert("Введите логин и пароль!");
      return;
    }

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const snapshot = await getDocs(q);

      if (isRegister) {
        if (!snapshot.empty) {
          alert("⚠️ Такой логин уже существует!");
          return;
        }

        const userId = crypto.randomUUID();
        await setDoc(doc(db, "users", userId), {
          username,
          password, // ⚠️ Для теста, не для продакшена!
          access: ["everything.html", "Sy.html", "PS.html"],
          createdAt: serverTimestamp(),
        });

        localStorage.setItem("username", username);
        alert("✅ Аккаунт создан!");
        window.location.href = "everything.html";
      } else {
        if (snapshot.empty) {
          alert("❌ Пользователь не найден!");
          return;
        }

        const userDoc = snapshot.docs[0].data();
        if (userDoc.password !== password) {
          alert("❌ Неверный пароль!");
          return;
        }

        localStorage.setItem("username", username);
        window.location.href = "everything.html";
      }
    } catch (err) {
      console.error("Ошибка Firebase:", err);
      alert("Ошибка: " + err.message);
    }
  });
});
