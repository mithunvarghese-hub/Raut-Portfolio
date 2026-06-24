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
     6. WebGL Orb Background (Hero Section)
     ========================================== */
  const initOrbBackground = () => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.warn('WebGL not supported');
      return;
    }

    const vertSource = `
      precision highp float;
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragSource = `
      precision highp float;

      uniform float iTime;
      uniform vec3 iResolution;
      uniform float hue;
      uniform float hover;
      uniform float rot;
      uniform float hoverIntensity;
      uniform vec3 backgroundColor;
      varying vec2 vUv;

      vec3 rgb2yiq(vec3 c) {
        float y = dot(c, vec3(0.299, 0.587, 0.114));
        float i = dot(c, vec3(0.596, -0.274, -0.322));
        float q = dot(c, vec3(0.211, -0.523, 0.312));
        return vec3(y, i, q);
      }
      
      vec3 yiq2rgb(vec3 c) {
        float r = c.x + 0.956 * c.y + 0.621 * c.z;
        float g = c.x - 0.272 * c.y - 0.647 * c.z;
        float b = c.x - 1.106 * c.y + 1.703 * c.z;
        return vec3(r, g, b);
      }
      
      vec3 adjustHue(vec3 color, float hueDeg) {
        float hueRad = hueDeg * 3.14159265 / 180.0;
        vec3 yiq = rgb2yiq(color);
        float cosA = cos(hueRad);
        float sinA = sin(hueRad);
        float i = yiq.y * cosA - yiq.z * sinA;
        float q = yiq.y * sinA + yiq.z * cosA;
        yiq.y = i;
        yiq.z = q;
        return yiq2rgb(yiq);
      }

      vec3 hash33(vec3 p3) {
        p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
        p3 += dot(p3, p3.yxz + 19.19);
        return -1.0 + 2.0 * fract(vec3(
          p3.x + p3.y,
          p3.x + p3.z,
          p3.y + p3.z
        ) * p3.zyx);
      }

      float snoise3(vec3 p) {
        const float K1 = 0.333333333;
        const float K2 = 0.166666667;
        vec3 i = floor(p + (p.x + p.y + p.z) * K1);
        vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
        vec3 e = step(vec3(0.0), d0 - d0.yzx);
        vec3 i1 = e * (1.0 - e.zxy);
        vec3 i2 = 1.0 - e.zxy * (1.0 - e);
        vec3 d1 = d0 - (i1 - K2);
        vec3 d2 = d0 - (i2 - K1);
        vec3 d3 = d0 - 0.5;
        vec4 h = max(0.6 - vec4(
          dot(d0, d0),
          dot(d1, d1),
          dot(d2, d2),
          dot(d3, d3)
        ), 0.0);
        vec4 n = h * h * h * h * vec4(
          dot(d0, hash33(i)),
          dot(d1, hash33(i + i1)),
          dot(d2, hash33(i + i2)),
          dot(d3, hash33(i + 1.0))
        );
        return dot(vec4(31.316), n);
      }

      vec4 extractAlpha(vec3 colorIn) {
        float a = max(max(colorIn.r, colorIn.g), colorIn.b);
        return vec4(colorIn.rgb / (a + 1e-5), a);
      }

      const vec3 baseColor1 = vec3(0.611765, 0.262745, 0.996078);
      const vec3 baseColor2 = vec3(0.298039, 0.760784, 0.913725);
      const vec3 baseColor3 = vec3(0.062745, 0.078431, 0.600000);
      const float innerRadius = 0.6;
      const float noiseScale = 0.65;

      float light1(float intensity, float attenuation, float dist) {
        return intensity / (1.0 + dist * attenuation);
      }
      float light2(float intensity, float attenuation, float dist) {
        return intensity / (1.0 + dist * dist * attenuation);
      }

      vec4 draw(vec2 uv) {
        vec3 color1 = adjustHue(baseColor1, hue);
        vec3 color2 = adjustHue(baseColor2, hue);
        vec3 color3 = adjustHue(baseColor3, hue);
        
        float ang = atan(uv.y, uv.x);
        float len = length(uv);
        float invLen = len > 0.0 ? 1.0 / len : 0.0;

        float bgLuminance = dot(backgroundColor, vec3(0.299, 0.587, 0.114));
        
        float n0 = snoise3(vec3(uv * noiseScale, iTime * 0.5)) * 0.5 + 0.5;
        float r0 = mix(mix(innerRadius, 1.0, 0.4), mix(innerRadius, 1.0, 0.6), n0);
        float d0 = distance(uv, (r0 * invLen) * uv);
        float v0 = light1(1.0, 10.0, d0);

        v0 *= smoothstep(r0 * 1.05, r0, len);
        float innerFade = smoothstep(r0 * 0.8, r0 * 0.95, len);
        v0 *= mix(innerFade, 1.0, bgLuminance * 0.7);
        float cl = cos(ang + iTime * 2.0) * 0.5 + 0.5;
        
        float a = iTime * -1.0;
        vec2 pos = vec2(cos(a), sin(a)) * r0;
        float d = distance(uv, pos);
        float v1 = light2(1.5, 5.0, d);
        v1 *= light1(1.0, 50.0, d0);
        
        float v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);
        float v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);
        
        vec3 colBase = mix(color1, color2, cl);
        float fadeAmount = mix(1.0, 0.1, bgLuminance);
        
        vec3 darkCol = mix(color3, colBase, v0);
        darkCol = (darkCol + v1) * v2 * v3;
        darkCol = clamp(darkCol, 0.0, 1.0);
        
        vec3 lightCol = (colBase + v1) * mix(1.0, v2 * v3, fadeAmount);
        lightCol = mix(backgroundColor, lightCol, v0);
        lightCol = clamp(lightCol, 0.0, 1.0);
        
        vec3 finalCol = mix(darkCol, lightCol, bgLuminance);
        
        return extractAlpha(finalCol);
      }

      vec4 mainImage(vec2 fragCoord) {
        vec2 center = iResolution.xy * 0.5;
        float size = min(iResolution.x, iResolution.y);
        vec2 uv = (fragCoord - center) / size * 2.0;
        
        float angle = rot;
        float s = sin(angle);
        float c = cos(angle);
        uv = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);
        
        uv.x += hover * hoverIntensity * 0.1 * sin(uv.y * 10.0 + iTime);
        uv.y += hover * hoverIntensity * 0.1 * sin(uv.x * 10.0 + iTime);
        
        return draw(uv);
      }

      void main() {
        vec2 fragCoord = vUv * iResolution.xy;
        vec4 col = mainImage(fragCoord);
        gl_FragColor = vec4(col.rgb * col.a, col.a);
      }
    `;

    const compileShader = (source, type) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = compileShader(vertSource, gl.VERTEX_SHADER);
    const fragShader = compileShader(fragSource, gl.FRAGMENT_SHADER);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const vertices = new Float32Array([
      -1, -1,  0, 0,
       3, -1,  2, 0,
      -1,  3,  0, 2
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    const uvLoc = gl.getAttribLocation(program, 'uv');

    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 16, 0);

    gl.enableVertexAttribArray(uvLoc);
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 16, 8);

    const iTimeLoc = gl.getUniformLocation(program, 'iTime');
    const iResolutionLoc = gl.getUniformLocation(program, 'iResolution');
    const hueLoc = gl.getUniformLocation(program, 'hue');
    const hoverLoc = gl.getUniformLocation(program, 'hover');
    const rotLoc = gl.getUniformLocation(program, 'rot');
    const hoverIntensityLoc = gl.getUniformLocation(program, 'hoverIntensity');
    const backgroundColorLoc = gl.getUniformLocation(program, 'backgroundColor');

    const orbConfig = {
      hue: 330, // matches hot pink perfectly!
      hoverIntensity: 0.5,
      rotateOnHover: true,
      forceHoverState: false
    };

    const getBgColorVector = () => {
      const isLight = document.body.classList.contains('light-mode');
      const hex = isLight ? '#f8fafc' : '#030712';
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      return [r, g, b];
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('resize', resize);
    resize();

    const heroSection = document.getElementById('home');
    let targetHover = 0;
    let currentHover = 0;
    let currentRot = 0;
    let lastTime = 0;
    const rotationSpeed = 0.3;

    if (heroSection) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const size = Math.min(rect.width, rect.height);
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const uvX = ((x - centerX) / size) * 2.0;
        const uvY = ((y - centerY) / size) * 2.0;

        if (Math.sqrt(uvX * uvX + uvY * uvY) < 0.8) {
          targetHover = 1;
        } else {
          targetHover = 0;
        }
      });

      heroSection.addEventListener('mouseleave', () => {
        targetHover = 0;
      });
    }

    let rafId = null;
    const render = (time) => {
      rafId = requestAnimationFrame(render);
      const dt = (time - lastTime) * 0.001;
      lastTime = time;

      gl.uniform3f(iResolutionLoc, canvas.width, canvas.height, canvas.width / canvas.height);
      gl.uniform1f(iTimeLoc, time * 0.001);
      gl.uniform1f(hueLoc, orbConfig.hue);
      gl.uniform1f(hoverIntensityLoc, orbConfig.hoverIntensity);

      const effectiveHover = orbConfig.forceHoverState ? 1 : targetHover;
      currentHover += (effectiveHover - currentHover) * 0.1;
      gl.uniform1f(hoverLoc, currentHover);

      if (orbConfig.rotateOnHover && currentHover > 0.5) {
        currentRot += dt * rotationSpeed;
      }
      gl.uniform1f(rotLoc, currentRot);

      const bgCol = getBgColorVector();
      gl.uniform3f(backgroundColorLoc, bgCol[0], bgCol[1], bgCol[2]);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    rafId = requestAnimationFrame(render);
  };

  initOrbBackground();

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
