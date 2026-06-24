/* ==========================================================================
   RAUT PREMIUM CORPORATE PORTFOLIO - LOGIC & INTERACTIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  /* ==========================================
     1. Page Loader Splash Screen
     ========================================== */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (loader) {
        loader.classList.add('fade-out');
      }
    }, 400); // Fades out smoothly after 400ms buffer
  });

  // Backup loader hide (in case load event fired early or failed)
  setTimeout(() => {
    if (loader && !loader.classList.contains('fade-out')) {
      loader.classList.add('fade-out');
    }
  }, 3000);

  /* ==========================================
     2. Custom Interactive Cursor
     ========================================== */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');

  if (cursorDot && cursorOutline) {
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    // Track mouse coordinates
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Make cursor visible on first move
      cursorDot.style.opacity = '1';
      cursorOutline.style.opacity = '1';
      
      cursorDot.style.top = `${mouseY}px`;
      cursorDot.style.left = `${mouseX}px`;
    });

    // Smooth cursor outline delay
    const animateCursor = () => {
      const distX = mouseX - outlineX;
      const distY = mouseY - outlineY;
      
      // Lerp logic for smooth tracking
      outlineX += distX * 0.15;
      outlineY += distY * 0.15;
      
      cursorOutline.style.top = `${outlineY}px`;
      cursorOutline.style.left = `${outlineX}px`;
      
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Expand cursor outline on interactive links/buttons
    const hoverables = document.querySelectorAll('a, button, input, select, textarea, .filter-btn, .theme-toggle-btn');
    hoverables.forEach(item => {
      item.addEventListener('mouseenter', () => {
        cursorOutline.classList.add('hovered');
      });
      item.addEventListener('mouseleave', () => {
        cursorOutline.classList.remove('hovered');
      });
    });

    // Hide cursor when mouse leaves the document window
    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorOutline.style.opacity = '0';
    });
  }

  /* ==========================================
     3. Header Sticky & Navigation Highlights
     ========================================== */
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Toggle sticky navbar on scroll
    if (window.scrollY > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }

    // Scroll spy navigation links highlight
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 120)) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  /* ==========================================
     4. Mobile Navigation Hamburger Menu
     ========================================== */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu on click of nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  /* ==========================================
     5. Dark / Light Mode Toggle
     ========================================== */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const body = document.body;

  // Retrieve saved theme preference
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'light') {
    body.classList.add('light-mode');
    updateThemeIcon('sun', 'moon');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('light-mode');
      const isLightMode = body.classList.contains('light-mode');
      
      // Save user preference
      localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
      
      // Update icons and animate
      if (isLightMode) {
        updateThemeIcon('sun', 'moon');
        showToast('Switched to Light Mode', 'success');
      } else {
        updateThemeIcon('moon', 'sun');
        showToast('Switched to Dark Mode', 'success');
      }
    });
  }

  function updateThemeIcon(oldIcon, newIcon) {
    if (themeIcon) {
      themeIcon.setAttribute('data-lucide', newIcon);
      lucide.createIcons();
    }
  }

  /* ==========================================
     6. Particle Canvas Background (Hero Section)
     ========================================== */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const colors = {
      dark: ['rgba(255, 42, 117, 0.4)', 'rgba(56, 189, 248, 0.4)', 'rgba(255, 255, 255, 0.15)'],
      light: ['rgba(224, 30, 90, 0.3)', 'rgba(2, 132, 199, 0.3)', 'rgba(15, 23, 42, 0.08)']
    };

    // Resize canvas dynamically
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    // Particle Object Blueprint
    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        // Bounce off canvas boundaries
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        // Apply motion
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    // Initialize particles array
    const initParticles = () => {
      particlesArray = [];
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 16000);
      const isLight = body.classList.contains('light-mode');
      const palette = isLight ? colors.light : colors.dark;

      for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 3 + 1;
        const x = Math.random() * (canvas.width - size * 2) + size;
        const y = Math.random() * (canvas.height - size * 2) + size;
        const directionX = (Math.random() * 0.4) - 0.2;
        const directionY = (Math.random() * 0.4) - 0.2;
        const color = palette[Math.floor(Math.random() * palette.length)];

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
      }
    };

    // Connect close nodes with thin lines
    const connectNodes = () => {
      const maxDistance = 120;
      const isLight = body.classList.contains('light-mode');
      const lineColor = isLight ? 'rgba(15, 23, 42, 0.04)' : 'rgba(255, 255, 255, 0.04)';

      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    };

    // Animation Loop
    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connectNodes();
      requestAnimationFrame(animateParticles);
    };

    // Listeners
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animateParticles();

    // Re-initialize particles on theme change to update colors
    themeToggle.addEventListener('click', () => {
      setTimeout(initParticles, 100);
    });
  }

  /* ==========================================
     7. Scroll-Triggered Animations (Scroll Reveals)
     ========================================== */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(elem => {
    revealObserver.observe(elem);
  });

  /* ==========================================
     8. Statistics Counters (Incremental count-up)
     ========================================= */
  const statNumbers = document.querySelectorAll('.stat-number, .bar-stat-number');
  const countStats = (elem) => {
    const target = parseInt(elem.getAttribute('data-target'), 10);
    let count = 0;
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // ~60fps
    
    const updateCount = () => {
      count += increment;
      if (count < target) {
        elem.innerText = Math.floor(count);
        requestAnimationFrame(updateCount);
      } else {
        // Attach suffixes appropriately
        if (elem.classList.contains('stat-number') && elem.getAttribute('data-target') === '99') {
          elem.innerText = target + '%';
        } else {
          elem.innerText = target + '+';
        }
      }
    };
    updateCount();
  };

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countStats(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.8
  });

  statNumbers.forEach(number => {
    statsObserver.observe(number);
  });

  /* ==========================================
     9. Portfolio Filtering Logic
     ========================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const portfolioGrid = document.querySelector('.portfolio-grid');

  if (filterBtns.length > 0 && portfolioItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Toggle Active state on buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        const filterValue = e.target.getAttribute('data-filter');

        // Apply grid fade transition
        if (portfolioGrid) portfolioGrid.style.opacity = '0.3';

        setTimeout(() => {
          portfolioItems.forEach(item => {
            const category = item.getAttribute('data-category');
            if (filterValue === 'all' || category === filterValue) {
              item.style.display = 'flex';
            } else {
              item.style.display = 'none';
            }
          });
          if (portfolioGrid) portfolioGrid.style.opacity = '1';
        }, 250);
      });
    });
  }

  /* ==========================================
     10. Client Testimonials Carousel
     ========================================== */
  const track = document.getElementById('testimonial-track');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const dotsContainer = document.getElementById('carousel-dots');
  
  if (track) {
    const slides = Array.from(track.children);
    let currentIndex = 0;
    let autoSlideInterval;

    // Create Navigation Dots
    slides.forEach((_, idx) => {
      const dot = document.createElement('span');
      dot.classList.add('carousel-dot');
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToSlide(idx);
        resetAutoPlay();
      });
      dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    const updateSlider = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      // Update dots
      dots.forEach((dot, idx) => {
        dot.classList.remove('active');
        if (idx === currentIndex) dot.classList.add('active');
      });
    };

    const goToSlide = (idx) => {
      currentIndex = idx;
      updateSlider();
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlider();
    };

    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlider();
    };

    // Navigation triggers
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
      });
    }

    // Auto Play loop
    const startAutoPlay = () => {
      autoSlideInterval = setInterval(nextSlide, 6000);
    };

    const resetAutoPlay = () => {
      clearInterval(autoSlideInterval);
      startAutoPlay();
    };

    startAutoPlay();
  }

  /* ==========================================
     11. Contact Form & Newsletter Validation + Toast Alert
     ========================================== */
  const contactForm = document.getElementById('contact-form');
  const newsletterForm = document.getElementById('newsletter-form');
  const toastContainer = document.getElementById('toast-container');

  // Helper to trigger floating toast message alerts
  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 'alert-circle';
    toast.innerHTML = `
      <i data-lucide="${icon}"></i>
      <span class="toast-text">${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    lucide.createIcons();

    // Trigger visual reveal transition
    setTimeout(() => {
      toast.classList.add('show');
    }, 50);

    // Fade out and remove toast after 4 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 4000);
  };

  // Contact Form Submission Handler
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get values for basic checks
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const service = document.getElementById('service').value;
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !service || !message) {
        showToast('Please fill out all required fields.', 'error');
        return;
      }

      // Email formatting check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
      }

      // Mock Successful API Response
      showToast('Thank you! Inquiry submitted successfully.', 'success');
      contactForm.reset();
    });
  }

  // Newsletter Form Submission Handler
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('.newsletter-input');
      const email = emailInput.value.trim();

      if (!email) {
        showToast('Please enter your email.', 'error');
        return;
      }

      // Format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
      }

      showToast('Subscribed! Thank you for joining.', 'success');
      newsletterForm.reset();
    });
  }

  /* ==========================================
     REACT BITS LOGOLOOP VANILLA JS IMPLEMENTATION
     ========================================== */
  const initLogoLoop = () => {
    const container = document.getElementById('technologies-loop');
    if (!container) return;

    const techLogos = [
      { icon: 'atom', title: "React", href: "https://react.dev" },
      { icon: 'layers', title: "Next.js", href: "https://nextjs.org" },
      { icon: 'shield', title: "Angular", href: "https://angular.dev" },
      { icon: 'server', title: "Node.js", href: "https://nodejs.org" },
      { icon: 'terminal', title: "Python", href: "https://www.python.org" },
      { icon: 'coffee', title: "Java", href: "https://www.java.com" },
      { icon: 'cloud-lightning', title: "AWS", href: "https://aws.amazon.com" },
      { icon: 'cloud-hail', title: "Azure", href: "https://azure.microsoft.com" },
      { icon: 'package-open', title: "Docker", href: "https://www.docker.com" },
      { icon: 'network', title: "Kubernetes", href: "https://kubernetes.io" },
      { icon: 'binary', title: "PostgreSQL", href: "https://www.postgresql.org" },
      { icon: 'folder-git-2', title: "MongoDB", href: "https://www.mongodb.com" }
    ];

    const config = {
      speed: 120,
      direction: 'left',
      logoHeight: 48,
      gap: 40,
      hoverSpeed: 0, // stops on hover
      scaleOnHover: true,
      fadeOut: true,
      ariaLabel: "Technology partners"
    };

    container.className = `logoloop ${config.fadeOut ? 'logoloop--fade' : ''} ${config.scaleOnHover ? 'logoloop--scale-hover' : ''}`;
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', config.ariaLabel);

    container.style.setProperty('--logoloop-gap', `${config.gap}px`);
    container.style.setProperty('--logoloop-logoHeight', `${config.logoHeight}px`);

    const track = document.createElement('div');
    track.className = 'logoloop__track';
    container.appendChild(track);

    const renderList = (copyIndex) => {
      const ul = document.createElement('ul');
      ul.className = 'logoloop__list';
      ul.setAttribute('role', 'list');
      if (copyIndex > 0) ul.setAttribute('aria-hidden', 'true');

      techLogos.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'logoloop__item';
        li.setAttribute('role', 'listitem');

        const a = document.createElement('a');
        a.className = 'logoloop__link';
        a.href = item.href;
        a.target = '_blank';
        a.rel = 'noreferrer noopener';
        a.setAttribute('aria-label', item.title);

        const span = document.createElement('span');
        span.className = 'logoloop__node';
        
        const i = document.createElement('i');
        i.setAttribute('data-lucide', item.icon);
        i.className = 'tech-icon';
        
        span.appendChild(i);
        
        const textSpan = document.createElement('span');
        textSpan.style.cssText = 'font-size: 0.95rem; font-weight: 600; margin-left: 0.75rem; color: var(--text-secondary); transition: color var(--transition-fast);';
        textSpan.className = 'tech-title-text';
        textSpan.innerText = item.title;
        span.appendChild(textSpan);

        a.appendChild(span);
        li.appendChild(a);
        ul.appendChild(li);
      });

      return ul;
    };

    const initialList = renderList(0);
    track.appendChild(initialList);
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    let seqWidth = 0;

    const updateCopiesAndDimensions = () => {
      const containerWidth = container.clientWidth;
      seqWidth = Math.ceil(initialList.getBoundingClientRect().width);
      
      if (seqWidth > 0) {
        const copiesNeeded = Math.ceil(containerWidth / seqWidth) + 2;
        const currentCopies = track.querySelectorAll('.logoloop__list').length;
        
        if (copiesNeeded > currentCopies) {
          for (let i = currentCopies; i < copiesNeeded; i++) {
            const listCopy = renderList(i);
            track.appendChild(listCopy);
          }
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
        }
      }
    };

    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(() => {
        updateCopiesAndDimensions();
      });
      resizeObserver.observe(container);
    } else {
      window.addEventListener('resize', updateCopiesAndDimensions);
    }
    
    setTimeout(updateCopiesAndDimensions, 100);

    // Easing variables
    let isHovered = false;
    let offset = 0;
    let velocity = 0;
    let lastTimestamp = null;
    const targetVelocity = config.speed;

    track.addEventListener('mouseenter', () => {
      isHovered = true;
    });
    track.addEventListener('mouseleave', () => {
      isHovered = false;
    });

    const animate = (timestamp) => {
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      }
      const deltaTime = Math.max(0, timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      const target = isHovered && config.hoverSpeed !== undefined ? config.hoverSpeed : targetVelocity;
      const easingFactor = 1 - Math.exp(-deltaTime / 0.25);
      velocity += (target - velocity) * easingFactor;

      if (seqWidth > 0) {
        offset = offset + velocity * deltaTime;
        offset = ((offset % seqWidth) + seqWidth) % seqWidth;
        track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    // Make cursor expand hover state on dynamic nodes
    setTimeout(() => {
      const cursorOutline = document.getElementById('cursor-outline');
      if (cursorOutline) {
        const dynamicHoverables = track.querySelectorAll('a, .logoloop__link');
        dynamicHoverables.forEach(item => {
          item.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('hovered');
          });
          item.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('hovered');
          });
        });
      }
    }, 500);
  };

  // Trigger logo loop
  initLogoLoop();

});
