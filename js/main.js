/**
 * STACKLY - Main JavaScript File
 * Advanced animations & interactivity with Vanilla JS
 */

// ============================================
// Animation Engine (ASAP-style)
// ============================================
const AnimationEngine = {
  // Intersection Observer for scroll animations
  observeElements() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add stagger delay based on element order
          const delay = Array.from(entry.target.parentElement.children).indexOf(entry.target) * 100;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.fade-in, .slide-left, .slide-right, .scale-in').forEach(el => {
      observer.observe(el);
    });
  },

  // Text reveal animation - character by character
  textReveal() {
    const textElements = document.querySelectorAll('[data-text-reveal]');
    
    textElements.forEach(el => {
      const text = el.textContent;
      el.textContent = '';
      el.classList.add('text-reveal');
      
      // Split into words and characters
      const words = text.split(' ');
      words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block';
        wordSpan.style.whiteSpace = 'nowrap';
        
        for (let char of word) {
          const charSpan = document.createElement('span');
          charSpan.textContent = char;
          charSpan.style.display = 'inline-block';
          charSpan.style.transitionDelay = `${(wordIndex * 0.05 + Array.from(word).indexOf(char) * 0.03)}s`;
          wordSpan.appendChild(charSpan);
        }
        
        el.appendChild(wordSpan);
        
        // Add space between words
        if (wordIndex < words.length - 1) {
          const space = document.createElement('span');
          space.textContent = '\u00A0';
          space.style.display = 'inline-block';
          el.appendChild(space);
        }
      });

      // Trigger animation
      setTimeout(() => {
        el.classList.add('visible');
      }, 300);
    });
  },

  // Typewriter effect
  typewriter() {
    const elements = document.querySelectorAll('[data-typewriter]');
    
    elements.forEach(el => {
      const text = el.getAttribute('data-typewriter') || el.textContent;
      const speed = parseInt(el.getAttribute('data-speed')) || 80;
      el.textContent = '';
      el.style.borderRight = '2px solid var(--primary)';
      el.style.paddingRight = '4px';
      
      let i = 0;
      const type = () => {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed);
        } else {
          // Blinking cursor
          setInterval(() => {
            el.style.borderColor = el.style.borderColor === 'transparent' ? 'var(--primary)' : 'transparent';
          }, 530);
        }
      };
      
      // Start typing when element is visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(type, 500);
            observer.unobserve(el);
          }
        });
      });
      observer.observe(el);
    });
  },

  // Counter animation
  animateCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-counter'));
          const duration = parseInt(entry.target.getAttribute('data-duration')) || 2000;
          const suffix = entry.target.getAttribute('data-suffix') || '';
          const prefix = entry.target.getAttribute('data-prefix') || '';
          
          let start = 0;
          const increment = target / (duration / 16);
          
          const updateCounter = () => {
            start += increment;
            if (start < target) {
              entry.target.textContent = prefix + Math.floor(start).toLocaleString() + suffix;
              requestAnimationFrame(updateCounter);
            } else {
              entry.target.textContent = prefix + target.toLocaleString() + suffix;
            }
          };
          
          updateCounter();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
  },

  // Parallax effect
  parallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      
      parallaxElements.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
        const yPos = -(scrollY * speed);
        el.style.transform = `translateY(${yPos}px)`;
      });
    });
  },

  // Smooth scroll for anchor links
  smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  },

  // Navbar scroll effect
  navbarScroll() {
    const nav = document.querySelector('.main-nav');
    if (!nav) return;
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  },

  // Magnetic button effect
  magneticButtons() {
    const buttons = document.querySelectorAll('[data-magnetic]');
    
    buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  },

  // Ripple effect on buttons
  rippleEffect() {
    document.querySelectorAll('.btn, .ripple').forEach(btn => {
      btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255,255,255,0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s ease-out;
          pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
  },

  // Initialize all animations
  init() {
    this.observeElements();
    this.textReveal();
    this.typewriter();
    this.animateCounters();
    this.parallax();
    this.smoothScroll();
    this.navbarScroll();
    this.magneticButtons();
    this.rippleEffect();
  }
};

// ============================================
// FAQ Accordion
// ============================================
const FAQ = {
  init() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all items
        faqItems.forEach(i => i.classList.remove('active'));
        
        // Open clicked item if it wasn't active
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }
};

// ============================================
// Mobile Menu
// ============================================
const MobileMenu = {
  init() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.overlay');
    
    if (!menuToggle || !mobileMenu) return;

    let closeBtn = mobileMenu.querySelector('.mobile-menu-close');
    if (!closeBtn) {
      closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'mobile-menu-close';
      closeBtn.setAttribute('aria-label', 'Close menu');
      closeBtn.innerHTML = '<i class="fas fa-times"></i>';
      mobileMenu.prepend(closeBtn);
    }

    menuToggle.setAttribute('aria-expanded', 'false');
    
    const open = () => {
      mobileMenu.classList.add('open');
      if (overlay) overlay.classList.add('active');
      menuToggle.classList.add('active');
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.innerHTML = '<i class="fas fa-times"></i>';
      document.body.style.overflow = 'hidden';
    };
    
    const close = () => {
      mobileMenu.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      document.body.style.overflow = '';
    };
    
    menuToggle.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) {
        close();
      } else {
        open();
      }
    });
    closeBtn.addEventListener('click', close);
    if (overlay) overlay.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) close();
    });
    
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', close);
    });
  }
};

// ============================================
// Login Role Selector
// ============================================
const RoleSelector = {
  init() {
    const roleBtns = document.querySelectorAll('.role-btn');
    
    roleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        roleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const role = btn.getAttribute('data-role');
        const form = document.querySelector('.auth-form');
        
        // Update form based on role
        if (form) {
          form.setAttribute('data-current-role', role);
          
          // Update hidden input if exists
          const roleInput = form.querySelector('input[name="role"]');
          if (roleInput) roleInput.value = role;
        }
      });
    });
  }
};

// ============================================
// Password Toggle
// ============================================
const PasswordToggle = {
  init() {
    document.querySelectorAll('.toggle-password').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('input');
        const icon = btn.querySelector('i') || btn;
        
        if (input.type === 'password') {
          input.type = 'text';
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        } else {
          input.type = 'password';
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      });
    });
  }
};

// ============================================
// Form Validation
// ============================================
const FormValidation = {
  init() {
    document.querySelectorAll('form[data-validate]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
          if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = 'var(--danger)';
            
            // Shake animation
            field.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
              field.style.animation = '';
            }, 500);
          } else {
            field.style.borderColor = 'var(--border-light)';
          }
        });
        
        // Email validation
        const emailFields = form.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (field.value && !emailRegex.test(field.value)) {
            isValid = false;
            field.style.borderColor = 'var(--danger)';
          }
        });
        
        // Password match validation
        const password = form.querySelector('input[name="password"]');
        const confirmPassword = form.querySelector('input[name="confirm_password"]');
        if (password && confirmPassword && confirmPassword.value) {
          if (password.value !== confirmPassword.value) {
            isValid = false;
            confirmPassword.style.borderColor = 'var(--danger)';
            alert('Passwords do not match!');
          }
        }
        
        if (isValid) {
          const redirectUrl = form.getAttribute('data-redirect');
          if (redirectUrl) {
            window.location.href = redirectUrl;
            return;
          }

          const firstNameInput = form.querySelector('input[name="firstName"]');
          const emailInput = form.querySelector('input[name="email"], input[type="email"]');
          const storedName = (firstNameInput?.value || '').trim() || (emailInput?.value || '').split('@')[0].trim();

          if (storedName) {
            localStorage.setItem('stacklyProfileName', storedName);
          }

          // Show success
          const submitBtn = form.querySelector('button[type="submit"]');
          const originalText = submitBtn.innerHTML;
          submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
          submitBtn.disabled = true;
          
          setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
            submitBtn.style.background = 'var(--success)';

            const selectedRole = (form.getAttribute('data-current-role') || form.querySelector('input[name="role"]')?.value || '').toLowerCase();

            if (selectedRole === 'student' || selectedRole === 'user') {
              window.location.href = 'dashboardstudent.html';
            } else if (selectedRole === 'admin') {
              window.location.href = 'dashboardadmin.html';
            }
            
            setTimeout(() => {
              submitBtn.innerHTML = originalText;
              submitBtn.disabled = false;
              submitBtn.style.background = '';
              form.reset();
            }, 1500);
          }, 1500);
        }
      });
    });
  }
};

// ============================================
// Profile Name Handling
// ============================================
const ProfileName = {
  getStoredName() {
    const storedName = localStorage.getItem('stacklyProfileName');
    if (storedName && storedName.trim()) {
      return storedName.trim();
    }

    return 'User';
  },

  getInitials(name) {
    const trimmedName = name.trim();
    if (!trimmedName) return 'U';

    const parts = trimmedName.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  },

  apply() {
    const name = this.getStoredName();
    const avatar = document.getElementById('profile-avatar');
    if (avatar) {
      avatar.textContent = this.getInitials(name);
    }

    const nameElements = document.querySelectorAll('#profile-name');
    nameElements.forEach(el => {
      el.textContent = name;
    });

    const welcomeElement = document.getElementById('profile-welcome');
    if (welcomeElement) {
      welcomeElement.textContent = `Welcome back, ${name}!`;
    }
  },

  init() {
    this.apply();
  }
};

// ============================================
// Dashboard Functionality
// ============================================
const Dashboard = {
  init() {
    this.initSidebar();
    this.initCharts();
    this.initNotifications();
    this.animateProgressBars();
  },

  initSidebar() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });

      sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          sidebar.classList.remove('open');
        });
      });
    }
  },

  initCharts() {
    // Simple CSS-based chart animation
    const chartBars = document.querySelectorAll('.chart-bar');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const height = entry.target.getAttribute('data-height') || '70%';
          setTimeout(() => {
            entry.target.style.height = height;
          }, 200);
          observer.unobserve(entry.target);
        }
      });
    });
    
    chartBars.forEach(bar => observer.observe(bar));
  },

  initNotifications() {
    const notifBtn = document.querySelector('.notification-btn');
    
    if (notifBtn) {
      notifBtn.addEventListener('click', () => {
        // Simulate notification dropdown
        alert('Notifications: You have 3 new notifications');
      });
    }
  },

  animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const width = entry.target.getAttribute('data-width') || '0%';
          setTimeout(() => {
            entry.target.style.width = width;
          }, 300);
          observer.unobserve(entry.target);
        }
      });
    });
    
    progressBars.forEach(bar => observer.observe(bar));
  }
};

// ============================================
// Search Functionality
// ============================================
const Search = {
  init() {
    const searchBtn = document.querySelector('.search-btn');
    const searchModal = document.querySelector('.search-modal');
    const searchClose = document.querySelector('.search-close');
    const searchInput = document.querySelector('.search-input');
    
    if (!searchBtn) return;
    
    searchBtn.addEventListener('click', () => {
      if (!searchModal) {
        // Create search modal if not exists
        this.createSearchModal();
      } else {
        searchModal.classList.add('active');
        searchInput.focus();
      }
    });
  },

  createSearchModal() {
    const modal = document.createElement('div');
    modal.className = 'search-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(26, 26, 46, 0.95);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    `;
    
    modal.innerHTML = `
      <div class="search-container" style="width: 90%; max-width: 600px;">
        <input type="text" class="search-input" placeholder="Search courses, topics, or resources..." 
          style="width: 100%; padding: 20px 30px; font-size: 1.3rem; border: none; border-bottom: 2px solid var(--primary);
          background: transparent; color: #fff; outline: none; font-family: var(--font-body);">
        <p style="color: rgba(255,255,255,0.5); margin-top: 16px; text-align: center; font-size: 0.9rem;">
          Press ESC to close
        </p>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    requestAnimationFrame(() => {
      modal.style.opacity = '1';
      modal.style.visibility = 'visible';
      modal.querySelector('.search-input').focus();
    });
    
    // Close on ESC
    const closeModal = () => {
      modal.style.opacity = '0';
      modal.style.visibility = 'hidden';
      setTimeout(() => modal.remove(), 300);
    };
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
};

// ============================================
// Preloader
// ============================================
const Preloader = {
  init() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;
    
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        setTimeout(() => preloader.remove(), 500);
      }, 800);
    });
  }
};

// ============================================
// Testimonials Slider
// ============================================
const Testimonials = {
  init() {
    const slider = document.querySelector('.testimonials-slider');
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    let current = 0;
    
    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.style.display = i === index ? 'block' : 'none';
        slide.classList.toggle('fade-in', i === index);
      });
    };
    
    showSlide(current);
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        current = (current - 1 + slides.length) % slides.length;
        showSlide(current);
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        current = (current + 1) % slides.length;
        showSlide(current);
      });
    }
    
    // Auto slide
    setInterval(() => {
      current = (current + 1) % slides.length;
      showSlide(current);
    }, 5000);
  }
};

// ============================================
// Scroll to Top
// ============================================
const ScrollToTop = {
  init() {
    const btn = document.querySelector('.scroll-top');
    if (!btn) return;
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });
    
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};

// ============================================
// Marquee Animation
// ============================================
const Marquee = {
  init() {
    const marquees = document.querySelectorAll('.marquee');
    
    marquees.forEach(marquee => {
      const content = marquee.querySelector('.marquee-content');
      if (!content) return;
      
      // Clone content for seamless loop
      content.innerHTML += content.innerHTML;
    });
  }
};

// ============================================
// Initialize Everything on DOM Ready
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  AnimationEngine.init();
  FAQ.init();
  MobileMenu.init();
  RoleSelector.init();
  PasswordToggle.init();
  FormValidation.init();
  ProfileName.init();
  Dashboard.init();
  Search.init();
  Preloader.init();
  Testimonials.init();
  ScrollToTop.init();
  Marquee.init();
});

// ============================================
// CSS Keyframes injected via JS
// ============================================
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-10px); }
    40% { transform: translateX(10px); }
    60% { transform: translateX(-10px); }
    80% { transform: translateX(10px); }
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-40px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(40px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  
  .marquee-content {
    display: flex;
    animation: marquee 30s linear infinite;
  }
  
  .scroll-top {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: var(--primary);
    color: #fff;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-md);
  }
  
  .scroll-top.visible {
    opacity: 1;
    visibility: visible;
  }
  
  .scroll-top:hover {
    background: var(--primary-light);
    transform: translateY(-3px);
  }
  
  .preloader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--bg-cream);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.5s ease;
  }
  
  .preloader-spinner {
    width: 60px;
    height: 60px;
    border: 4px solid var(--border-light);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .search-modal.active {
    opacity: 1;
    visibility: visible;
  }
`;
document.head.appendChild(style);
