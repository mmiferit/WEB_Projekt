import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  push,
  get,
  child,
  remove
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";

import {
  getStorage,
  ref as refStorage,
  uploadBytes,
  getDownloadURL
}
from "https://www.gstatic.com/firebasejs/9.8.2/firebase-storage.js";

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
const storage = getStorage();

//Check user auth on page load, show appropriate button for signing in and out.
window.onload = function () {
  var btn = document.getElementById("btn_main_login");
  var navbar = document.getElementById("navbarItems");
  auth.onAuthStateChanged(function (user) {
    if (user) {
      loadUserProducts();
      btn.innerText = "Odjava"
      btn.classList.remove("btn-primary");
      btn.classList.add("btn-outline-danger");
      btn.setAttribute('data-toggle', '');
      btn.setAttribute('data-target', '');
      btn.addEventListener('click', () => {
        auth.signOut();
        location.reload();
      })
      var userProducts = document.createElement('li');
      userProducts.classList.add('nav-item');
      var a = document.createElement('a');
      a.classList.add('nav-link');
      a.setAttribute('href', '#');
      a.setAttribute('data-toggle', 'modal');
      a.setAttribute('data-target', '#manageProductsModal');
      a.innerHTML = "Moji oglasi";
      userProducts.appendChild(a);
      navbar.prepend(userProducts);
    }
  });
}

// Login
document.getElementById('btn_login').addEventListener('click', () => {
  var email = document.getElementById('login_email').value;
  var password = document.getElementById('login_password').value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      $('#login_modal').modal('hide');
      clearInputs();
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
          const user = userCredential.user;
          writeUserData(user.uid, email, name, surname, phoneNumber);
          alert("Registracija uspješna.")
          $('#register_modal').modal('hide');
          clearInputs();
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

//Show new product modal on click
document.getElementById('btn_add_product').addEventListener('click', () => {
  if (auth.currentUser != null) {
    $('#new_product_modal').modal('show');
  } else {
    $('#login_modal').modal('show');
  }
})

document.getElementById('btn_publish').addEventListener('click', () => {
  var title = document.getElementById('product_title').value;
  var description = document.getElementById('product_description').value;
  var price = document.getElementById('product_price').value;
  var category = document.getElementById('product_category').value;
  if (title && description && price && category) {
    writeProductData(auth.currentUser.uid, title, description, price, category)
    clearInputs();
  } else
    alert("Neka od polja su prazna")
})

//Write user data to Firebase after registering
function writeUserData(userId, email, name, surname, phoneNumber) {
  set(ref(database, 'users/' + userId), {
    email: email,
    name: name,
    surname: surname,
    phoneNumber: phoneNumber
  });
}

var files = [];
document.getElementById("files").addEventListener("change", function (e) {
  files = e.target.files;
  for (let i = 0; i < files.length; i++) {
    console.log(files[i]);
  }
});

function loadUserProducts() {
  var listingsModal = document.getElementById('userListings');
  listingsModal.innerHTML = "";
  var check = false;
  get(child(ref(database), `products/`)).then((snapshot) => {
    snapshot.forEach(function (child) {
      if (snapshot.exists()) {
        var userID = child.child('userID').val();
        var productID = child.key
        if (auth.currentUser.uid == userID) {
          check = true;
          var formGroup = document.createElement('div');
          formGroup.classList.add('form-group');
          formGroup.classList.add('row');
          var label = document.createElement('label');
          label.setAttribute('for', productID);
          label.classList.add('col-sm-2');
          label.classList.add('col-form-label');
          label.innerHTML = child.child('title').val()

          var btnDiv = document.createElement('div');
          btnDiv.classList.add('col-sm-10');

          var deleteListingBtn = document.createElement('input');
          deleteListingBtn.setAttribute('type', 'button');
          deleteListingBtn.classList.add('btn');
          deleteListingBtn.classList.add('btn-danger');
          deleteListingBtn.classList.add('mb-3');
          deleteListingBtn.value = "Obriši oglas"

          deleteListingBtn.addEventListener('click', () => {
            remove(ref(database, 'products/' + productID));
            alert('Oglas uspješno izbrisan.');
            loadUserProducts();
          })

          btnDiv.appendChild(deleteListingBtn);

          formGroup.appendChild(label);
          formGroup.appendChild(btnDiv);

          listingsModal.appendChild(formGroup);
        }
      }
    });
    if (!check) {
      var p = document.createElement('p');
      p.innerHTML = "Nemate objavljenih oglasa."
      listingsModal.appendChild(p);
    }
  });
}

function writeProductData(userId, title, description, price, category) {

  var userRef = ref(database);
  var email = ""
  var phone = ""
  get(child(userRef, `users/${userId}`)).then((snapshot) => {
    if (snapshot.exists()) {
      email = snapshot.child('email').val();
      phone = snapshot.child('phoneNumber').val();
      var newProductKey = push(userRef).key;
      if (files.length != 0) {
        for (let i = 0; i < files.length; i++) {
          var storageRef = refStorage(storage, newProductKey + files[i].name);
          uploadBytes(storageRef, files[i]).then(() => {
            getDownloadURL(storageRef).then((downloadURL) => {
              set(ref(database, 'products/' + newProductKey), {
                title: title,
                description: description,
                price: price,
                category: category,
                imageURL: downloadURL,
                userID: userId,
                phoneNumber: phone,
                email: email
              });
              loadUserProducts()
            })
          });
        }
      } else {
        set(ref(database, 'products/' + newProductKey), {
          title: title,
          description: description,
          price: price,
          category: category,
          imageURL: "",
          userID: userId,
          phoneNumber: phone,
          email: email
        });
        loadUserProducts()
      }
    }
  }).catch((error) => {
    console.error(error);
  });

}

//Clear inputs after signing in or registering
function clearInputs() {
  document.getElementById('login_email').value = "";
  document.getElementById('login_password').value = "";
  document.getElementById('register_email').value = "";
  document.getElementById('register_password').value = "";
  document.getElementById('register_password_confirm').value = "";
  document.getElementById('register_name').value = "";
  document.getElementById('register_surname').value = "";
  document.getElementById('register_phone').value = "";
  document.getElementById('product_title').value = "";
  document.getElementById('product_description').value = "";
  document.getElementById('product_price').value = "";
  document.getElementById('product_category').value = "Ostalo";
  document.getElementById('files').value = "";
}