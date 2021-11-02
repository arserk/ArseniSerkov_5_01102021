//variables that counts the total price of the products /global
let priceCount = 0;
let newPriceCount = 0;
let globalCounter = 0;

//creates a new element with a class="className" in DOM
function createElementWithClass(element, className) {
    let elem = document.createElement(element);
    elem.classList.add(className);
    return elem;
}

//dynamicly creates articles for products in the cart page
function insertProductInCartPage(product, quantity, color) {
    let selectDiv = document.getElementById("cart__items");
    //cart__item
    let cartItem = createElementWithClass('article', "cart__item");
    cartItem.setAttribute('data-id', product._id);
    cartItem.setAttribute('data-color', color);
    cartItem.setAttribute('data-price', product.price);
    
    //cart__item__image
    let cartItemImg = createElementWithClass('div', "cart__item__img");
    let productImage = document.createElement('img');
    productImage.setAttribute('src', product.imageUrl); //imageUrl
    productImage.setAttribute('alt', product.altTxt); //altTxt 
    
    //cart__item__content
    let cartItemContent = createElementWithClass('div', "cart__item__content");
    //cart__item__content__titlePrice
    let contentTitlePrice = createElementWithClass('div', "cart__item__content__titlePrice");
    contentTitlePrice.innerHTML = `<h2>${product.name}</h2><p>${product.price * quantity} €</p>`;
    //cart__item__content__settings
    let contentSettings = createElementWithClass('div', "cart__item__content__settings");
    let settingsQuantity = createElementWithClass('div', "cart__item__content__settings__quantity");
    settingsQuantity.innerHTML = `<p>Qté : </p><input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${quantity}>`;
    let settingsDelete = createElementWithClass('div', "cart__item__content__settings__delete");
    settingsDelete.innerHTML = `<p class="deleteItem">Supprimer</p>`;
    
    //append all created content
    selectDiv.appendChild(cartItem);
    cartItem.append(cartItemImg, cartItemContent);
    cartItemImg.appendChild(productImage);
    cartItemContent.append(contentTitlePrice, contentSettings);
    contentSettings.append(settingsQuantity, settingsDelete);
}

//displays product's total quantity in the Cart
function displayTotalQuantity(arrJson) {
    let select = document.getElementById("totalQuantity");
    let totalQuantity = 0;
    for (let i in arrJson) {
        totalQuantity += arrJson[i].quantity;
    }
    select.textContent = totalQuantity;
}

//displays  product's total price in the Cart
function displayTotalPrice(priceCount) {
    let select = document.getElementById("totalPrice");
    select.textContent = priceCount;
}

/////////////API URL in fetch function/////////////
//gets a product info form API, with the cart data in localStorage, then sends it to "insertProductInCartPage", in order to display
function fetchAndDisplayProduct(inCart) {
    fetch("http://localhost:3000/api/products/" + inCart.id)
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function(product) {
        insertProductInCartPage(product, inCart.quantity, inCart.color);
        priceCount += (product.price * inCart.quantity);
        displayTotalPrice(priceCount);
    })
    .catch(function(err) {
        console.error("Une erreur est survenue! =>", err);
    });
}
/////////////////////////////////////

//from the product info, gets the price of a single product, and calculates the totalPrice (with the quantity of the product)
function calculateTotalPrice(inCart, arrLength) {
    let price = (document.querySelector(`article[data-id="${inCart.id}"]`)).dataset.price;
    console.log("found price by id =", price);
    newPriceCount += (price * inCart.quantity);
    console.log("newPriceCount", newPriceCount);
    displayTotalPrice(newPriceCount);
    globalCounter++;
    console.log("globalCounter =", globalCounter, "Length = ", arrLength);
    if (globalCounter == arrLength) {
        globalCounter = 0;
        newPriceCount = 0;
    }
}

//removes product from localStorage
function removeProductFromLocal(productId, productColor) {
    let arrJson = JSON.parse(localStorage.getItem("products"));
    console.log("pre-spliced array", arrJson);
    for (let i in arrJson) {
        if ((productId == arrJson[i].id) && (productColor == arrJson[i].color)) {
            console.log("product found in localStorage / Id match", productId, arrJson[i].id, "Color match", productColor, arrJson[i].color);
            arrJson.splice(i, 1);
        } 
    }
    console.log("spliced array", arrJson);
    localStorage.setItem('products', JSON.stringify(arrJson));
    let i = localStorage.length;
    console.log("has localStorage ?=", i);
    return arrJson;
}

//changes product quantity in localStorage
function changeProductQuantityInLocal(newValue, productId, productColor) {
    for (let i in arrJson) {
        if ((productId == arrJson[i].id) && (productColor == arrJson[i].color)) {
            console.log("product found in localStorage / Id match", productId, arrJson[i].id, "Color match", productColor, arrJson[i].color);
            arrJson[i].quantity = newValue;
        } 
    }
    console.log("spliced array with changed quantity", arrJson);
    localStorage.setItem('products', JSON.stringify(arrJson));
    let i = localStorage.length;
    console.log("has localStorage ?=", i);
    return arrJson;
}

//delete an item by clicking on "supprimer"
function deleteItem() {
    document.addEventListener('click', function(e) {
        if (e.target.className == 'deleteItem') {
            let toDelete = e.target.closest("article");
            let inCart = removeProductFromLocal(toDelete.getAttribute('data-id'), toDelete.getAttribute('data-color'));
            // console.log("newInCart Json", inCart);
            if (inCart.length > 0) {
                for (let i in inCart) {
                    calculateTotalPrice(inCart[i], inCart.length);
                }
            }
            else {
                displayTotalPrice(0);
            }
            displayTotalQuantity(inCart);
            toDelete.remove();
        }
    })
}

// updates products, when you manually change a product quantity in the Cart
function changeQuantity() {
    document.addEventListener('change', function(e) {
        if (e.target.className == 'itemQuantity') {
            let targetValue = parseInt(e.target.value);
            let toChange = e.target.closest("article");
            e.target.setAttribute("value", targetValue);
            let inCart = changeProductQuantityInLocal(targetValue, toChange.dataset.id, toChange.dataset.color);
            for (let i in inCart) {
                calculateTotalPrice(inCart[i], inCart.length);
            }
            let select = toChange.querySelector(".cart__item__content__titlePrice p");
            select.innerText = `${toChange.dataset.price * targetValue} €`;
            displayTotalQuantity(inCart);
        }
    })
}

//creates a "contact" object containing the verified inputted information
function orderProducts() {
    let order = document.getElementById("order");
    order.addEventListener('click', function(event) {
        event.preventDefault();
        let arrJson = JSON.parse(localStorage.getItem("products"));
        let contact = {
            firstName: document.getElementById("firstName").value.trim(),
            lastName: document.getElementById("lastName").value.trim(),
            address: document.getElementById("address").value.trim(),
            city: document.getElementById("city").value.trim(),
            email: document.getElementById("email").value
        };
        console.log("contact", contact);
        if (arrJson.length == 0) {
            window.alert("Panier Vide !");
        }
        if (testContact(contact) && (arrJson.length != 0)) {
            sendOrder(contact, arrJson);
        }
    })
}
//function that test the inputted data and writes an error message if the input is not valid
function testContact(contact) {
    let validator = true;
    if (!isFirstNameValid(contact.firstName)) 
    validator = false;
    if (!isLastNameValid(contact.lastName)) 
    validator = false;
    if (!isAddressValid(contact.address))
    validator = false;
    if (!isCityValid(contact.city))
    validator = false;
    if (!isEmailValid(contact.email))
    validator = false;
    console.log("Validator state", validator);
    return validator;
}

//Regex checking functions/ for the form inputs
//checks the first name with Regex, dispalys an error message if not valid
function isFirstNameValid(firstName) {
    if (/^[a-zA-ZÀ-ÿ]+[-' ]*[a-zA-ZÀ-ÿ]+$/.test(firstName)) {
        document.getElementById("firstNameErrorMsg").innerText = "";
        return true;
    }
    else {
        document.getElementById("firstNameErrorMsg").innerText = "Entrez un prénom valide";
        return false;
    }
}

//checks the last name with Regex, dispalys an error message if not valid
function isLastNameValid(lastName) {
    if (/^[a-zA-ZÀ-ÿ]+[-' ]*[a-zA-ZÀ-ÿ]+$/.test(lastName)) {
        document.getElementById("lastNameErrorMsg").innerText = "";
        return true;
    }
    else {
        document.getElementById("lastNameErrorMsg").innerText = "Entrez un nom valide";
        return false;
    }
}

//checks the address with Regex, dispalys an error message if not valid
function isAddressValid(address) {
    if (/((^[0-9]*).?((BIS)|(TER)|(QUATER))?)?((\W+)|(^))(([a-z]+.)*)([0-9]{5})?.(([a-z\'']+.)*)$/.test(address)) {
        document.getElementById("addressErrorMsg").innerText = "";
        return true;
    }
    else {
        document.getElementById("addressErrorMsg").innerText = "Entrez une adresse valide";
        return false;
    }
}

//checks the city with Regex, dispalys an error message if not valid
function isCityValid(city) {
    if (/^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]+$/.test(city)) {
        document.getElementById("cityErrorMsg").innerText = "";
        return true;
    }
    else {
        document.getElementById("cityErrorMsg").innerText = "Entrez une ville valide";
        return false;
    }
}

//checks the email with Regex, dispalys an error message if not valid
function isEmailValid(email) {
    if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
        document.getElementById("emailErrorMsg").innerText = "";
        return true;
    }
    else {
        document.getElementById("emailErrorMsg").innerText = "Email non valide";
        return false;
    }
}
//////////

//sends the "products" string of products-Id for the orders in cart, and the "contact" information from the form, to the API
function sendOrder(contact, arrJson) {
    let productsId = mapId(arrJson);
    console.log("mapped products id form cart", productsId);
    let postData = {
        contact: contact,
        products: productsId
    }
    console.log("contact & products order", postData);
    console.log("contact & products order / stringified", JSON.stringify(postData));
    fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
        'Accept': 'application/json', 
        'Content-Type': 'application/json' 
    },
    body: JSON.stringify(postData)
})
.then(function(res) {
    if (res.ok) {
        return res.json();
    }
})
.then(function(value) {
    gotoConfirmationPage(value.orderId);
})
}

//builds an array of product-Id strings form the cart data in localStorage
function mapId(arrJson) {
    let arrId = [];
    console.log("json parsed in mapId=", arrJson);
    for (let productId of arrJson) {
        console.log(productId.id);
        arrId.push(productId.id);
    }
    console.log("obtained Id string", arrId);
    return arrId;
}

//navigate to the "confirmation" page url, with added orderId parameter
function gotoConfirmationPage(orderId) {
    let url = new URL("../html/confirmation.html", window.location);
    url.searchParams.set('orderid', orderId);
    console.log("new confiramtion url with param", url);
    window.location.href = url;
}

//displays the orderId on the confirmation page
function  displayOrderId() {
    let url = new URL(window.location.href);
    let search_param = new URLSearchParams(url.search);
    if (search_param.has("orderid")) {
        let found_param = search_param.get("orderid");
        document.getElementById("orderId").innerText = found_param;
    }
}

//*!!!88888888888 Test 8888888888!! *//
let arrString = localStorage.getItem("products");
console.log("string in storage =", arrString);
//* 7888888888888888888888888888887*//


///Execution of functions on the cart page
let arrJson = JSON.parse(localStorage.getItem("products"));
////!!!test de parsing du localStorage!!///
console.log("json parsed =", arrJson);
/////!!!!!!!!!!!!!!!!!!!!!!!/////////////
if (window.location.pathname.split('?')[0] == '/html/cart.html') {
    if (arrJson.length == 0) {
        displayTotalPrice(0);
    }
    for (let i in arrJson) {
        fetchAndDisplayProduct(arrJson[i]);
    }
    displayTotalQuantity(arrJson);
    changeQuantity();
    deleteItem();
    orderProducts();
}
else {
    displayOrderId();
}