/**
 * Koku Kitchen - Main JavaScript
 * All interactive functionality for the website
 */

// ============================================
// DOM ELEMENTS
// ============================================
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const header = document.getElementById('header');
const navLinkItems = document.querySelectorAll('.nav-links a');

// ============================================
// MOBILE MENU TOGGLE
// ============================================
/**
 * Toggle mobile navigation menu
 */
function toggleMenu() {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
    
    // Update aria-expanded for accessibility
    const isExpanded = navLinks.classList.contains('active');
    menuToggle.setAttribute('aria-expanded', isExpanded);
    
    // Prevent body scroll when menu is open
    if (isExpanded) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

/**
 * Close mobile navigation menu
 */
function closeMenu() {
    navLinks.classList.remove('active');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

// Event listener for menu toggle button
if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
}

// Close menu when clicking on navigation links
navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            closeMenu();
        }
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        const isClickInsideNav = navLinks.contains(e.target);
        const isClickOnToggle = menuToggle.contains(e.target);
        
        if (!isClickInsideNav && !isClickOnToggle && navLinks.classList.contains('active')) {
            closeMenu();
        }
    }
});

// ============================================
// HEADER SCROLL EFFECT
// ============================================
/**
 * Add scroll effect to header
 */
function handleScroll() {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Throttle scroll event for better performance
let isScrolling = false;
window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            handleScroll();
            isScrolling = false;
        });
        isScrolling = true;
    }
});

// ============================================
// SMOOTH SCROLL
// ============================================
/**
 * Smooth scroll for anchor links
 * (This is backup for browsers that don't support CSS scroll-behavior)
 */
navLinkItems.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Only handle internal links
        if (href.startsWith('#')) {
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calculate offset for fixed header
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ============================================
// ACTIVE NAVIGATION HIGHLIGHT
// ============================================
/**
 * Highlight current section in navigation
 */
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 150; // Offset for better UX
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinkItems.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Update active nav on scroll
window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            updateActiveNav();
        });
    }
});

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================
/**
 * Animate elements when they come into view
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .about-text, .cta-content');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ============================================
// WINDOW RESIZE HANDLER
// ============================================
/**
 * Handle window resize events
 */
let resizeTimer;
window.addEventListener('resize', () => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
        closeMenu();
    }
    
    // Debounce resize events
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        console.log('Window resized');
    }, 250);
});

// ============================================
// PREVENT TRANSITIONS ON PAGE LOAD
// ============================================
/**
 * Prevent CSS transitions from firing on page load
 */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ============================================
// EXTERNAL LINK HANDLER
// ============================================
/**
 * Add visual indicator for external links
 */
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    // Add security attributes if not present
    if (!link.hasAttribute('rel')) {
        link.setAttribute('rel', 'noopener noreferrer');
    }
});

// ============================================
// KEYBOARD NAVIGATION
// ============================================
/**
 * Close mobile menu with Escape key
 */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        closeMenu();
    }
});

// ============================================
// CONSOLE WELCOME MESSAGE
// ============================================
console.log('%cWelcome to Koku Kitchen! 🍱', 'color: #c41e3a; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with ❤️ using best practices', 'color: #666; font-size: 12px;');

// ============================================
// UTILITY FUNCTIONS
// ============================================
/**
 * Get current scroll position
 * @returns {number} Current scroll position
 */
function getScrollPosition() {
    return window.pageYOffset || document.documentElement.scrollTop;
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
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

// ============================================
// PERFORMANCE MONITORING (Development Only)
// ============================================
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
    });
}

// ============================================
// EXPORT FUNCTIONS (if using modules)
// ============================================
// Uncomment if using ES6 modules
// export { toggleMenu, closeMenu, isInViewport, debounce };