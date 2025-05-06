// Shopping Cart Functionality
class ShoppingCart {
    constructor() {
        this.items = [];
        this.totalPrice = 0;
        this.itemCount = 0;
        this.loadCart();
    }
    
    // Add item to cart
    addItem(id, name, price, image, quantity = 1) {
        // Check if item already exists in cart
        const existingItem = this.items.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id,
                name,
                price,
                image,
                quantity
            });
        }
        
        this.updateTotals();
        this.saveCart();
        this.updateCartDisplay();
        
        // Show notification
        this.showNotification(`${name} added to cart!`);
    }
    
    // Remove item from cart
    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.updateTotals();
        this.saveCart();
        this.updateCartDisplay();
    }
    
    // Update item quantity
    updateQuantity(id, quantity) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.quantity = quantity;
            this.updateTotals();
            this.saveCart();
            this.updateCartDisplay();
        }
    }
    
    // Calculate totals
    updateTotals() {
        this.totalPrice = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        this.itemCount = this.items.reduce((count, item) => count + item.quantity, 0);
    }
    
    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify({
            items: this.items,
            totalPrice: this.totalPrice,
            itemCount: this.itemCount
        }));
    }
    
    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            const cart = JSON.parse(savedCart);
            this.items = cart.items || [];
            this.totalPrice = cart.totalPrice || 0;
            this.itemCount = cart.itemCount || 0;
        }
        this.updateCartDisplay();
    }
    
    // Update cart icon and counter
    updateCartDisplay() {
        const cartBadge = document.querySelector('.badge');
        if (cartBadge) {
            cartBadge.textContent = this.itemCount;
        }
    }
    
    // Show notification when product is added
    showNotification(message) {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('cart-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'cart-notification';
            notification.className = 'cart-notification';
            document.body.appendChild(notification);
            
            // Add styles to notification
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.right = '20px';
            notification.style.backgroundColor = '#59ab6e';
            notification.style.color = 'white';
            notification.style.padding = '10px 20px';
            notification.style.borderRadius = '5px';
            notification.style.zIndex = '1000';
            notification.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
            notification.style.transition = 'opacity 0.3s ease-in-out';
            notification.style.opacity = '0';
        }
        
        // Set message and show notification
        notification.textContent = message;
        notification.style.opacity = '1';
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
        }, 3000);
    }
    
    // Render cart page
    renderCartPage() {
        const cartContainer = document.getElementById('cart-container');
        if (!cartContainer) return;
        
        if (this.items.length === 0) {
            cartContainer.innerHTML = '<div class="text-center py-5"><h2>Your cart is empty</h2><p>Continue shopping to add products to your cart.</p><a href="shop.html" class="btn btn-success">Continue Shopping</a></div>';
            return;
        }
        
        let html = `
            <h2 class="h2 pb-4">Shopping Cart</h2>
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Product</th>
                            <th scope="col">Price</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Total</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        this.items.forEach(item => {
            html += `
                <tr data-id="${item.id}">
                    <td class="align-middle">
                        <div class="d-flex align-items-center">
                            <img src="${item.image}" alt="${item.name}" class="img-fluid mr-3" style="max-width: 80px; margin-right: 15px;">
                            <span>${item.name}</span>
                        </div>
                    </td>
                    <td class="align-middle">$${item.price.toFixed(2)}</td>
                    <td class="align-middle">
                        <div class="input-group" style="max-width: 120px;">
                            <button class="btn btn-sm btn-outline-secondary decrease-quantity" type="button">-</button>
                            <input type="text" class="form-control text-center item-quantity" value="${item.quantity}" readonly>
                            <button class="btn btn-sm btn-outline-secondary increase-quantity" type="button">+</button>
                        </div>
                    </td>
                    <td class="align-middle">$${(item.price * item.quantity).toFixed(2)}</td>
                    <td class="align-middle">
                        <button class="btn btn-sm btn-danger remove-item"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <a href="shop.html" class="btn btn-outline-success">Continue Shopping</a>
                </div>
                <div class="col-md-6 text-end">
                    <div class="border p-3 mb-3">
                        <h5>Cart Summary</h5>
                        <div class="d-flex justify-content-between">
                            <span>Subtotal:</span>
                            <span>$${this.totalPrice.toFixed(2)}</span>
                        </div>
                        <div class="d-flex justify-content-between mt-2">
                            <span>Shipping:</span>
                            <span>Free</span>
                        </div>
                        <hr>
                        <div class="d-flex justify-content-between fw-bold">
                            <span>Total:</span>
                            <span>$${this.totalPrice.toFixed(2)}</span>
                        </div>
                        <button class="btn btn-success w-100 mt-3" id="checkout-btn">Proceed to Checkout</button>
                    </div>
                </div>
            </div>
        `;
        
        cartContainer.innerHTML = html;
        
        // Add event listeners for cart interactions
        this.addCartEventListeners();
    }
    
    // Add event listeners for cart interactions
    addCartEventListeners() {
        // Increase quantity buttons
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                const id = row.dataset.id;
                const quantityInput = row.querySelector('.item-quantity');
                const newQuantity = parseInt(quantityInput.value) + 1;
                this.updateQuantity(id, newQuantity);
                quantityInput.value = newQuantity;
                row.querySelector('td:nth-child(4)').textContent = '$' + (this.items.find(item => item.id === id).price * newQuantity).toFixed(2);
            });
        });
        
        // Decrease quantity buttons
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                const id = row.dataset.id;
                const quantityInput = row.querySelector('.item-quantity');
                let newQuantity = parseInt(quantityInput.value) - 1;
                if (newQuantity < 1) newQuantity = 1;
                this.updateQuantity(id, newQuantity);
                quantityInput.value = newQuantity;
                row.querySelector('td:nth-child(4)').textContent = '$' + (this.items.find(item => item.id === id).price * newQuantity).toFixed(2);
            });
        });
        
        // Remove item buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                const id = row.dataset.id;
                this.removeItem(id);
                row.remove();
                
                // Check if cart is empty and update display
                if (this.items.length === 0) {
                    this.renderCartPage();
                }
            });
        });
        
        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                alert('Checkout functionality will be implemented in the future.');
                // Here you would redirect to a checkout page
            });
        }
    }
}

// Initialize cart when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize shopping cart
    const cart = new ShoppingCart();
    window.cart = cart; // Make cart globally accessible
    
    // Add to cart button events
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const productCard = button.closest('.product-wap');
            const productId = productCard.dataset.productId;
            const productName = productCard.querySelector('.card-body a.h3').textContent;
            const productPrice = parseFloat(productCard.querySelector('.card-body p.text-center').textContent.replace('$', ''));
            const productImage = productCard.querySelector('.card-img').src;
            
            cart.addItem(productId, productName, productPrice, productImage);
        });
    });
    
    // Cart icon click event
    const cartIcon = document.querySelector('.nav-icon.position-relative[href="#"]');
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    }
    
    // Check if we're on the cart page and render it
    if (window.location.pathname.includes('cart.html')) {
        cart.renderCartPage();
    }
    
    // Wishlist button events
    const wishlistButtons = document.querySelectorAll('.product-overlay li:first-child a');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Item added to wishlist');
        });
    });
    
    // View product button events
    const viewProductButtons = document.querySelectorAll('.product-overlay li:nth-child(2) a');
    viewProductButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = button.closest('.product-wap');
            const productLink = productCard.querySelector('.card-body a.h3').getAttribute('href');
            if (productLink) {
                window.location.href = productLink;
            }
        });
    });
});