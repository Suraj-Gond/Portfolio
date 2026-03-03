// Smooth scroll, mobile menu, form validation, scroll animations, flash dismiss
document.addEventListener('DOMContentLoaded', function () {

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const id = this.getAttribute('href').slice(1);
            const target = document.getElementById(id);
            if (!target) return;
            const offset = 100; // clear floating nav
            window.scrollTo({
                top: target.offsetTop - offset,
                behavior: 'smooth'
            });
            // Close mobile menu if open
            var menu = document.getElementById('mobile-menu');
            if (menu) menu.classList.add('hidden');
        });
    });

    // Mobile menu toggle
    var menuBtn = document.getElementById('mobile-menu-btn');
    var mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
        });
    }

    // Contact form validation
    var form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            var valid = true;
            ['name', 'email', 'subject', 'message'].forEach(function (field) {
                var el = document.getElementById(field);
                if (!el) return;
                if (!el.value.trim()) {
                    el.style.borderColor = '#ef4444';
                    valid = false;
                } else {
                    el.style.borderColor = '';
                }
            });
            var email = document.getElementById('email');
            if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                email.style.borderColor = '#ef4444';
                valid = false;
            }
            if (!valid) e.preventDefault();
        });
    }

    // Scroll reveal
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
        observer.observe(el);
    });

    // Auto-dismiss flash messages
    document.querySelectorAll('.flash-msg').forEach(function (msg) {
        setTimeout(function () {
            msg.style.transition = 'opacity 0.4s ease';
            msg.style.opacity = '0';
            setTimeout(function () { msg.remove(); }, 400);
        }, 5000);
    });
});
