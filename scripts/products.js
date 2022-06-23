import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import {
    getDatabase,
    ref,
    get,
    child
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
const database = getDatabase();

let searchParams = new URLSearchParams(window.location.search)
searchParams.has('filter')
let param = searchParams.get('filter')
document.getElementById('categoryHeading').innerHTML = param;

window.onload = function () {
    const dbRef = ref(database);
    var products = document.getElementById('products');
    var check = false;
    get(child(dbRef, `products/`)).then((snapshot) => {
        snapshot.forEach(function (child) {
            if (snapshot.exists()) {
                if (param == child.child('category').val()) {
                    check = true;
                    console.log(snapshot);
                    var productID = child.key;
                    var category = child.child('category').val();
                    var description = child.child('description').val();

                    var imageURL = child.child('imageURL').val();
                    if (imageURL == "")
                        imageURL = "../img/no-image.jpg";
                    var price = child.child('price').val();
                    var title = child.child('title').val();
                    var userID = child.child('userId').val();

                    var col = document.createElement('div');
                    col.classList.add('col-xs-6');
                    col.classList.add('col-sm-offset-3');
                    col.classList.add('col-md');
                    col.classList.add('mb-5');

                    var card = document.createElement('div');
                    card.classList.add('card');
                    card.classList.add('product');

                    var img = document.createElement('img');
                    img.setAttribute('src', imageURL);
                    img.classList.add('card-img-top');
                    img.classList.add('rounded');
                    img.classList.add('img-fluid');

                    var cardBody = document.createElement('div');
                    cardBody.classList.add('card-body');

                    var titleh4 = document.createElement('h4');
                    titleh4.classList.add('card-title');
                    titleh4.innerHTML = title;

                    var priceh6 = document.createElement('h6');
                    priceh6.classList.add('card-subtitle');
                    priceh6.classList.add('mb-2');
                    priceh6.classList.add('text-muted');
                    priceh6.innerHTML = price + ' kn';

                    var btnDetails = document.createElement('btn');
                    btnDetails.classList.add('btn');
                    btnDetails.classList.add('btn-outline-primary');
                    btnDetails.classList.add('mt-auto');
                    btnDetails.setAttribute('data-toggle', 'modal');
                    btnDetails.setAttribute('data-target', '#modalId');
                    btnDetails.setAttribute('id', productID);
                    btnDetails.innerHTML = "Detalji"

                    btnDetails.addEventListener('click', () => {
                        $('#details_modal').modal('show');
                        document.getElementById('details_category').innerHTML = category;
                        document.getElementById('details_title').innerHTML = title;
                        document.getElementById('details_description').innerHTML = description;
                        document.getElementById('details_price').innerHTML = price + ' kn';
                        document.getElementById('details_img').src = imageURL;

                    })
                    cardBody.appendChild(titleh4);
                    cardBody.appendChild(priceh6);
                    cardBody.appendChild(btnDetails);

                    card.appendChild(img);
                    card.appendChild(cardBody);

                    col.appendChild(card);

                    products.appendChild(col);
                }
            }
        });

        if (!check) {
            var h1 = document.createElement('h1');
            h1.innerHTML = "Trenutno nema proizvoda u traženoj kategoriji."
            products.appendChild(h1);
        }
    });
}