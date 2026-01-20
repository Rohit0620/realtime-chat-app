import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";

import { getDatabase, ref, push, onChildAdded, onValue, set, remove, onDisconnect } 
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// ✅ ADD THIS LINE BELOW 👇
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL }
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";



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
const storage = getStorage(app);


// DOM
const usernameInput = document.getElementById("username");
const messageInput = document.getElementById("message");
const messagesDiv = document.getElementById("messages");
const sendBtn = document.getElementById("sendBtn");
const sound = document.getElementById("msgSound");
const onlineCount = document.getElementById("onlineCount");
const imageInput = document.getElementById("imageInput");


// 👑 ADMIN SETUP
const ADMIN_NAME = "Rohit";   


//  ONLINE USERS LIST SYSTEM
const userId = Date.now();
let username = "Guest";

const userRef = ref(db, "onlineUsers/" + userId);

// jab user name enter kare
usernameInput.addEventListener("change", () => {
  username = usernameInput.value || "Guest";
  set(userRef, username);
});

// page load par bhi save karo
set(userRef, username);

// tab close hone par auto remove
onDisconnect(userRef).remove();


// Send message
sendBtn.addEventListener("click", async () => {
  if (!usernameInput.value) return;

  const text = messageInput.value;
  const file = imageInput.files[0];

  // 📷 IMAGE SEND
if (file) {
  try {
    alert("Uploading image...");

    const imgRef = storageRef(storage, "images/" + Date.now() + "_" + file.name);
    await uploadBytes(imgRef, file);

    const imgURL = await getDownloadURL(imgRef);
    console.log("Image URL:", imgURL);

    const msgRef = push(ref(db, "messages"));
    await set(msgRef, {
      id: msgRef.key,
      name: usernameInput.value,
      image: imgURL,
      time: Date.now()
    });

    alert("✅ Image sent successfully!");
    imageInput.value = "";
  } catch (err) {
    console.error("❌ Image upload error:", err);
    alert("Image upload failed! Check console.");
  }
}


  // 💬 TEXT SEND
  if (text) {
    const msgRef = push(ref(db, "messages"));
    set(msgRef, {
      id: msgRef.key,
      name: usernameInput.value,
      message: text,
      time: Date.now()
    });

    messageInput.value = "";
  }
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
   try {
  sound.play();
} catch (e) {
  console.log("Sound blocked until user interaction");
}

  }

const isAdmin = usernameInput.value === ADMIN_NAME;
const isMyMsg = data.name === usernameInput.value;

if (data.image) {
  div.innerHTML = `
    <b>${data.name}</b>
    ${(isAdmin || isMyMsg) ? `<button class="delete-btn">🗑</button>` : ""}
    <br>
    <img src="${data.image}" class="chat-img"/>
  `;
} else {
  div.innerHTML = `
    <b>${data.name}</b>
    ${(isAdmin || isMyMsg) ? `<button class="delete-btn">🗑</button>` : ""}
    <br>${data.message}
  `;
}


if (isAdmin || isMyMsg) {
  div.querySelector(".delete-btn").onclick = () => {
    remove(ref(db, "messages/" + snapshot.key));
    div.remove();
  };
}


if (data.name === usernameInput.value) {
  div.querySelector(".delete-btn").onclick = () => {
    remove(ref(db, "messages/" + snapshot.key));
    div.remove();
  };
}

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
// 👥 SHOW ONLINE USERS LIST
const onlineUsersRef = ref(db, "onlineUsers");

onValue(onlineUsersRef, (snapshot) => {
  const usersDiv = document.getElementById("onlineUsers");
  if (!usersDiv) return;

  usersDiv.innerHTML = "🟢 Online: ";

  const users = snapshot.val();
  if (users) {
    Object.values(users).forEach(name => {
      usersDiv.innerHTML += `<span>${name}</span> `;
    });
  }
});
