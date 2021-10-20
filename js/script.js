//This funtion creates <a> links to products in the #items section in index.html
function insertProductInIndex(array) {
  for (let i = 0; i < array.length; i++) {
    let itemsSection = document.getElementById("items");
    
    let indexProductLink = document.createElement('a'); //creates 'a' link from id
    
    indexProductLink.setAttribute('href', getProductPageURL(array[i]._id)); //sets the 'href' for products, with id parameter
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

//This function creates an URL object for a product, and returns it
//after adding a search parameter based on the  product id entered;
function getProductPageURL(id) {
  let url = new URL("../html/product.html", window.location);
  url.searchParams.set('id', id);
  return url;
}

//asynchronously GET products data from the API (change API URL if needed),
//then calls the function to build the product elements, on the front page, from the data
fetch("http://localhost:3000/api/products")
//fetch("http://localhost:5000/api/products")
.then(function(response) {
  if (response.ok) {
    return response.json();
  }
})
.then(function(value) {
  let arrayOfProducts = value;
  insertProductInIndex(arrayOfProducts);
})
.catch(function(err) {
  console.error("Une erreur est survenue! =>", err);
});