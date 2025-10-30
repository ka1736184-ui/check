import { auth, db } from "firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Переключение форм
let isRegister = false;
const toggle = document.getElementById("toggleForm");
toggle.addEventListener("click", () => {
  isRegister = !isRegister;
  document.getElementById("loginBtn").textContent = isRegister ? "Создать аккаунт" : "Войти";
  toggle.textContent = isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться";
});

// Email вход/регистрация
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (!email || !pass) return alert("Введите email и пароль");

  try {
    if (isRegister) {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await setDoc(doc(db, "users", cred.user.uid), {
        username: email.split("@")[0],
        email,
        access: ["everything.html"],
        createdAt: serverTimestamp()
      });
      localStorage.setItem("username", email.split("@")[0]);
      window.location.href = "everything.html";
    } else {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const ref = await getDoc(doc(db, "users", cred.user.uid));
      if (ref.exists()) {
        localStorage.setItem("username", ref.data().username);
        window.location.href = "everything.html";
      } else alert("Пользователь не найден в базе");
    }
  } catch (err) {
    alert("Ошибка: " + err.message);
  }
});

// Вход через VK
document.getElementById("vkBtn").addEventListener("click", () => {
  const appId = 54274874;
  const redirectUri = window.location.origin + window.location.pathname;
  const url = `https://oauth.vk.com/authorize?client_id=${appId}&display=page&redirect_uri=${redirectUri}&scope=email&response_type=token&v=5.131`;
  window.location.href = url;
});

// Обработка VK-токена
window.addEventListener("load", async () => {
  const hash = window.location.hash;
  if (hash.includes("access_token")) {
    const params = new URLSearchParams(hash.replace("#", ""));
    const token = params.get("access_token");
    const userId = params.get("user_id");
    const email = params.get("email") || `vk_${userId}@vk.com`;
    const uid = `vk_${userId}`;

    sessionStorage.setItem("vk_uid", uid);

    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        username: `vk_${userId}`,
        email,
        access: ["everything.html"],
        createdAt: serverTimestamp()
      });
    }

    alert("✅ Успешный вход через VK!");
    window.location.href = "everything.html";
  }
});
