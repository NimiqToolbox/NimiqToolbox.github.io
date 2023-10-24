console.log("script.js starting. shopData is:", shopData);

document.addEventListener("DOMContentLoaded", function() {
    // Ensure shopData exists
    if (typeof shopData === 'undefined') {
        console.error("shopData is not defined");
    }    

    // Display shop name
    const shopNameElem = document.getElementById('shopName');
    if (shopNameElem) {
        shopNameElem.innerText = shopData.shopName;
    }

    // Load products
    const productListElem = document.getElementById('productList');
    if (productListElem && shopData.products) {
        shopData.products.forEach(product => {
            const li = document.createElement('li');
            li.setAttribute('data-id', product.id);
            const img = document.createElement('img');
            img.src = product.image;
            const name = document.createElement('h2');
            name.innerText = product.name;
            const price = document.createElement('p');
            price.innerText = product.price;
            const btn = document.createElement('button');
            btn.innerText = 'Add to Cart';
            btn.onclick = () => addToCart(product);
            li.appendChild(img);
            li.appendChild(name);
            li.appendChild(price);
            // Description is removed from here
            li.appendChild(btn);
            productListElem.appendChild(li);
        });
    }


    function addToCart(product) {
        const existingProduct = shopData.cart.find(p => p.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            product.quantity = 1;
            shopData.cart.push(product);
        }
        updateCart();
    }

    function updateCart() {
        const cartListElem = document.getElementById('cartList');
        if (!cartListElem) return;
    
        cartListElem.innerHTML = '';
        let total = 0;
        shopData.cart.forEach(product => {
            const li = document.createElement('li');
    
            const productPrice = parseFloat(product.price.replace('$', ''));
            const productTotal = productPrice * product.quantity;
    
            const quantity = document.createElement('strong'); // Use <strong> tag to make the amount of products bold
            quantity.innerText = `${product.quantity} `;
            li.appendChild(quantity);
    
            const name = document.createElement('span');
            name.className = 'cart-item-name';
            name.innerText = `${product.name}`;
            li.appendChild(name);

            const lineBreak = document.createElement('br'); // Add a line break
            li.appendChild(lineBreak);
    
            const productSum = document.createElement('span');
            productSum.innerText = ` $${productTotal.toFixed(2)}`;
            li.appendChild(productSum);
    
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-container';
    
            const decreaseButton = document.createElement('button');
            decreaseButton.className = 'decrease-quantity';
            decreaseButton.innerText = '-';
            decreaseButton.addEventListener('click', function() {
                if (product.quantity > 1) {
                    product.quantity -= 1;
                    updateCart();
                } else {
                    const index = shopData.cart.findIndex(p => p.id === product.id);
                    shopData.cart.splice(index, 1);
                    updateCart();
                }
            });
            buttonContainer.appendChild(decreaseButton);
    
            const increaseButton = document.createElement('button');
            increaseButton.className = 'increase-quantity';
            increaseButton.innerText = '+';
            increaseButton.addEventListener('click', function() {
                product.quantity += 1;
                updateCart();
            });
            buttonContainer.appendChild(increaseButton);
    
            li.appendChild(buttonContainer); // Append the button container to the li element
    
            cartListElem.appendChild(li);

            total += productTotal;
    });
    
        // Display total sum
        const totalElem = document.getElementById('cartTotal');
        if (totalElem) {
        totalElem.innerText = "$" + total.toFixed(2);
        }
}
    
        function showProductDetails(product) {
            console.log("Setting modal description:", product.description);
        
            const modal = document.getElementById('productModal');  // Define the modal variable here
        
            if (modal) {
                const modalImage = document.getElementById('modalImage');
                if (modalImage) {
                    modalImage.src = product.image;
                }
        
                const modalName = document.getElementById('modalName');
                if (modalName) {
                    modalName.innerText = product.name;
                }
        
                const modalPrice = document.getElementById('modalPrice');
                if (modalPrice) {
                    modalPrice.innerText = product.price;
                }
        
                const modalDescription = document.getElementById('modalDescription');
                if (modalDescription) {
                    modalDescription.textContent = product.description;
                }
                
                modal.style.display = 'flex';
        
                const closeButton = document.getElementById('modalCloseButton');
                if (closeButton) {
                    closeButton.addEventListener('click', closeModal);
                }
            }
        }
        
    
        function closeModal() {
            const modal = document.getElementById('productModal');
            if (modal) {
                modal.style.display = 'none';
            }
        }
    
        if (productListElem) {
            productListElem.addEventListener('click', function(event) {
                const li = event.target.closest('li');
                if (!li) return;
                const productId = parseInt(li.getAttribute('data-id'), 10);
                const buttonClicked = event.target.tagName === 'BUTTON';
                if (buttonClicked) return;
                const product = shopData.products.find(p => p.id === productId);
                if (product) {
                    showProductDetails(product);
                }
            });
        }
    
        const productModal = document.getElementById('productModal');
        if (productModal) {
            productModal.addEventListener('click', function(event) {
                if (event.target === event.currentTarget) {
                    closeModal();
                }
            });
        }
    
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        });
    });
    