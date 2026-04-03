const products = [
    { name: "Oranges", quantity: "1kg", discountedPrice: 20, originalPrice: 25, imageUrl: "orange.jpg", tagOrganic: true, tagDiscount: true, section: "featured bestseller best-organic" },
    { name: "Apples", quantity: "1kg", discountedPrice: 15, originalPrice: 18, imageUrl: "apple.jpg", tagOrganic: true, section: "featured best-organic" },
    { name: "Bananas", quantity: "1 dozen", discountedPrice: 10, originalPrice: 12, imageUrl: "banana.jpg", tagOrganic: true, section: "featured bestseller best-organic" },
    { name: "Tomatoes", quantity: "1kg", discountedPrice: 8, originalPrice: 10, imageUrl: "tomato.jpg", tagOrganic: true, section: "featured best-organic" },
    { name: "Potatoes", quantity: "1kg", discountedPrice: 6, originalPrice: 8, imageUrl: "potato.jpg", tagOrganic: true, section: "bestseller" },
    { name: "Onions", quantity: "1kg", discountedPrice: 7, originalPrice: 9, imageUrl: "onion.jpg", tagOrganic: true, section: "bestseller" },
    { name: "Grapes", quantity: "1kg", discountedPrice: 12, originalPrice: 15, imageUrl: "grape.jpg", tagOrganic: true, tagDiscount: true, section: "bestseller best-organic" },
    { name: "Spinach", quantity: "1 bundle", discountedPrice: 5, originalPrice: 7, imageUrl: "spinach.jpg", tagOrganic: true, section: "bestseller best-organic" },
    { name: "Mangoes", quantity: "1kg", discountedPrice: 18, originalPrice: 20, imageUrl: "mango.jpg", tagOrganic: true, section: "featured bestseller best-organic" },
    { name: "Carrots", quantity: "1kg", discountedPrice: 9, originalPrice: 11, imageUrl: "carrot.jpg", tagOrganic: true, tagDiscount: true, section: "featured best-organic" },
    { name: "Cucumber", quantity: "1kg", discountedPrice: 7, originalPrice: 9, imageUrl: "cucumber.jpg", tagOrganic: true, section: "featured bestseller" },
    { name: "Lettuce", quantity: "1 head", discountedPrice: 6, originalPrice: 8, imageUrl: "lettuce.jpg", tagOrganic: true, section: "featured bestseller best-organic" },
    { name: "Lemons", quantity: "1kg", discountedPrice: 10, originalPrice: 12, imageUrl: "lemon.jpg", tagOrganic: true, section: "bestseller best-organic" },
    { name: "Strawberries", quantity: "1 box", discountedPrice: 15, originalPrice: 18, imageUrl: "strawberry.jpg", tagOrganic: true, section: "bestseller best-organic" },
    { name: "Blueberries", quantity: "1 box", discountedPrice: 20, originalPrice: 25, imageUrl: "blueberry.jpeg", tagOrganic: true, tagDiscount: true, section: "bestseller best-organic" },
];

function loadProducts(section_Id, product_Section) {
    const pro_container = document.getElementById(section_Id);
    const pro_template = document.getElementById("product-template").innerHTML;

    if (!pro_container || !pro_template) {
        console.error(`Container or template not found for section: ${section_Id}`);
        return;
    }

    products.forEach(product => {
        if (product.section.includes(product_Section)) {
            let pro_HTML = pro_template;
            
            // Replace template variables
            pro_HTML = pro_HTML.replace(/{{name}}/g, product.name);
            pro_HTML = pro_HTML.replace(/{{quantity}}/g, product.quantity);
            pro_HTML = pro_HTML.replace(/{{discountedPrice}}/g, product.discountedPrice);
            pro_HTML = pro_HTML.replace(/{{originalPrice}}/g, product.originalPrice);
            pro_HTML = pro_HTML.replace(/{{imageUrl}}/g, product.imageUrl);
            
            // Handle tags
            if (product.tagOrganic) {
                pro_HTML = pro_HTML.replace('class="tag-organic">Organic</span>', 'class="tag-organic active">Organic</span>');
            } else {
                pro_HTML = pro_HTML.replace('<span class="badge bg-success position-absolute top-0 start-0 m-2 tag-organic">Organic</span>', '');
            }
            
            if (product.tagDiscount) {
                pro_HTML = pro_HTML.replace('class="tag-discount">-20%</span>', 'class="tag-discount active">-20%</span>');
            } else {
                pro_HTML = pro_HTML.replace('<span class="badge bg-danger position-absolute top-0 end-0 m-2 tag-discount">-20%</span>', '');
            }
            
            pro_container.innerHTML += pro_HTML;
        }
    });
}

// Initialize products when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load products for each section
    setTimeout(() => {
        loadProducts("featured-products", "featured");
        loadProducts("bestseller-products", "bestseller");
        loadProducts("best-organic-products", "best-organic");
        
        // Add animation classes to loaded products
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-fadeInUp');
            }, index * 100);
        });
    }, 500);
});