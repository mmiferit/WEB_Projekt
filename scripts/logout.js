  // Import the functions you need from the SDKs you need
  import {initializeApp} from "https://www.gstatic.com/firebasejs/9.8.0/firebase-app.js";
  import {
      getAuth,
      signOut
  } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-auth.js";


  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
 apiKey: "AIzaSyDIVX9QO3pKxkMSOo2KxlBWg_TWMtCh4KQ",
 authDomain: "mmiferit.firebaseapp.com",
 projectId: "mmiferit",
 storageBucket: "mmiferit.appspot.com",
 messagingSenderId: "93370237266",
 appId: "1:93370237266:web:c487f811e51f5277503a8b",
 measurementId: "G-72XN1KPKS4"
};;

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();

  logOut.addEventListener('click', (e) => {

      //Sign out user
      signOut(auth).then(() => {
             // Sign-out successful.
      }).catch((error) => {
          // An error happened.
      });
  });
