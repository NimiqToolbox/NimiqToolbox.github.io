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

            const name = document.createElement('span');
            name.className = 'cart-item-name';
            name.innerText = `${product.name} - ${product.price} x ${product.quantity} = $${productTotal.toFixed(2)}`;
            li.appendChild(name);

            const increaseButton = document.createElement('button');
            increaseButton.className = 'increase-quantity';
            increaseButton.innerText = '+';
            increaseButton.addEventListener('click', function() {
                product.quantity += 1;
                updateCart();
            });
            li.appendChild(increaseButton);

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
            li.appendChild(decreaseButton);

            cartListElem.appendChild(li);

            total += productTotal;
        });

        // Display total sum
        const totalElem = document.getElementById('cartTotal');
        if (totalElem) {
            totalElem.innerText = "$" + total.toFixed(2);
        }
    }


    // Create and initialize the checkout section
        // Create and initialize the checkout section
        const checkoutSection = document.getElementById('checkoutSection');
        if (checkoutSection) {
            const addressInput = checkoutSection.querySelector('input');
            const checkoutButton = checkoutSection.querySelector('#checkoutButton');
            if (checkoutButton) {
                checkoutButton.addEventListener('click', function() {
                    if (addressInput) {
                        const totalElem = document.getElementById('cartTotal');
                        alert("Total to pay: " + (totalElem ? totalElem.innerText : "$0.00") + "\nShipping to: " + addressInput.value);
                    }
                    shopData.cart = [];
                    updateCart();
                });
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
    