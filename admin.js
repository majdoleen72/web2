// Admin page specific functionality
document.addEventListener('DOMContentLoaded', function() {
  // Handle report actions
  const actionForms = document.querySelectorAll('.action-form');
  
  actionForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get the clicked button
      const clickedButton = e.submitter || e.target.querySelector('button[type="submit"]:focus');
      
      if (clickedButton) {
        const row = this.closest('tr');
        const recipeName = row.querySelector('.recipe-info strong').textContent;
        const userName = row.querySelector('.creator-info strong').textContent;
        
        if (clickedButton.classList.contains('btn-block')) {
          // Block user action
          if (confirm(`Are you sure you want to block ${userName}? This will prevent them from posting new recipes.`)) {
            // Show success message
            showNotification(`User ${userName} has been blocked successfully.`, 'success');
            
            // Move user to blocked list (simulated)
            setTimeout(() => {
              // Remove from reports table
              row.style.opacity = '0.5';
              row.style.pointerEvents = 'none';
              
              // Update blocked count
              updateBlockedCount(1);
              updatePendingCount(-1);
            }, 500);
          }
        } else if (clickedButton.classList.contains('btn-dismiss')) {
          // Dismiss report action
          if (confirm(`Dismiss report for "${recipeName}"?`)) {
            showNotification(`Report for "${recipeName}" has been dismissed.`, 'info');
            
            // Remove from table
            row.style.opacity = '0.3';
            setTimeout(() => {
              row.remove();
              updatePendingCount(-1);
              
              // Show empty state if no reports
              checkEmptyState();
            }, 300);
          }
        }
      }
    });
  });
  
  // Unblock user buttons
  const unblockButtons = document.querySelectorAll('.btn-unblock');
  unblockButtons.forEach(button => {
    button.addEventListener('click', function() {
      const card = this.closest('.blocked-card');
      const userName = card.querySelector('h3').textContent;
      
      if (confirm(`Unblock user ${userName}? They will be able to access the platform again.`)) {
        showNotification(`User ${userName} has been unblocked.`, 'success');
        
        // Animate removal
        card.style.transform = 'scale(0.95)';
        card.style.opacity = '0';
        
        setTimeout(() => {
          card.remove();
          updateBlockedCount(-1);
          
          // Show empty state if no blocked users
          const blockedCards = document.querySelectorAll('.blocked-card').length;
          if (blockedCards === 0) {
            const blockedGrid = document.querySelector('.blocked-grid');
            if (blockedGrid) {
              blockedGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--gray);">
                  <i class="fas fa-user-check" style="font-size: 48px; margin-bottom: 16px;"></i>
                  <h3>No blocked users</h3>
                  <p>All users are currently active on the platform.</p>
                </div>
              `;
            }
          }
        }, 300);
      }
    });
  });
  
  // Review button click
  const reviewButtons = document.querySelectorAll('.btn-review');
  reviewButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const url = this.getAttribute('href');
      // You could open in new tab or log for demo
      console.log('Opening recipe for review:', url);
      // window.open(url, '_blank'); // Uncomment for new tab
    });
  });
  
  // Helper functions
  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
      </div>
      <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(59, 130, 246, 0.9)'};
      color: white;
      padding: 16px 20px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 15px;
      min-width: 300px;
      max-width: 400px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    
    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
    
    document.body.appendChild(notification);
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
      .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
      }
      .notification-close {
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
        opacity: 0.7;
      }
      .notification-close:hover {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  }
  
  function updatePendingCount(change) {
    const pendingElements = document.querySelectorAll('.stat-number');
    pendingElements.forEach(element => {
      if (element.textContent === '12' || element.closest('.stat-card')?.querySelector('.stat-label')?.textContent === 'Pending Reports') {
        let current = parseInt(element.textContent);
        if (!isNaN(current)) {
          element.textContent = Math.max(0, current + change);
          
          // Also update in admin card
          const adminStats = document.querySelector('.admin-stats .stat:first-child .stat-number');
          if (adminStats) {
            adminStats.textContent = Math.max(0, current + change);
          }
        }
      }
    });
  }
  
  function updateBlockedCount(change) {
    const blockedElements = document.querySelectorAll('.stat-number');
    blockedElements.forEach(element => {
      if (element.textContent === '8' || element.closest('.stat-card')?.querySelector('.stat-label')?.textContent === 'Blocked Users') {
        let current = parseInt(element.textContent);
        if (!isNaN(current)) {
          element.textContent = Math.max(0, current + change);
          
          // Also update in admin card
          const adminStats = document.querySelector('.admin-stats .stat:last-child .stat-number');
          if (adminStats) {
            adminStats.textContent = Math.max(0, current + change);
          }
        }
      }
    });
  }
  
  function checkEmptyState() {
    const reportsTable = document.querySelector('.reports-table tbody');
    if (reportsTable && reportsTable.children.length === 0) {
      reportsTable.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 40px; color: var(--gray);">
            <i class="fas fa-check-circle" style="font-size: 48px; margin-bottom: 16px; display: block;"></i>
            <h3>No pending reports</h3>
            <p>All reports have been reviewed. Great job!</p>
          </td>
        </tr>
      `;
    }
  }
  
  // Initialize table row click for review
  const tableRows = document.querySelectorAll('.reports-table tbody tr');
  tableRows.forEach(row => {
    row.addEventListener('click', function(e) {
      if (!e.target.closest('button') && !e.target.closest('a')) {
        const link = this.querySelector('.recipe-link');
        if (link) {
          console.log('Opening recipe for review:', link.href);
          // window.open(link.href, '_blank'); // Uncomment for new tab
        }
      }
    });
  });
});