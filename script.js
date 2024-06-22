const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")


let cart = [];


cartBtn.addEventListener("click", function() {
    updateCartMoodal();
    cartModal.style.display = "flex"
})  

cartModal.addEventListener("click", function(event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none"
})


menu.addEventListener("click", function(event) {

    
    let parentButton = event.target.closest(".add-to-cart-btn")
   

    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        //const size = parentButton.getAttribute("data-size")
       
        //const size = document.getElementById("select").value;
        
        //parentButton.classList.add(size);

        //console.log(name);
        // console.log(price);
        // console.log(size);
       
        addToCart(name, price)        
    }
       
})

//função para adicionar no carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name) 
    
    if(existingItem){
        existingItem.quantity += 1;
        
    }else {
        cart.push({
            name,
            price,
            quantity: 1,
        }) 
    }

updateCartMoodal()

}

//atualizar o carinho
function updateCartMoodal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
       const cartItemElement = document.createElement("div");
       cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

       cartItemElement.innerHTML = `
       <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>

                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>
            <button class="remove-from-cart-btn" data-name="${item.name}">Remover</button>
       </div>
       `

       total += item.price * item.quantity

       cartItemsContainer.appendChild(cartItemElement)
       
    })

    cartTotal.textContent = total.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"
    });
    
    cartCounter.innerHTML = cart.length;
}

//função para remover item do carinho
cartItemsContainer.addEventListener("click", function(event) {
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
        
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartMoodal();
            return;
        }
            cart.splice(index, 1);
            updateCartMoodal();
    }
}

addressInput.addEventListener("input", function(event) {
    let inputValue = event.target.value;   
    
    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

//finalizar pedido
checkoutBtn.addEventListener("click", function() {

    const isOpen = checkOpen();
    if(!isOpen){

        Toastify({
            text: "A loja está fechada!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "red)",
            },
          }).showToast();

        return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }else{
        addressWarn.style.display = "none"

        Toastify({
            text: "Pedido realizado com sucesso!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "green",
            },
          }).showToast();

    }

//Enviar pedido para api whats
const cartItems = cart.map((item) => {
    return ( 
`
Produto: ${item.name},
Quantidade: ${item.quantity},
Valor : R$ ${item.price.toFixed(2)},
`
)
    
}).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "+5585988630278"

    window.open(`https://wa.me/${phone}?text=Meu pedido:\n${message}\nDúvida: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartMoodal();

})

function checkOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 10 && hora < 22;
    //true = loja esta aberta
}

const spanItem = document.getElementById("date-span")
const isOpen = checkOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600"); 
}else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");

}



