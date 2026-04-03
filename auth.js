let currentUser = null;

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

function updateLoginButton() {
    const loginBtn = document.querySelector('[data-bs-target="#loginModal"]');
    if (loginBtn) {
        if (currentUser) {
            loginBtn.textContent = currentUser.name;
            loginBtn.classList.remove('btn-outline-success');
            loginBtn.classList.add('btn-success');
            loginBtn.setAttribute('data-bs-toggle', 'dropdown');
            
            // Create dropdown menu
            const dropdown = document.createElement('div');
            dropdown.className = 'dropdown-menu';
            dropdown.innerHTML = `
                <a class="dropdown-item" href="#" onclick="viewProfile()">My Profile</a>
                <a class="dropdown-item" href="#" onclick="viewOrders()">My Orders</a>
                <hr class="dropdown-divider">
                <a class="dropdown-item" href="#" onclick="logout()">Logout</a>
            `;
            loginBtn.parentNode.appendChild(dropdown);
        } else {
            loginBtn.textContent = 'Login';
            loginBtn.classList.remove('btn-success');
            loginBtn.classList.add('btn-outline-success');
            loginBtn.setAttribute('data-bs-toggle', 'modal');
            loginBtn.setAttribute('data-bs-target', '#loginModal');
            
            // Remove dropdown if exists
            const dropdown = loginBtn.parentNode.querySelector('.dropdown-menu');
            if (dropdown) dropdown.remove();
        }
    }
}

function login(email, password) {
    // Simulate authentication (in real app, this would be an API call)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateLoginButton();
        showNotification(`Welcome back, ${user.name}!`, 'success');
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        modal.hide();
        
        return true;
    } else {
        showNotification('Invalid email or password', 'danger');
        return false;
    }
}

function register(name, email, password) {
    // Simulate registration (in real app, this would be an API call)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
        showNotification('Email already registered', 'warning');
        return false;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    showNotification('Registration successful! Please login.', 'success');
    
    // Switch to login tab
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    
    if (loginTab && registerTab) {
        loginTab.click();
    }
    
    return true;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateLoginButton();
    showNotification('Logged out successfully', 'info');
}

function viewProfile() {
    if (!currentUser) return;
    
    showNotification(`Profile: ${currentUser.name} (${currentUser.email})`, 'info');
}

function viewOrders() {
    if (!currentUser) return;
    
    const orders = JSON.parse(localStorage.getItem(`orders_${currentUser.id}`) || '[]');
    if (orders.length === 0) {
        showNotification('No orders found', 'info');
    } else {
        showNotification(`You have ${orders.length} order(s)`, 'info');
    }
}

function saveOrder(orderData) {
    if (!currentUser) {
        showNotification('Please login to place an order', 'warning');
        return false;
    }
    
    const orders = JSON.parse(localStorage.getItem(`orders_${currentUser.id}`) || '[]');
    const newOrder = {
        id: Date.now(),
        ...orderData,
        userId: currentUser.id,
        createdAt: new Date().toISOString(),
        status: 'pending'
    };
    
    orders.push(newOrder);
    localStorage.setItem(`orders_${currentUser.id}`, JSON.stringify(orders));
    
    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    // Check for logged in user
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateLoginButton();
    }
    
    // Login form submission
    const loginForm = document.querySelector('#login form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            if (login(email, password)) {
                loginForm.reset();
            }
        });
    }
    
    // Registration form submission
    const registerForm = document.querySelector('#register form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            
            if (register(name, email, password)) {
                registerForm.reset();
            }
        });
    }
    
    // Checkout button functionality
    const checkoutBtn = document.querySelector('#cartModal .btn-success');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (!currentUser) {
                showNotification('Please login to checkout', 'warning');
                const modal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
                modal.hide();
                
                // Open login modal
                setTimeout(() => {
                    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
                    loginModal.show();
                }, 500);
            } else {
                // Process order
                const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                if (cart.length === 0) {
                    showNotification('Your cart is empty', 'warning');
                } else {
                    const orderData = {
                        items: cart,
                        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                    };
                    
                    if (saveOrder(orderData)) {
                        showNotification('Order placed successfully!', 'success');
                        
                        // Clear cart
                        localStorage.removeItem('cart');
                        location.reload();
                    }
                }
            }
        });
    }
});
