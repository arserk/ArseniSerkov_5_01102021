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
    console.log("passed product to funct =", product);
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

//displays  product's total price in the Cart
function displayTotalPrice(priceCount) {
    let select = document.getElementById("totalPrice");
    select.textContent = priceCount;
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

//gets product info form API, with the cart data in localStorage, passes it to "insertProductInCartPage"
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

//gets product info from API, for the price of a single product, and calculates the totalPrice
function fetchAndDisplayPrice(inCart, arrLength) {
    fetch("http://localhost:3000/api/products/" + inCart.id)
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function(product) {
        newPriceCount += (product.price * inCart.quantity);
        console.log("newPriceCount", newPriceCount);
        displayTotalPrice(newPriceCount);
        globalCounter++;
        console.log("globalCounter =", globalCounter, "Length = ", arrLength);
        if (globalCounter == arrLength) {
            globalCounter = 0;
            newPriceCount = 0;
        }
    })
    .catch(function(err) {
        console.error("Une erreur est survenue! =>", err);
    });
}

//show Alert
function showAlert(text) {
    window.alert(text);
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

//delete an item by clicking on the "supprimer" text
function deleteItem() {
    document.addEventListener('click', function(e) {
        if (e.target.className == 'deleteItem') {
            let toDelete = e.target.closest("article");
            let inCart = removeProductFromLocal(toDelete.getAttribute('data-id'), toDelete.getAttribute('data-color'));
            console.log("newInCart Json", inCart);
            if (inCart.length > 0) {
                for (let i in inCart) {
                    fetchAndDisplayPrice(inCart[i], inCart.length);
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

//products update, when you manually change a product quantity in the Cart
function changeQuantity() {
    document.addEventListener('change', function(e) {
        if (e.target.className == 'itemQuantity') {
            let targetValue = e.target.value;
            let toChange = e.target.closest("article");
            console.log("article id/ color = ", toChange.dataset.id, toChange.dataset.color);
            e.target.setAttribute("value", targetValue);
            let inCart = changeProductQuantityInLocal(targetValue, toChange.dataset.id, toChange.dataset.color);
            for (let i in inCart) {
                fetchAndDisplayPrice(inCart[i], inCart.length);
            }
            let foundU = toChange.querySelector(".cart__item__content__titlePrice p");
            console.log("foundU", foundU);
            foundU.innerText = `${toChange.dataset.price * targetValue} €`;
            displayTotalQuantity(inCart);
        }
    })
}


//*!!!88888888 Test a enlever 8888888888!! */
let arrString = localStorage.getItem("products");
console.log("string in storage =", arrString);
//* 7888888888888888888888888888887*//


let arrJson = JSON.parse(localStorage.getItem("products"));
console.log("json parsed =", arrJson);
if (arrJson.length == 0) {
    displayTotalPrice(0);
}
for (let i in arrJson) {
    fetchAndDisplayProduct(arrJson[i]);
}
displayTotalQuantity(arrJson);
changeQuantity();
deleteItem();