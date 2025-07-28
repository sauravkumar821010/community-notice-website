
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDXPTXs4lCGmvvqgodR7qKdZ0gU2d7IDOg",
  authDomain: "login-form-cf809.firebaseapp.com",
  projectId: "login-form-cf809",
  storageBucket: "login-form-cf809.firebasestorage.app",
  messagingSenderId: "439159256691",
  appId: "1:439159256691:web:27a7f738b0d69cece2dc06"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactAdminForm");
  const adminPanel = document.getElementById("adminPanel");

  // Save feedback
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("contactName").value;
      const email = document.getElementById("contactEmail").value;
      const message = document.getElementById("contactMessage").value;

      try {
        await addDoc(collection(db, "feedback"), {
          name,
          email,
          message,
          timestamp: serverTimestamp()
        });
        alert("Feedback submitted successfully!");
        form.reset();
        loadFeedbackMessages(); // reload immediately after submission
      } catch (err) {
        console.error("Error submitting feedback:", err);
        alert("Failed to submit feedback");
      }
    });
  }

  // Load feedback messages
  async function loadFeedbackMessages() {
    const list = document.getElementById("adminMessagesList");
    const counter = document.getElementById("adminMessageCount");
    if (!list) return;

    list.innerHTML = "";
    try {
      const querySnapshot = await getDocs(collection(db, "feedback"));
      let count = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const item = document.createElement("div");
        item.className = "admin-message-item bg-gray-100 p-4 rounded-lg shadow-md mb-3";
        item.innerHTML = `
          <p><strong>${data.name}</strong> &lt;${data.email}&gt;</p>
          <p>${data.message}</p>
          <p class="text-sm text-right text-gray-500">${(data.timestamp?.toDate?.() || new Date()).toLocaleString()}</p>
        `;
        list.appendChild(item);
        count++;
      });

      if (counter) {
        counter.innerText = count;
      }
    } catch (err) {
      console.error("Failed to load feedback:", err);
    }
  }

  // Load on admin panel open
  const adminToggleBtn = document.getElementById("adminToggleBtn");
  if (adminToggleBtn) {
    adminToggleBtn.addEventListener("click", () => {
      setTimeout(() => loadFeedbackMessages(), 500);
    });
  }

  // Also auto-load on page load in case admin panel is already shown
  if (adminPanel && !adminPanel.classList.contains("hidden")) {
    loadFeedbackMessages();
  }
});
