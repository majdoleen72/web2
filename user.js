// User page specific functionality
document.addEventListener('DOMContentLoaded', function() {
  // Filter functionality
  const filterBtn = document.querySelector('.btn-filter');
  const categorySelect = document.querySelector('.category-filter');
  
  if (filterBtn) {
    filterBtn.addEventListener('click', function() {
      const selectedCategory = categorySelect.value;
      const rows = document.querySelectorAll('.recipes-table tbody tr');
      
      rows.forEach(row => {
        const categoryBadge = row.querySelector('.category-badge');
        if (categoryBadge) {
          const rowCategory = categoryBadge.textContent.toLowerCase().replace(' ', '-');
          
          if (selectedCategory === 'all' || rowCategory === selectedCategory) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        }
      });
      
      // Show message if no results
      const visibleRows = document.querySelectorAll('.recipes-table tbody tr[style=""]');
      if (visibleRows.length === 0) {
        alert(`No recipes found in "${categorySelect.options[categorySelect.selectedIndex].text}" category.`);
      }
    });
  }
  
  // Remove from favorites
  const removeButtons = document.querySelectorAll('.remove-favorite');
  removeButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const card = this.closest('.favorite-card');
      if (card) {
        card.style.transform = 'scale(0.9)';
        card.style.opacity = '0';
        
        setTimeout(() => {
          card.remove();
          
          // Update favorites count
          const favoritesCount = document.querySelector('.profile-stats .stat-item:nth-child(3) .stat-number');
          if (favoritesCount) {
            let count = parseInt(favoritesCount.textContent);
            if (!isNaN(count) && count > 0) {
              favoritesCount.textContent = (count - 1) + '';
            }
          }
          
          // Show message if no favorites left
          const remainingFavorites = document.querySelectorAll('.favorite-card').length;
          if (remainingFavorites === 0) {
            const favoritesGrid = document.querySelector('.favorites-grid');
            if (favoritesGrid) {
              favoritesGrid.innerHTML = `
                <div class="empty-state">
                  <i class="fas fa-star" style="font-size: 48px; color: var(--gray); margin-bottom: 16px;"></i>
                  <h3>No favorites yet</h3>
                  <p>Start saving your favorite recipes!</p>
                </div>
              `;
            }
          }
        }, 300);
      }
    });
  });
  
  // Table row click
  const tableRows = document.querySelectorAll('.recipes-table tbody tr');
  tableRows.forEach(row => {
    row.addEventListener('click', function(e) {
      // Don't trigger if clicking on a link or button
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
        return;
      }
      
      const link = this.querySelector('a[href^="view-recipe.html"]');
      if (link) {
        window.location.href = link.href;
      }
    });
    
    // Add hover effect
    row.addEventListener('mouseenter', function() {
      this.style.cursor = 'pointer';
    });
  });
  
  // Initialize tooltips
  const tooltips = document.querySelectorAll('[title]');
  tooltips.forEach(element => {
    element.addEventListener('mouseenter', function() {
      // You could add a custom tooltip here if needed
    });
  });
});