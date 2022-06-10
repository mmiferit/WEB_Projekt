import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  onValue
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyA624LlFogz1fHBFnEkUd5MSS8T33X4ekI",
  authDomain: "web-projekt-a5087.firebaseapp.com",
  projectId: "web-projekt-a5087",
  storageBucket: "web-projekt-a5087.appspot.com",
  messagingSenderId: "506064243776",
  appId: "1:506064243776:web:bbc75267c82d120cace3a5",
  measurementId: "G-DQ9SCQWZMG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase();



const btn = document.getElementById("btn_main_login")
if(auth.currentUser!=null){
  btn.innerText="Odjava"
}
// Login
document.getElementById('btn_login').addEventListener('click', () => {
  var email = document.getElementById('login_email').value;
  var password = document.getElementById('login_password').value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
})

//Register
document.getElementById('btn_register').addEventListener('click', () => {
  var email = document.getElementById('register_email').value;
  var password = document.getElementById('register_password').value;
  var passwordConfirm = document.getElementById('register_password_confirm').value;
  var name = document.getElementById('register_name').value;
  var surname = document.getElementById('register_surname').value;
  var phoneNumber = document.getElementById('register_phone').value;
  if (email && password && passwordConfirm && name && surname && phoneNumber) {
    if (password === passwordConfirm) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          writeUserData(user.uid, email, name, surname, phoneNumber);
          alert("Registracija uspješna.")
          $('#register_modal').modal('hide');
        })
        .catch((error) => {
          const errorMessage = error.message;
          alert(errorMessage);
        });
    } else
      alert("Lozinke se ne podudaraju")
  } else
    alert("Neka od polja su prazna")
})

function writeUserData(userId, email, name, surname, phoneNumber) {
  set(ref(database, 'users/' + userId), {
    email: email,
    name: name,
    surname: surname,
    phoneNumber: phoneNumber
  });
}


document.getElementById('add_product').addEventListener('click', () => {
  if(auth.currentUser!=null){
    $('#new_product_modal').modal('show');
  }
  else{
    $('#login_modal').modal('show');
  }
})
