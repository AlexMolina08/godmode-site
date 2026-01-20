// Godmode Website - Interactive Features & Animations
// Optimized for 60fps spring-based interactions

class GodmodeApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupNavigation();
    this.initScrollAnimations();
    this.initCardInteractions();
    this.handleSmoothScroll();
    this.setupAccessibility();
  }

  // Navigation with Glassmorphism Header
  setupNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');

    // Mobile menu toggle
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
      });

      // Close menu on link click
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          navToggle.classList.remove('active');
          navMenu.classList.remove('active');
          document.body.style.overflow = '';
        });
      });

      // Close menu on outside click
      document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
          navToggle.classList.remove('active');
          navMenu.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }

    // Header scroll effect
    if (header) {
      let ticking = false;

      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            if (window.scrollY > 50) {
              header.classList.add('scrolled');
            } else {
              header.classList.remove('scrolled');
            }
            ticking = false;
          });
          ticking = true;
        }
      });
    }

    this.highlightActivePage();
  }

  highlightActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  // Intersection Observer for scroll animations
  initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach((el, index) => {
      el.style.transitionDelay = `${index * 50}ms`;
      observer.observe(el);
    });
  }

  // Card press interactions (Cupertino style scale)
  initCardInteractions() {
    const interactiveElements = document.querySelectorAll('.card, .btn');

    interactiveElements.forEach(element => {
      // Mouse events
      element.addEventListener('mousedown', () => {
        element.style.transform = 'scale(0.97)';
      });

      element.addEventListener('mouseup', () => {
        element.style.transform = '';
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = '';
      });

      // Touch events for mobile
      element.addEventListener('touchstart', () => {
        element.style.transform = 'scale(0.97)';
      }, { passive: true });

      element.addEventListener('touchend', () => {
        element.style.transform = '';
      }, { passive: true });

      element.addEventListener('touchcancel', () => {
        element.style.transform = '';
      }, { passive: true });
    });
  }

  // Smooth scroll for anchor links
  handleSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const target = document.querySelector(targetId);

        if (target) {
          const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Accessibility enhancements
  setupAccessibility() {
    const interactiveElements = document.querySelectorAll('.card, .btn');

    interactiveElements.forEach(element => {
      if (!element.hasAttribute('tabindex') && element.tagName !== 'A' && element.tagName !== 'BUTTON') {
        element.setAttribute('tabindex', '0');
      }

      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          element.click();
        }
      });
    });

    // Reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--duration-fast', '0.01ms');
      document.documentElement.style.setProperty('--duration-normal', '0.01ms');
      document.documentElement.style.setProperty('--duration-slow', '0.01ms');
    }
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new GodmodeApp();
});