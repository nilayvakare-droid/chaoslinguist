/* ============================================
   MAIN.JS - ChaosLinguist
   ============================================ */

// DOM Elements
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');
const menuToggle = document.getElementById('menuToggle');
const navbar = document.getElementById('navbar');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeCountUpAnimations();
    initializeClickOutside();
    setupAccessibility();
});

// ============================================
// NAVIGATION
// ============================================

function initializeNavigation() {
    // Hamburger menu
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Close sidebar
    if (closeSidebar) {
        closeSidebar.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
    }

    // Scroll effect on navbar
    window.addEventListener('scroll', () => {
        if (navbar && window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else if (navbar) {
            navbar.classList.remove('scrolled');
        }
    });

    // Navigation links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && !href.includes('.html')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    if (sidebar) sidebar.classList.remove('open');
                }
            }
        });
    });
}

function toggleMobileMenu() {
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

// ============================================
// SCROLL EFFECTS
// ============================================

function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.stagger-item, .feature-card, .mission-card, .language-card').forEach(el => {
        observer.observe(el);
    });

    // Parallax effect
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        document.querySelectorAll('[data-parallax]').forEach(el => {
            const speed = el.dataset.parallax || 0.5;
            el.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
}

// ============================================
// COUNT UP ANIMATIONS
// ============================================

function initializeCountUpAnimations() {
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUpElement(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-value]').forEach(el => {
        observer.observe(el);
    });
}

function countUpElement(element) {
    const target = parseInt(element.dataset.value);
    const duration = 2000; // ms
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const counter = setInterval(() => {
        step++;
        current = Math.floor(increment * step);
        
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(counter);
        } else {
            element.textContent = formatNumber(current);
        }
    }, duration / steps);
}

function formatNumber(num) {
    return num.toLocaleString();
}

// ============================================
// HOVER EFFECTS
// ============================================

function initializeHoverEffects() {
    // Card glow tracking
    document.querySelectorAll('.glass, .feature-card, .mission-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Scale on hover
    document.querySelectorAll('.scale-up-on-hover').forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.classList.add('scale-up');
        });
        el.addEventListener('mouseleave', () => {
            el.classList.remove('scale-up');
        });
    });
}

// ============================================
// CLICK OUTSIDE
// ============================================

function initializeClickOutside() {
    document.addEventListener('click', (e) => {
        if (sidebar && !sidebar.contains(e.target) && !menuToggle?.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });
}

// ============================================
// FORM HANDLING
// ============================================

function initializeForms() {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    // Validate
    if (!validateForm(data)) {
        return;
    }

    // Show success (in real app, send to server)
    showNotification('Form submitted successfully!', 'success');
    this.reset();
}

function validateForm(data) {
    // Add validation logic here
    return true;
}

// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00ff99' : type === 'error' ? '#ff3366' : '#00ffcc'};
        color: #000;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInLeft 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// MODALS
// ============================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('fade-in');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal on outside click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// ============================================
// LOCAL STORAGE
// ============================================

const storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Storage error:', e);
        }
    },

    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Storage error:', e);
            return null;
        }
    },

    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Storage error:', e);
        }
    },

    clear: () => {
        try {
            localStorage.clear();
        } catch (e) {
            console.error('Storage error:', e);
        }
    }
};

// ============================================
// ACCESSIBILITY
// ============================================

function setupAccessibility() {
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar?.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });

    // Skip to content link
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('main').focus();
        });
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// ANIMATION UTILITIES
// ============================================

function animate(element, keyframes, options = {}) {
    return element.animate(keyframes, {
        duration: options.duration || 300,
        easing: options.easing || 'ease-in-out',
        fill: options.fill || 'forwards',
        ...options
    });
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.ChaosLinguist = {
    showNotification,
    openModal,
    closeModal,
    storage,
    debounce,
    throttle,
    animate,
    formatNumber
};