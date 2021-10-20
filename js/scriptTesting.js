//On essaye de recuperer les valeurs JSON Promise (?)
class Product {
    constructor(colors, id, name, price, imageUrl, description, altTxt) {
        this.colors = colors;
        this.id = id;
        this.name = name;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        this.altTxt = altTxt;
    }
};

function createProductObject(value) {
    let productObj = new Product(
        value.colors, value._id, value.name, value.price,
        value.imageUrl, value.description, value.altTxt
        )
        return productObj;
    }
    
    function mapProducts(value) {
        let newProduct = [];
        for (let i = 0; i < value.length; i++) {
            newProduct[i] = createProductObject(value[i]); 
            
        }
        return newProduct;
    }
    
    //////////////////////////////////////////////////////////
    //Model of Products in "items" section in index.html///
    function insertAProduct(array) {
        
        for (let i = 0; i < array.lenth; i++) {
            let itemsSection = document.getElementById("items");
            
            let indexProductLink = document.createElement('a'); //attribute=_id
            indexProductLink.setAttribute('href', array[i]._id);
            
            let indexProductArticle = document.createElement('article');
            
            let productImage = document.createElement('img');
            productImage.setAttribute('src', array[i].imageUrl); //imageUrl
            productImage.setAttribute('alt', array[i].altTxt); //altTxt
            
            let productName = document.createElement('h3'); //name
            productName.className = 'productName';
            productName.textContent = array[i].name;
            
            let productDescription = document.createElement('p'); //description
            productDescription.className = 'productDescription';
            productDescription.textContent = array[i].description;
            
            itemsSection.appendChild(indexProductLink);
            indexProductLink.appendChild(indexProductArticle);
            indexProductArticle.append(productImage, productName, productDescription);
            
        }
    }
    
    ///////Test for 1st Product /////
    
    let itemsSection = document.getElementById("items");
    
    let indexProductLink = document.createElement('a'); //attribute=_id
    indexProductLink.setAttribute('href', './product.html?id=107fb5b75607497b96722bda5b504926');
    
    let indexProductArticle = document.createElement('article');
    
    let productImage = document.createElement('img');
    productImage.setAttribute('src', ''); //imageUrl
    productImage.setAttribute('alt', 'Canap'); //altTxt
    
    let productName = document.createElement('h3'); //name
    productName.className = 'productName';
    productName.textContent = 'Kanap Sinope';
    
    let productDescription = document.createElement('p'); //description
    productDescription.className = 'productDescription';
    productDescription.textContent = "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    
    itemsSection.appendChild(indexProductLink);
    indexProductLink.appendChild(indexProductArticle);
    indexProductArticle.append(productImage, productName, productDescription);
    
    //////////////////Etape 3-4 tests /////
    
    let elm = document.getElementById("items");
    elm.addEventListener('click', function(event) {
        if (elm != event.target) {
            return ;
        }
        
    });

    /////////////
    //searchParam test
    
    let str = "http://localhost:3000/api/products.html?id=" + array[i]._id;
    console.log(array[i]._id);
    let url = new URL(str);
    console.log(url);
    let href = url.searchParams.get("id");
    console.log(href);

    //////iterations/ comparaison de ID
    //gets the product id from the URL
function getProductIdFromURLParam() {
    let url = new URL(window.location.href);
    let search_param = new URLSearchParams(url.search);
    console.log(url);
    console.log(search_param);
    if (search_param.has("id")) {
        let foundId = search_param.get("id");
        return foundId;
    }
}

//compares the page product id to get the correct product from API
function getProductFromAPI(products) {
    for (let i = 0; i < products.length; i++) {
        if (products[i]._id = getProductIdFromURLParam()) {
            console.log(products[i]._id);
            console.log(products[i]);
            return products[i];
        }
    }
}

//////////storage tests ////////////////
function createJsonObject(id, quantity, color) {
    let productJson = {
        id : id,
        quantity : quantity,
        color : color
    }
    let productObj = JSON.stringify(productJson);
    return productObj;
}


let buttonElement = document.getElementById("addToCart");
buttonElement.addEventListener('click', function() {
    let id = getProductIdFromURL();
    console.log(id);
    let quantity = document.getElementById("quantity").value;
    console.log(quantity);
    let color = document.getElementById("colors").value;
    console.log(color);
    let cartObject = createJsonObject(id, quantity, color);
    console.log(cartObject);
    localStorage.setItem('product', cartObject);
});
let i = localStorage.length;
console.log(i);