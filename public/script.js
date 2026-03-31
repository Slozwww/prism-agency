// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPosition = window.scrollY;
        const progress = (scrollPosition / scrollTotal) * 100;
        scrollProgress.style.width = progress + '%';
    }

    // Scroll to top button
    const scrollTopBtn = document.getElementById('scrollToTop');
    if (scrollTopBtn) {
        if (scrollPosition > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }
});

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Page loader
window.addEventListener('load', () => {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 500);
    }
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handler
const quoteForm = document.getElementById('quoteForm');
const successMessage = document.getElementById('successMessage');

if (quoteForm && successMessage) {
    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(quoteForm);
        const data = {};
        formData.forEach((value, key) => {
            if (key === 'services') {
                if (!data.services) data.services = [];
                data.services.push(value);
            } else {
                data[key] = value;
            }
        });

        // Log form data (in real implementation, send to server)
        console.log('Demande de devis:', data);

        // Show success message
        successMessage.classList.add('show');
        quoteForm.reset();

        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);
    });
}

// Fade-in animation on scroll
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

document.querySelectorAll('.service-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Active navigation link highlighting
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.style.color = 'var(--neon-red)';
    }
});
