

var cartIcon = document.querySelector("#cart-icon");
var cart = document.querySelector(".cart");
var closeCart = document.querySelector("#close-cart");

// OPen Cart
cartIcon.onclick = () => {
    cart.classList.add("active");
    updateTotal();
    updateCarticon();
}

//closeCart
closeCart.onclick = () => {
    cart.classList.remove("active");
}

if(document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
}
else{
    ready();
}

function ready() {
    loadCartItems();
    updateCarticon();
    //Remove Cart Item
    var removeButtons = document.getElementsByClassName("cart-remove");
    for(var i=0; i < removeButtons.length; i++)
        removeButtons[i].addEventListener("click", removeCartItem);
    //Quantity Change
    var quantityInput = document.getElementsByClassName("cart-quantity");
    for(var i=0; i < quantityInput.length; i++)
        quantityInput[i].addEventListener("change", quantityChanged);
    //Add to Cart
    var addCart = document.getElementsByClassName("add-cart");
    for(var i=0; i < addCart.length; i++)
        addCart[i].addEventListener("click", addCartClicked);
}

//Remove Cart Item
function removeCartItem(event) {
    var button = event.target;
    button.parentElement.remove();
    updateTotal();
    
    saveCartItems();
    updateCarticon();
}

//Quantity Change
function quantityChanged(event) {
    var input = event.target;
    if(isNaN(input.value) || input.value <= 0)
        input.value = 1;
    updateTotal();
    updateCarticon();
    saveCartItems();
}

//Add to Cart
function addCartClicked(event) {
    var button = event.target;
    var shopProduct = button.parentElement;
    var price = shopProduct.getElementsByClassName("price")[0].innerText;
    var productImg = shopProduct.getElementsByClassName("product-img")[0].src;
    var title = shopProduct.getElementsByClassName("product-title")[0].innerText;
    addProductToCart(productImg, title, price);
    updateCarticon();
    saveCartItems();
}

function addProductToCart(productImg, title, price) {
    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");
    var cartItems = document.getElementsByClassName("cart-content")[0];
    var cartItemsNames = cartItems.getElementsByClassName("cart-product-title");
    for(var i=0; i < cartItemsNames.length; i++){
        if(cartItemsNames[i].innerText == title) {
            alert("Item alread Added");
            return;
        }
    }
        var newItem = `
                      <img src="${productImg}"  alt="" class="cart-img" />
                    
                    <div class="detail-box">
                        <div class="cart-product-title">${title}</div>
                        <div class="cart-price">${price}</div>
                        <input 
                        type="number"
                         name="" 
                         id="" 
                         value="1"
                         class="cart-quantity"
                         />
                    </div>
                         <!-- Remove Item-->
                          <i class="bx bx-trash-alt cart-remove"></i>`;
                          cartShopBox.innerHTML = newItem;
                          cartItems.append(cartShopBox);
                          cartShopBox.getElementsByClassName("cart-remove")[0]
                          .addEventListener("click", removeCartItem);
                          cartShopBox.getElementsByClassName("cart-quantity")[0]
                          .addEventListener("change", quantityChanged);
                          updateTotal();
    
}

//Update Total
function updateTotal() {
    var total = 0;
    var cartContent = document.getElementsByClassName("cart-content")[0];
    var cartBoxes = cartContent.getElementsByClassName("cart-box");
    for(var i=0; i < cartBoxes.length; i++){
        var priceElement = cartBoxes[i].getElementsByClassName("cart-price")[0];
        var quantityElement = cartBoxes[i].getElementsByClassName("cart-quantity")[0];
        var price = parseFloat(priceElement.innerText.replace("$", ""));
        var quantity = quantityElement.value;
        total += price * quantity;
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName("total-price")[0].innerText = "$" + total;
    localStorage.setItem("totalPrice", total);
}

//Update cart Icon
function updateCarticon() {
    var cartIcon = document.querySelector("#cart-icon");
    var quantity = 0;
    var cartContent = document.getElementsByClassName("cart-content")[0];
    var cartBoxes = cartContent.getElementsByClassName("cart-box");
    for(var i=0; i < cartBoxes.length; i++){
        var quantityElement = cartBoxes[i].getElementsByClassName("cart-quantity")[0];
        quantity += parseInt(quantityElement.value);
    }
    cartIcon.setAttribute("data-quantity", quantity);
    
}

//Save Cart Items
function saveCartItems() {
    var cartItem = [];
    var cartContent = document.getElementsByClassName("cart-content")[0];
    var cartBoxes = cartContent.getElementsByClassName("cart-box");
    for(var i=0; i < cartBoxes.length; i++){
        var price = cartBoxes[i].getElementsByClassName("cart-price")[0].innerHTML;
        var quantity = cartBoxes[i].getElementsByClassName("cart-quantity")[0].value;
        var productImg = cartBoxes[i].getElementsByClassName("cart-img")[0].src;
        var title = cartBoxes[i].getElementsByClassName("cart-product-title")[0].innerText;
        var item = {
            title : title,
            price : price,
            quantity :quantity,
            productImg : productImg,
        };
        cartItem.push(item);        
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItem));
}

//Load Cart Items
function loadCartItems() {
    var cartItems = localStorage.getItem("cartItems");
    if(cartItems) {
        cartItems = JSON.parse(cartItems);
        for(var i=0; i < cartItems.length; i++) {
            addProductToCart(cartItems[i].productImg, cartItems[i].title, cartItems[i].price);
            var cartBoxes = document.getElementsByClassName("cart-box");
            var cartBox = cartBoxes[cartBoxes.length - 1];
            var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
            quantityElement.value = cartItems[i].quantity;
        }
    }
    var total = localStorage.getItem("totalPrice");
    document.getElementsByClassName("total-price")[0].innerText = total;  
}

//Clear Cart after Successful Payment
function clearCart() {
    var cartContent = document.getElementsByClassName("cart-content")[0];
    cartContent.innerHTML = "";
    updateTotal();
    localStorage.removeItem("cartItems");
}