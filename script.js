// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navMenu = document.getElementById('nav-menu');
const bookingWidget = document.getElementById('booking-widget');

// ===== Navbar Scroll Effect =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Show/hide booking widget on scroll
    if (window.scrollY > 600) {
        bookingWidget.style.position = 'fixed';
        bookingWidget.style.top = '80px';
        bookingWidget.style.left = '50%';
        bookingWidget.style.transform = 'translateX(-50%)';
        bookingWidget.style.width = '90%';
        bookingWidget.style.maxWidth = '1200px';
        bookingWidget.style.zIndex = '999';
    } else {
        bookingWidget.style.position = 'relative';
        bookingWidget.style.top = 'auto';
        bookingWidget.style.left = 'auto';
        bookingWidget.style.transform = 'none';
        bookingWidget.style.width = '100%';
        bookingWidget.style.maxWidth = 'none';
    }
});

// ===== Mobile Menu Toggle =====
mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    });
});

// ===== Hero Slider =====
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;
let slideInterval;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        indicators[i].classList.remove('active');
    });
    
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
    currentSlide = index;
}

function nextSlide() {
    const next = (currentSlide + 1) % totalSlides;
    showSlide(next);
}

function prevSlide() {
    const prev = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(prev);
}

function goToSlide(index) {
    showSlide(index);
    resetSlideInterval();
}

function startSlideInterval() {
    slideInterval = setInterval(nextSlide, 5000);
}

function resetSlideInterval() {
    clearInterval(slideInterval);
    startSlideInterval();
}

// Initialize slider
if (slides.length > 0) {
    startSlideInterval();
}

// ===== Smooth Scroll to Sections =====
function scrollToBooking() {
    bookingWidget.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function scrollToRooms() {
    document.getElementById('rooms').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function scrollToAbout() {
    document.querySelector('.welcome-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== Booking Form Handler =====
function handleBooking(event) {
    event.preventDefault();
    
    const checkIn = document.getElementById('check-in').value;
    const checkOut = document.getElementById('check-out').value;
    const guests = document.getElementById('guests').value;
    const rooms = document.getElementById('rooms').value;
    const promoCode = document.getElementById('promo-code').value;
    
    if (!checkIn || !checkOut || !guests || !rooms) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Create booking data object
    const bookingData = {
        checkIn,
        checkOut,
        guests,
        rooms,
        promoCode
    };
    
    console.log('Booking Request:', bookingData);
    
    // Show success message
    alert(`Thank you! Searching availability for:\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nGuests: ${guests}\nRooms: ${rooms}`);
    
    // In a real application, you would send this to a backend API
    // fetch('/api/availability', { method: 'POST', body: JSON.stringify(bookingData) })
}

// ===== Newsletter Form Handler =====
function handleNewsletter(event) {
    event.preventDefault();
    
    const email = event.target.querySelector('input[type="email"]').value;
    
    console.log('Newsletter Subscription:', email);
    alert(`Thank you for subscribing! We'll send exclusive offers to ${email}`);
    
    event.target.reset();
}

// ===== Testimonials Carousel =====
let currentTestimonial = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialDots = document.querySelectorAll('.testimonial-dot');
const totalTestimonials = testimonialCards.length;

function showTestimonial(index) {
    testimonialCards.forEach((card, i) => {
        card.classList.remove('active');
        testimonialDots[i].classList.remove('active');
    });
    
    testimonialCards[index].classList.add('active');
    testimonialDots[index].classList.add('active');
    currentTestimonial = index;
}

// Auto-rotate testimonials
setInterval(() => {
    const next = (currentTestimonial + 1) % totalTestimonials;
    showTestimonial(next);
}, 6000);

// ===== Active Navigation Link on Scroll =====
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
    const scrollPosition = window.scrollY + 200;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ===== Room Gallery Thumbnail Click =====
document.querySelectorAll('.thumbnail').forEach(thumbnail => {
    thumbnail.addEventListener('click', function() {
        const roomCard = this.closest('.room-card');
        const mainImage = roomCard.querySelector('.main-image img');
        const newSrc = this.querySelector('img').src.replace('w=200&h=150', 'w=900&h=600');
        
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.src = newSrc;
            mainImage.style.opacity = '1';
        }, 200);
    });
});

// ===== Animate Elements on Scroll =====
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.room-card, .experience-card, .meeting-space-card, .attraction-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Set initial state for animation
document.querySelectorAll('.room-card, .experience-card, .meeting-space-card, .attraction-item').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

window.addEventListener('scroll', animateOnScroll);
animateOnScroll(); // Check on page load

// ===== Counter Animation for Stats =====
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// ===== Parallax Effect for Hero =====
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

// ===== Button Hover Effects =====
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mouseenter', function(e) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255,255,255,0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            left: ${x}px;
            top: ${y}px;
            width: 100px;
            height: 100px;
            margin-left: -50px;
            margin-top: -50px;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== Date Picker Minimum Date Setup =====
const today = new Date().toISOString().split('T')[0];
document.getElementById('check-in').setAttribute('min', today);
document.getElementById('check-out').setAttribute('min', today);

// Update checkout min date when checkin changes
document.getElementById('check-in').addEventListener('change', function() {
    document.getElementById('check-out').setAttribute('min', this.value);
});

// ===== Preload Images =====
function preloadImages(urls) {
    urls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Preload critical images
preloadImages([
    'https://images.unsplash.com/photo-1571896349842-6e53ce41e8f2?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920&h=1080&fit=crop'
]);

// ===== Console Welcome Message =====
console.log('%c🏨 Welcome to Courtyard San Antonio North Stone Oak!', 'font-size: 20px; font-weight: bold; color: #c9a227;');
console.log('%cBuilt with modern web technologies for an exceptional user experience.', 'font-size: 14px; color: #1a365d;');

// ===== Page Load Animation =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero content on load
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
});

// Add loaded styles
const loadStyle = document.createElement('style');
loadStyle.textContent = `
    body.loaded {
        overflow-x: hidden;
    }
`;
document.head.appendChild(loadStyle);

// ===== Intersection Observer for Lazy Loading =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '50px'
};

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        }
    });
}, observerOptions);

// Observe all images with data-src attribute
document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// ===== Form Validation Enhancement =====
const formInputs = document.querySelectorAll('.booking-field input, .booking-field select');

formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});

// ===== Accessibility Improvements =====
// Add keyboard navigation for carousel
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    }
});

// ===== Performance Optimization =====
// Debounce scroll events
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

// Use debounced scroll handler
const debouncedScrollHandler = debounce(() => {
    updateActiveNav();
    animateOnScroll();
}, 10);

window.removeEventListener('scroll', updateActiveNav);
window.removeEventListener('scroll', animateOnScroll);
window.addEventListener('scroll', debouncedScrollHandler);

// ===== Initialize All Functions =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ All scripts loaded successfully');
    
    // Any additional initialization can go here
});
