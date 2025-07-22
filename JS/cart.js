const payBtn = document.querySelector(".btn-buy");

payBtn.addEventListener("click", () => {
    fetch("https://ecomm-ab86.onrender.com/stripe-checkout", {
        method : "post",
        headers :
        new Headers({ "Content-Type" : "application/json" }),
        body : JSON.stringify({
            items : JSON.parse(localStorage.getItem("cartItems")),
        }),
    })
    .then((res) => res.json())
    .then((url) => {

     window.location.href = url;
     //clearCart(); 
    })
    .catch((err) => console.log(err))
});