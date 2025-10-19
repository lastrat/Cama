// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Initialize all components
    initializeAnimations();
    initializeTooltips();
    initializeModals();
    initializeNotifications();
    initializeCharts();
    initializeTheme();

    // Animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.stats-card, .content-card').forEach(el => {
        observer.observe(el);
    });

    // Live data updates
    startLiveUpdates();

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Auto-refresh data every 30 seconds
    setInterval(refreshData, 30000);
});

// Initialize animations
function initializeAnimations() {
    // Add stagger animation to stats cards
    const cards = document.querySelectorAll('.stats-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });

    // Add hover effects
    document.querySelectorAll('.stats-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Pulse animation for active indicators
    const activeElements = document.querySelectorAll('.stats-trend .text-success');
    activeElements.forEach(el => {
        el.style.animation = 'pulse 2s infinite';
    });
}

// Initialize tooltips
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Initialize modals with custom animations
function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('show.bs.modal', function() {
            const modalDialog = this.querySelector('.modal-dialog');
            modalDialog.style.transform = 'scale(0.7) translateY(-50px)';
            modalDialog.style.opacity = '0';

            setTimeout(() => {
                modalDialog.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
                modalDialog.style.transform = 'scale(1) translateY(0)';
                modalDialog.style.opacity = '1';
            }, 10);
        });

        modal.addEventListener('hide.bs.modal', function() {
            const modalDialog = this.querySelector('.modal-dialog');
            modalDialog.style.transform = 'scale(1) translateY(0)';
            modalDialog.style.opacity = '1';

            setTimeout(() => {
                modalDialog.style.transition = 'all 0.2s ease-out';
                modalDialog.style.transform = 'scale(0.7) translateY(-50px)';
                modalDialog.style.opacity = '0';
            }, 10);
        });
    });
}

// Initialize notifications
function initializeNotifications() {
    // Show welcome notification on first visit
    if (!localStorage.getItem('admin-welcome-shown')) {
        setTimeout(() => {
            showNotification('Bienvenue sur le panneau d\'administration CAMA!', 'success');
            localStorage.setItem('admin-welcome-shown', 'true');
        }, 2000);
    }

    // Periodic notifications for updates
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance every 30 seconds
            showNotification('Nouvelles données disponibles', 'info');
        }
    }, 30000);
}

// Initialize charts (placeholder for statistiques page)
function initializeCharts() {
    // This will be expanded when creating the statistiques page
    console.log('Charts initialized');
}

// Initialize theme
function initializeTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
        document.body.classList.add('dark-theme');
    }

    // Listen for theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (e.matches) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    });
}

// Live data updates
function startLiveUpdates() {
    const statsNumbers = document.querySelectorAll('.stats-number');

    statsNumbers.forEach((element, index) => {
        const updateInterval = setInterval(() => {
            if (Math.random() < 0.2) { // 20% chance every update
                updateStatNumber(element, index);
            }
        }, 5000 + (index * 1000)); // Stagger updates
    });
}

// Update individual stat numbers with animation
function updateStatNumber(element, index) {
    const currentValue = parseInt(element.textContent);
    const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
    const newValue = Math.max(0, currentValue + change);

    if (newValue !== currentValue) {
        element.style.transform = 'scale(1.1)';
        element.style.color = change > 0 ? 'var(--success-color)' : 'var(--danger-color)';

        setTimeout(() => {
            element.textContent = newValue;
            element.style.transform = 'scale(1)';
            element.style.color = '';

            // Update trend indicator
            updateTrendIndicator(element, change);
        }, 200);
    }
}

// Update trend indicators
function updateTrendIndicator(element, change) {
    const card = element.closest('.stats-card');
    const trendElement = card.querySelector('.stats-trend');

    if (change > 0) {
        trendElement.innerHTML = '<i class="bi bi-arrow-up text-success me-1"></i>+1 nouvelle';
    } else if (change < 0) {
        trendElement.innerHTML = '<i class="bi bi-arrow-down text-danger me-1"></i>-1';
    }
}

// Refresh all data
function refreshData() {
    // Simulate data refresh
    const loadingElements = document.querySelectorAll('.stats-card');
    loadingElements.forEach(card => {
        const icon = card.querySelector('.stats-icon');
        if (icon) {
            icon.classList.add('loading-spinner');
            icon.style.animation = 'spin 1s linear infinite';

            setTimeout(() => {
                icon.classList.remove('loading-spinner');
                icon.style.animation = '';
            }, 1000);
        }
    });

    showNotification('Données actualisées', 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="bi bi-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="bi bi-x"></i>
        </button>
    `;

    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    `;

    document.body.appendChild(notification);

    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);

    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}

// Get notification icon based on type
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-triangle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Get notification color based on type
function getNotificationColor(type) {
    const colors = {
        success: 'var(--success-color)',
        error: 'var(--danger-color)',
        warning: 'var(--warning-color)',
        info: 'var(--info-color)'
    };
    return colors[type] || 'var(--primary-color)';
}

// Keyboard shortcuts
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + R for refresh
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        refreshData();
    }

    // Ctrl/Cmd + N for new formation modal
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        const modal = new bootstrap.Modal(document.getElementById('nouvelleFormationModal'));
        modal.show();
    }

    // Escape to close modals
    if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal.show');
        openModals.forEach(modal => {
            bootstrap.Modal.getInstance(modal).hide();
        });
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for use in other scripts
window.AdminDashboard = {
    refreshData,
    showNotification,
    updateStatNumber,
    debounce,
    throttle
};

// Add CSS animations for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.7;
        }
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 0;
        opacity: 0.7;
        transition: opacity 0.2s;
    }

    .notification-close:hover {
        opacity: 1;
    }

    .animate-in {
        animation: slideUp 0.6s ease-out;
    }
`;
document.head.appendChild(notificationStyles);