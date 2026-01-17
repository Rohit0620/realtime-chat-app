import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, onValue, set, remove } 
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCfIeBaQ5B6OTfxT8c4qKjLr3FRNSb0boQ",
  authDomain: "real-time-chat-app-ae7da.firebaseapp.com",
  projectId: "real-time-chat-app-ae7da",
  storageBucket: "real-time-chat-app-ae7da.appspot.com",
  messagingSenderId: "470348929161",
  appId: "1:470348929161:web:37d543c9775dc281dc4e58"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM
const usernameInput = document.getElementById("username");
const messageInput = document.getElementById("message");
const messagesDiv = document.getElementById("messages");
const sendBtn = document.getElementById("sendBtn");
const sound = document.getElementById("msgSound");
const onlineCount = document.getElementById("onlineCount");

// Random user id
const uid = Date.now();
set(ref(db, "online/" + uid), true);
window.onbeforeunload = () => remove(ref(db, "online/" + uid));

// Online users count
onValue(ref(db, "online"), (snap) => {
  onlineCount.innerText = snap.exists() ? Object.keys(snap.val()).length : 1;
});

// Send message
sendBtn.addEventListener("click", () => {
  if (!usernameInput.value || !messageInput.value) return;

  push(ref(db, "messages"), {
    name: usernameInput.value,
    message: messageInput.value,
    time: Date.now()
  });

  messageInput.value = "";
});

// Receive message
onChildAdded(ref(db, "messages"), (snapshot) => {
  const data = snapshot.val();
  const div = document.createElement("div");
  div.className = "message";

  if (data.name === usernameInput.value) {
    div.classList.add("self");
  } else {
    div.classList.add("other");
    sound.play(); // 🔔 sound
  }

  div.innerHTML = `<b>${data.name}</b><br>${data.message}`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// 🌙 Dark Mode
window.toggleDark = () => {
  document.documentElement.classList.toggle("dark");
};

// 😀 Emoji
window.addEmoji = () => {
  messageInput.value += " 😊";
};

// 🧹 Clear Chat
window.clearChat = () => {
  remove(ref(db, "messages"));
  messagesDiv.innerHTML = "";
};

