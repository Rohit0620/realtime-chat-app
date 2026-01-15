import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// ✅ Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCfIeBaQ5B6OTfxT8c4qKjLr3FRNSb0boQ",
  authDomain: "real-time-chat-app-ae7da.firebaseapp.com",
  projectId: "real-time-chat-app-ae7da",
  storageBucket: "real-time-chat-app-ae7da.firebasestorage.app",
  messagingSenderId: "470348929161",
  appId: "1:470348929161:web:37d543c9775dc281dc4e58"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM Elements
const usernameInput = document.getElementById("username");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");
const messagesDiv = document.getElementById("messages");

// Send Message
sendBtn.addEventListener("click", () => {
  const username = usernameInput.value;
  const message = messageInput.value;

  if (!username || !message) return;

  push(ref(db, "messages"), {
    name: username,
    message: message,
    time: Date.now()
  });

  messageInput.value = "";
});

// Receive Messages
onChildAdded(ref(db, "messages"), (snapshot) => {
  const data = snapshot.val();

  const div = document.createElement("div");
  div.className = "message";
  div.innerHTML = `<b>${data.name}:</b> ${data.message}`;

  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
