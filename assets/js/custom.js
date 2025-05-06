// This script will be added to the shop.html page to initialize product IDs and set up event listeners

document.addEventListener('DOMContentLoaded', function() {
    // Assign unique IDs to products if they don't have them
    const productCards = document.querySelectorAll('.product-wap');
    
    // Initialize product cards with data attributes and add proper classes to buttons
    productCards.forEach((card, index) => {
        // Assign a unique product ID if not already present
        if (!card.dataset.productId) {
            card.dataset.productId = `product-${index + 1}`;
        }
        
        // Get product details for cart
        const productName = card.querySelector('.card-body a.h3').textContent.trim();
        const productPrice = parseFloat(card.querySelector('.card-body p.text-center').textContent.replace('$', '').trim());
        const productImage = card.querySelector('.card-img').getAttribute('src');
        
        // Set click event for Add to Cart button
        const addToCartBtn = card.querySelector('.product-overlay ul li:nth-child(3) a');
        if (addToCartBtn) {
            // Add proper class
            addToCartBtn.classList.add('add-to-cart-btn');
            // Set event
            addToCartBtn.addEventListener('click', function(e) {
                e.preventDefault();
                // Check if cart object exists
                if (typeof window.cart !== 'undefined') {
                    window.cart.addItem(card.dataset.productId, productName, productPrice, productImage);
                } else {
                    console.error('Cart object not found');
                }
            });
        }
        
        // Set click event for Wishlist button
        const wishlistBtn = card.querySelector('.product-overlay ul li:first-child a');
        if (wishlistBtn) {
            // Add proper class
            wishlistBtn.classList.add('wishlist-btn');
            // Set event
            wishlistBtn.addEventListener('click', function(e) {
                e.preventDefault();
                alert('Product added to wishlist!');
            });
        }
        
        // Set click event for View Product button
        const viewProductBtn = card.querySelector('.product-overlay ul li:nth-child(2) a');
        if (viewProductBtn) {
            // Add proper class
            viewProductBtn.classList.add('view-product-btn');
        }
    });
    
    // Set up cart icon click handler
    const cartIcon = document.querySelector('.nav-icon.position-relative[href="#"]');
    if (cartIcon) {
        cartIcon.setAttribute('href', 'cart.html');
    }
});