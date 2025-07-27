// Import the functions you need from the SDKs you need
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    GoogleAuthProvider, // Google Provider is kept
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
    getFirestore,
    setDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDXPTXs4lCGmvvqgodR7qKdZ0gU2d7IDOg", // Ensure this is your actual API key
    authDomain: "login-form-cf809.firebaseapp.com",
    projectId: "login-form-cf809",
    storageBucket: "login-form-cf809.firebasestorage.app",
    messagingSenderId: "439159256691",
    appId: "1:439159256691:web:27a7f738b0d69cece2dc06"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("Firebase app initialized."); // Debugging line

function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    if (messageDiv) {
        messageDiv.style.display = "block";
        messageDiv.innerHTML = message;
        messageDiv.style.opacity = 1;
        setTimeout(function() {
            messageDiv.style.opacity = 0;
        }, 5000);
    } else {
        console.error(`Error: Message div with ID '${divId}' not found.`);
    }
}

// Wrap all DOM-related code in DOMContentLoaded to ensure elements are loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded. Attaching event listeners..."); // Debugging line

    // SIGN UP LOGIC
    const signUp = document.getElementById('submitSignUp');
    if (signUp) {
        signUp.addEventListener('click', (event) => {
            event.preventDefault();
            console.log("Sign Up button clicked.");
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
                            window.location.href = 'main.html';
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
    } else {
        console.error("Sign Up button (submitSignUp) not found.");
    }


    // SIGN IN LOGIC
    const signIn = document.getElementById('submitSignIn');
    if (signIn) {
        signIn.addEventListener('click', (event) => {
            event.preventDefault();
            console.log("Sign In button clicked.");
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const auth = getAuth();

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    showMessage('login is successful', 'signInMessage');
                    const user = userCredential.user;
                    localStorage.setItem('loggedInUserId', user.uid);
                    window.location.href = 'main.html';
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
    } else {
        console.error("Sign In button (submitSignIn) not found.");
    }


    // FORGOT PASSWORD LOGIC
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    console.log("Forgot Password Link element:", forgotPasswordLink);
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (event) => {
            event.preventDefault();
            console.log("Forgot Password link clicked!");

            const emailInput = document.getElementById('email');
            const email = emailInput ? emailInput.value : '';
            console.log("Email value for password reset:", email);

            const auth = getAuth();

            if (email) {
                sendPasswordResetEmail(auth, email)
                    .then(() => {
                        console.log("Password reset email sent successfully.");
                        showMessage('A password reset email has been sent to your email address.', 'signInMessage');
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        console.error("Firebase Password Reset Error:", errorCode, error.message);
                        if (errorCode === 'auth/invalid-email') {
                            showMessage('Invalid email address.', 'signInMessage');
                        } else if (errorCode === 'auth/user-not-found') {
                            showMessage('Account not found for this email address.', 'signInMessage');
                        } else {
                            showMessage('Error sending password reset email. Please try again.', 'signInMessage');
                        }
                    });
            } else {
                console.log("Email field is empty for password reset.");
                showMessage('Please enter your email address to reset your password.', 'signInMessage');
            }
        });
    } else {
        console.error("Forgot Password link (forgotPasswordLink) not found in the DOM.");
    }

    // --- SOCIAL LOGIN LOGIC ---

    // Get references to the Google icon
    const googleIcon = document.querySelector('.icons .fa-google');

    console.log("Google Icon element:", googleIcon);

    const auth = getAuth(); // Get auth instance once for social logins

    // Google Login
    if (googleIcon) {
        googleIcon.addEventListener('click', async () => {
            console.log("Google icon clicked! Attempting signInWithPopup...");
            const provider = new GoogleAuthProvider();
            try {
                const result = await signInWithPopup(auth, provider);
                const user = result.user;
                console.log("Google Sign-in successful:", user);
                showMessage('Signed in with Google successfully!', 'signInMessage');
                localStorage.setItem('loggedInUserId', user.uid);
                window.location.href = 'main.html';
            } catch (error) {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Google Sign-in Error:", errorCode, errorMessage, error);
                if (errorCode === 'auth/popup-closed-by-user') {
                    showMessage('Google Sign-in cancelled by user.', 'signInMessage');
                } else if (errorCode === 'auth/cancelled-popup-request') {
                    showMessage('Another sign-in popup is already open or was recently closed.', 'signInMessage');
                } else {
                    showMessage(`Google Sign-in failed: ${errorMessage}`, 'signInMessage');
                }
            }
        });
    } else {
        console.error("Google icon (.icons .fa-google) not found.");
    }
}); // End of DOMContentLoaded listener
