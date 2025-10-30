import { auth, db } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCustomToken
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// --- Переключение между входом и регистрацией ---
let isRegister = false;
const toggleBtn = document.getElementById("toggleForm");
toggleBtn.addEventListener("click", () => {
  isRegister = !isRegister;
  document.getElementById("loginBtn").textContent = isRegister ? "Создать аккаунт" : "Войти";
  toggleBtn.textContent = isRegister
    ? "Уже есть аккаунт? Войти"
    : "Нет аккаунта? Зарегистрироваться";
});

// --- Email вход / регистрация ---
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Введите email и пароль");
    return;
  }

  try {
    if (isRegister) {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCred.user.uid), {
        username: email.split("@")[0],
        email,
        access: ["everything.html"],
        createdAt: serverTimestamp(),
      });
      alert("✅ Аккаунт создан!");
      window.location.href = "everything.html";
    } else {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const ref = await getDoc(doc(db, "users", userCred.user.uid));
      if (ref.exists()) {
        const data = ref.data();
        window.location.href = data.access[0] || "everything.html";
      } else {
        alert("⚠️ Пользователь не найден в Firestore.");
      }
    }
  } catch (e) {
    console.error(e);
    alert("Ошибка: " + e.message);
  }
});

// --- Вход через VK ID ---
document.getElementById("vkBtn").addEventListener("click", () => {
  const vkAppId = 54274874;
  const redirectUri = window.location.origin + window.location.pathname;
  const oauthUrl = `https://oauth.vk.com/authorize?client_id=${vkAppId}&display=page&redirect_uri=${redirectUri}&scope=email&response_type=token&v=5.131`;
  window.location.href = oauthUrl;
});

// --- Обработка редиректа от VK ---
window.addEventListener("load", async () => {
  const hash = window.location.hash;
  if (hash.includes("access_token")) {
    const params = new URLSearchParams(hash.replace("#", ""));
    const token = params.get("access_token");
    const email = params.get("email") || "noemail@vk.com";
    const userId = params.get("user_id");

    // Создаём кастомный Firebase UID на основе VK user_id
    const uid = `vk_${userId}`;

    // Проверяем Firestore
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        username: "vk_" + userId,
        email: email,
        access: ["everything.html"],
        createdAt: serverTimestamp(),
      });
    }

    // Локально логинимся через кастомный токен (псевдо)
    alert("✅ Вход через VK успешен!");
    window.location.href = "everything.html";
  }
});
