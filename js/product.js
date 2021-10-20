//gets the product id from the URL
function getProductIdFromURL() {
    let url = new URL(window.location.href);
    let search_param = new URLSearchParams(url.search);
    if (search_param.has("id")) {
        let foundId = search_param.get("id");
        return foundId;
    }
}

//dynamicly enters the product data into product.html
function insertProductInProductPage(product) {
    //creates image element in div
    let selectDivClass = document.getElementsByClassName("item__img");
    let productImage = document.createElement('img');
    productImage.setAttribute('src', product.imageUrl); //imageUrl
    productImage.setAttribute('alt', product.altTxt); //altTxt
    selectDivClass[0].appendChild(productImage);
    
    //inserts product name in #title
    let selectDivId = document.getElementById("title");
    selectDivId.innerHTML = product.name;
    
    //inserts price in #price
    selectDivId = document.getElementById("price");
    selectDivId.innerHTML = product.price;
    
    //insert description in #description
    selectDivId = document.getElementById("description");
    selectDivId.innerHTML = product.description;
    
    //creates options for colors in #colors
    selectDivId = document.getElementById("colors");
    for (let i = 0; i < product.colors.length; i++) {
        let createColorOption = document.createElement("option");
        createColorOption.setAttribute('value', product.colors[i]);
        createColorOption.innerText = product.colors[i];
        selectDivId.appendChild(createColorOption);
    }
}

//GETs the correct product data from the API, using "getProductIdFromURL" for the id,
//then, using the product data, completes the product page
fetch("http://localhost:3000/api/products/" + getProductIdFromURL())
//fetch("http://localhost:5000/api/products")
.then(function(response) {
    if (response.ok) {
        return response.json();
    }
})
.then(function(product) {
    insertProductInProductPage(product);
})
.catch(function(err) {
    console.error("Une erreur est survenue! =>", err);
});

//creates an object for localStorage from product
function createJsonObject() {
    let productJson = {
        id :  getProductIdFromURL(),
        quantity : parseInt(document.getElementById("quantity").value),
        color : document.getElementById("colors").value
    }
    return productJson;
}

//this function compares the new product selected and the added products stored in the localStorage, and adds the new product
//it returns an array with the updated products
function parseLocalStorage() {
    let array = new Array();
    let newProductAdded = createJsonObject();
    console.log("newProductAdded =" , newProductAdded);
    if (localStorage.length != 0) {
        array = JSON.parse(localStorage.getItem("products"));
        console.log("if localStorage not 0 array =", array);
        for (let i = 0; i < array.length; i++) {
            console.log("array[i].color =", array[i].color);
            console.log("array[i].id =", array[i].id);
            console.log("array[i].quantity =", array[i].quantity);
            if ((array[i].id === newProductAdded.id) 
            && (array[i].color === newProductAdded.color)) {
                array[i].quantity += newProductAdded.quantity;
                console.log("array[i].quantity, after addition =", array[i].quantity);
                return array;
            }
        }
    }
    array.push(newProductAdded);
    console.log("array returned by parse function =", array);
    return array;
}

//when the button "Ajouter au Panier" is pushed, adds the product information into localStorage
let buttonElement = document.getElementById("addToCart");
buttonElement.addEventListener('click', function() {
    if (document.getElementById("quantity").value > 0) {
        let productArray = parseLocalStorage();
        let productString = JSON.stringify(productArray);
        localStorage.setItem('products', productString);
        let i = localStorage.length;
        console.log("has localStorage ?=", i);
        let array = localStorage.getItem("products");
        console.log("string in storage =", array);
        json = JSON.parse(array);
        console.log("json parsed =", json);
        /*localStorage.clear();
        i = localStorage.length;
        console.log("storage length after clear =", i);*/
    }
    else {
        alert("0 produits séléctionnés");
    }
}); 


/*for( let i = 0; i < localStorage.length; i++){
    localStorage.key(i);
} */