function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const categorySelect = document.querySelector('.form-select');
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categorySelect.value.toLowerCase();
        
        const allProductCards = document.querySelectorAll('.product-card');
        let foundResults = false;
        
        allProductCards.forEach(card => {
            const productName = card.querySelector('.card-title').textContent.toLowerCase();
            const productQuantity = card.querySelector('.card-title').textContent.toLowerCase();
            
            const matchesSearch = productName.includes(searchTerm) || productQuantity.includes(searchTerm);
            const matchesCategory = selectedCategory === 'all categories' || 
                                   productName.includes(selectedCategory) || 
                                   productQuantity.includes(selectedCategory);
            
            const parentCol = card.closest('.col-6, .col-md-4, .col-lg-3');
            if (matchesSearch && matchesCategory) {
                parentCol.style.display = 'block';
                foundResults = true;
            } else {
                parentCol.style.display = 'none';
            }
        });
        
        // Show "no results" message if needed
        const sections = ['featured-products', 'bestseller-products', 'best-organic-products'];
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            const visibleCards = section.querySelectorAll('.col-6:not([style*="display: none"]), .col-md-4:not([style*="display: none"]), .col-lg-3:not([style*="display: none"])');
            
            let noResultsMsg = section.querySelector('.no-results-message');
            if (!foundResults && visibleCards.length === 0) {
                if (!noResultsMsg) {
                    noResultsMsg = document.createElement('div');
                    noResultsMsg.className = 'col-12 text-center no-results-message';
                    noResultsMsg.innerHTML = `
                        <div class="alert alert-info">
                            <i class="fa fa-search me-2"></i>
                            No products found matching your search criteria.
                        </div>
                    `;
                    section.appendChild(noResultsMsg);
                }
            } else if (noResultsMsg) {
                noResultsMsg.remove();
            }
        });
        
        // Show notification for search results
        if (searchTerm && foundResults) {
            showNotification(`Found products matching "${searchInput.value}"`, 'success');
        }
    }
    
    // Event listeners
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            } else if (e.target.value.length === 0) {
                // Clear search if input is empty
                clearSearch();
            }
        });
        
        // Real-time search as user types
        searchInput.addEventListener('input', function() {
            if (this.value.length >= 2 || this.value.length === 0) {
                performSearch();
            }
        });
    }
    
    if (categorySelect) {
        categorySelect.addEventListener('change', performSearch);
    }
}

function clearSearch() {
    const allProductCards = document.querySelectorAll('.product-card');
    allProductCards.forEach(card => {
        const parentCol = card.closest('.col-6, .col-md-4, .col-lg-3');
        parentCol.style.display = 'block';
    });
    
    // Remove any "no results" messages
    document.querySelectorAll('.no-results-message').forEach(msg => msg.remove());
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

// Category filter functionality
function setupCategoryFilters() {
    const categoryGrid = document.querySelector('.category-grid');
    if (categoryGrid) {
        const categoryItems = categoryGrid.querySelectorAll('.col > div');
        
        categoryItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remove active class from all items
                categoryItems.forEach(cat => cat.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Get category name
                const categoryName = this.textContent.trim().toLowerCase();
                
                // Update category select dropdown
                const categorySelect = document.querySelector('.form-select');
                if (categorySelect) {
                    for (let option of categorySelect.options) {
                        if (option.textContent.toLowerCase() === categoryName) {
                            categorySelect.value = option.value;
                            break;
                        }
                    }
                }
                
                // Perform search with selected category
                searchProducts();
            });
        });
    }
}

// Initialize search functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    searchProducts();
    setupCategoryFilters();
});
