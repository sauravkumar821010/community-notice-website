// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    sendPasswordResetEmail // <-- NEW: Import this function
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXPTXs4lCGmvvqgodR7qKdZ0gU2d7IDOg",
  authDomain: "login-form-cf809.firebaseapp.com",
  projectId: "login-form-cf809",
  storageBucket: "login-form-cf809.firebasestorage.app",
  messagingSenderId: "439159256691",
  appId: "1:439159256691:web:27a7f738b0d69cece2dc06"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function showMessage(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function() {
    messageDiv.style.opacity = 0;
  }, 5000);
}

// SIGN UP LOGIC
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
  event.preventDefault();
  const email = document.getElementById('rEmail').value;
  const password = document.getElementById('rPassword').value;
  const firstName = document.getElementById('fName').value;
  const lastName = document.getElementById('lName').value;

  const auth = getAuth();
  const db = getFirestore();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        email: email,
        firstName: firstName,
        lastName: lastName
      };
      showMessage('Account Created Successfully', 'signUpMessage');
      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          window.location.href = 'index.html';
        })
        .catch((error) => {
          console.error("error writing document", error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode == 'auth/email-already-in-use') {
        showMessage('Email Address Already Exists !!!', 'signUpMessage');
      } else {
        showMessage('unable to create User', 'signUpMessage');
      }
    });
});

// SIGN IN LOGIC
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showMessage('login is successful', 'signInMessage');
      const user = userCredential.user;
      localStorage.setItem('loggedInUserId', user.uid);
      window.location.href = 'index.html';
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/invalid-credential') {
        showMessage('Incorrect Email or Password', 'signInMessage');
      } else {
        showMessage('Account does not Exist', 'signInMessage');
      }
    });
});

// FORGOT PASSWORD LOGIC (New Section)
// This code assumes you have a link with id="forgotPasswordLink" in your HTML
// and the sign-in form has an input with id="email"
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
forgotPasswordLink.addEventListener('click', (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const auth = getAuth();

  if (email) {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        showMessage('A password reset email has been sent to your email address.', 'signInMessage');
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/invalid-email') {
          showMessage('Invalid email address.', 'signInMessage');
        } else if (errorCode === 'auth/user-not-found') {
          showMessage('Account not found for this email address.', 'signInMessage');
        } else {
          console.error("Error sending password reset email:", error);
          showMessage('Error sending password reset email. Please try again.', 'signInMessage');
        }
      });
  } else {
    showMessage('Please enter your email address to reset your password.', 'signInMessage');
  }
});