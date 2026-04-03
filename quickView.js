function showQuickView(name, price, image, quantity) {
    const quickViewModal = document.getElementById('quickViewModal');
    const quickViewImage = document.getElementById('quickViewImage');
    const quickViewName = document.getElementById('quickViewName');
    const quickViewQuantity = document.getElementById('quickViewQuantity');
    const quickViewPrice = document.getElementById('quickViewPrice');
    const quickViewQuantityInput = document.getElementById('quickViewQuantityInput');
    
    // Set product details
    quickViewImage.src = image;
    quickViewImage.alt = name;
    quickViewName.textContent = name;
    quickViewQuantity.textContent = `Quantity: ${quantity}`;
    quickViewPrice.textContent = price;
    quickViewQuantityInput.value = 1;
    
    // Show modal
    const modal = new bootstrap.Modal(quickViewModal);
    modal.show();
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
    // Add click event listeners to quick view buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.quick-view-btn')) {
            const btn = e.target.closest('.quick-view-btn');
            const name = btn.dataset.productName;
            const price = parseFloat(btn.dataset.productPrice);
            const image = btn.dataset.productImage;
            const quantity = btn.dataset.productQuantity;
            
            showQuickView(name, price, image, quantity);
        }
    });
    
    // Add to cart from quick view
    const quickViewAddToCart = document.getElementById('quickViewAddToCart');
    if (quickViewAddToCart) {
        quickViewAddToCart.addEventListener('click', function() {
            const name = document.getElementById('quickViewName').textContent;
            const price = parseFloat(document.getElementById('quickViewPrice').textContent);
            const image = document.getElementById('quickViewImage').src;
            const quantity = parseInt(document.getElementById('quickViewQuantityInput').value);
            
            // Add to cart using the cart.js function
            if (typeof addToCart === 'function') {
                addToCart(name, price, image, quantity);
            } else {
                // Fallback if cart.js is not loaded
                showNotification('Product added to cart!', 'success');
            }
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('quickViewModal'));
            modal.hide();
        });
    }
    
    // Add to wishlist from quick view
    const quickViewAddToWishlist = document.getElementById('quickViewAddToWishlist');
    if (quickViewAddToWishlist) {
        quickViewAddToWishlist.addEventListener('click', function() {
            const name = document.getElementById('quickViewName').textContent;
            const price = parseFloat(document.getElementById('quickViewPrice').textContent);
            const image = document.getElementById('quickViewImage').src;
            
            // Add to wishlist using the cart.js function
            if (typeof addToWishlist === 'function') {
                addToWishlist(name, price, image);
            } else {
                // Fallback if cart.js is not loaded
                showNotification('Product added to wishlist!', 'success');
            }
        });
    }
});
