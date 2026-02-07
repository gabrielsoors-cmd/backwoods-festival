// ===================================
// BACKWOODS FESTIVAL - JAVASCRIPT
// Mobile Menu & Smooth Scroll
// ===================================

// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu when clicking a link
const navLinks = document.querySelectorAll('.nav-menu a');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scroll already handled by CSS scroll-behavior

// ===================================
// COOKIE BANNER
// ===================================

// Check if user has already accepted cookies
if (!localStorage.getItem('cookiesAccepted')) {
    const cookieBanner = document.getElementById('cookie-banner');
    if (cookieBanner) {
        cookieBanner.classList.add('show');
    }
}

// Accept cookies
const acceptButton = document.getElementById('accept-cookies');
if (acceptButton) {
    acceptButton.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        const cookieBanner = document.getElementById('cookie-banner');
        if (cookieBanner) {
            cookieBanner.classList.remove('show');
        }
    });
}