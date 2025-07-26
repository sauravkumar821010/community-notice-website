 // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
  import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js"
  import {getFirestore, getDoc, doc} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js"
  // TODO: Add SDKs for Firebase products that you want to use

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
  const auth=getAuth();
  const db=getFirestore();

  onAuthStateChanged(auth, (user)=>{
    const loggedInUserId=localStorage.getItem('loggedInUserId');
    if(loggedInUserId){
        console.log(user);
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
        .then((docSnap)=>{
            if(docSnap.exists()){
                const userData=docSnap.data();
                document.getElementById('loggedUserFName').innerText=userData.firstName;
                document.getElementById('loggedUserEmail').innerText=userData.email;
                document.getElementById('loggedUserLName').innerText=userData.lastName;

            }
            else{
                console.log("no document found matching id")
            }
        })
        .catch((error)=>{
            console.log("Error getting document");
        })
    }
    else{
        console.log("User Id not Found in Local storage")
    }
  })

  const logoutButton=document.getElementById('logout');

  logoutButton.addEventListener('click',()=>{
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
    .then(()=>{
        window.location.href='index.html';
    })
    .catch((error)=>{
        console.error('Error Signing out:', error);
    })
})