let cart = [];
let wishlist = [];

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const modalCartTotal = document.getElementById('modalCartTotal');
    const cartItems = document.getElementById('cartItems');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    cartTotal.textContent = totalPrice.toFixed(2);
    modalCartTotal.textContent = totalPrice.toFixed(2);
    
    cartItems.innerHTML = '';
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center">Your cart is empty</p>';
    } else {
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'd-flex align-items-center mb-3 p-2 border-bottom';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="me-3" style="width: 50px; height: 50px; object-fit: cover;">
                <div class="flex-grow-1">
                    <h6 class="mb-0">${item.name}</h6>
                    <small class="text-muted">₹${item.price} x ${item.quantity}</small>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-secondary me-2" onclick="updateQuantity(${index}, -1)">-</button>
                    <span class="mx-2">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary me-2" onclick="updateQuantity(${index}, 1)">+</button>
                    <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})"><i class="fa fa-trash"></i></button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }
}

function updateWishlistDisplay() {
    const wishlistCount = document.getElementById('wishlistCount');
    const wishlistItems = document.getElementById('wishlistItems');
    
    wishlistCount.textContent = wishlist.length;
    
    wishlistItems.innerHTML = '';
    if (wishlist.length === 0) {
        wishlistItems.innerHTML = '<p class="text-center">Your wishlist is empty</p>';
    } else {
        wishlist.forEach((item, index) => {
            const wishlistItem = document.createElement('div');
            wishlistItem.className = 'd-flex align-items-center mb-3 p-2 border-bottom';
            wishlistItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="me-3" style="width: 50px; height: 50px; object-fit: cover;">
                <div class="flex-grow-1">
                    <h6 class="mb-0">${item.name}</h6>
                    <small class="text-muted">₹${item.price}</small>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-success me-2" onclick="moveToCart(${index})">Add to Cart</button>
                    <button class="btn btn-sm btn-danger" onclick="removeFromWishlist(${index})"><i class="fa fa-trash"></i></button>
                </div>
            `;
            wishlistItems.appendChild(wishlistItem);
        });
    }
}

function addToCart(name, price, image, quantity = 1) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ name, price, image, quantity });
    }
    
    updateCartDisplay();
    showNotification('Product added to cart!', 'success');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
    showNotification('Product removed from cart', 'info');
}

function updateQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        updateCartDisplay();
    }
}

function addToWishlist(name, price, image) {
    const existingItem = wishlist.find(item => item.name === name);
    
    if (!existingItem) {
        wishlist.push({ name, price, image });
        updateWishlistDisplay();
        showNotification('Product added to wishlist!', 'success');
    } else {
        showNotification('Product already in wishlist', 'warning');
    }
}

function removeFromWishlist(index) {
    wishlist.splice(index, 1);
    updateWishlistDisplay();
    showNotification('Product removed from wishlist', 'info');
}

function moveToCart(index) {
    const item = wishlist[index];
    addToCart(item.name, item.price, item.image);
    removeFromWishlist(index);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
    notification.style.zIndex = '9999';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
    updateWishlistDisplay();
    
    document.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-cart-btn')) {
            const btn = e.target.closest('.add-to-cart-btn');
            const name = btn.dataset.productName;
            const price = parseFloat(btn.dataset.productPrice);
            const image = btn.dataset.productImage;
            addToCart(name, price, image);
        }
        
        if (e.target.closest('.wishlist-btn')) {
            const btn = e.target.closest('.wishlist-btn');
            const name = btn.dataset.productName;
            const price = parseFloat(btn.dataset.productPrice);
            const image = btn.dataset.productImage;
            addToWishlist(name, price, image);
        }
    });
    
    const quickViewAddToCart = document.getElementById('quickViewAddToCart');
    if (quickViewAddToCart) {
        quickViewAddToCart.addEventListener('click', function() {
            const name = document.getElementById('quickViewName').textContent;
            const price = parseFloat(document.getElementById('quickViewPrice').textContent);
            const image = document.getElementById('quickViewImage').src;
            const quantity = parseInt(document.getElementById('quickViewQuantityInput').value);
            
            addToCart(name, price, image, quantity);
            const modal = bootstrap.Modal.getInstance(document.getElementById('quickViewModal'));
            modal.hide();
        });
    }
});
