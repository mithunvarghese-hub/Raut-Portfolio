import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles, ArrowRight, ChevronRight, ChevronLeft, Target, Eye, Heart, Award,
  ShieldCheck, Globe, Code, Database, Smartphone, Palette, Cloud, Shuffle,
  Infinity as InfinityIcon, Cpu, ShoppingBag, Users, HeartPulse, GraduationCap,
  Factory, Store, LineChart, Truck, Landmark, Rocket, Users2, Lightbulb,
  Clock, HelpCircle, Maximize, ShieldAlert, PiggyBank, Globe2, Linkedin,
  Twitter, Github, Dribbble, Star, Atom, Layers, Shield, Server, Terminal,
  Coffee, CloudLightning, CloudHail, PackageOpen, Network, Binary, FolderGit2,
  Send, MapPin, Mail, Phone, Clock4, Youtube, Sun, Moon, CheckCircle, AlertCircle
} from 'lucide-react';
import OrbBackground from './components/OrbBackground';
import LogoLoop from './components/LogoLoop';
import Lanyard from './components/Lanyard';

export default function App() {
  // --- States ---
  const [loading, setLoading] = useState(true);
  const [lightMode, setLightMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stickyHeader, setStickyHeader] = useState(false);
  const [activeNavLink, setActiveNavLink] = useState('home');
  const [toasts, setToasts] = useState([]);
  
  // Testimonial Carousel State
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  
  // Portfolio Filtering State
  const [portfolioFilter, setPortfolioFilter] = useState('all');
  const [portfolioFade, setPortfolioFade] = useState(false);

  // References
  const cursorDotRef = useRef(null);
  const cursorOutlineRef = useRef(null);
  const mouseCoords = useRef({ x: 0, y: 0 });
  const outlineCoords = useRef({ x: 0, y: 0 });
  const statsSectionRef = useRef(null);
  const heroStatsRef = useRef(null);
  const countedRef = useRef(false);
  const countedHeroRef = useRef(false);

  // --- Initial Mount & Themes ---
  useEffect(() => {
    // Hide splash pre-loader smoothly
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    // Retrieve saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setLightMode(true);
      document.body.classList.add('light-mode');
    }

    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    setLightMode(prev => {
      const next = !prev;
      if (next) {
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
        showToast('Switched to Light Mode', 'success');
      } else {
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
        showToast('Switched to Dark Mode', 'success');
      }
      return next;
    });
  };

  // --- Custom Cursor Logic ---
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseCoords.current = { x: e.clientX, y: e.clientY };
      if (cursorDotRef.current && cursorOutlineRef.current) {
        cursorDotRef.current.style.opacity = '1';
        cursorOutlineRef.current.style.opacity = '1';
        cursorDotRef.current.style.transform = `translate(-50%, -50%) translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const handleMouseLeave = () => {
      if (cursorDotRef.current && cursorOutlineRef.current) {
        cursorDotRef.current.style.opacity = '0';
        cursorOutlineRef.current.style.opacity = '0';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Lerp update loop for smooth outline delay
    let animationFrameId;
    const updateOutline = () => {
      const targetX = mouseCoords.current.x;
      const targetY = mouseCoords.current.y;
      const currentX = outlineCoords.current.x;
      const currentY = outlineCoords.current.y;

      const nextX = currentX + (targetX - currentX) * 0.15;
      const nextY = currentY + (targetY - currentY) * 0.15;

      outlineCoords.current = { x: nextX, y: nextY };
      if (cursorOutlineRef.current) {
        cursorOutlineRef.current.style.transform = `translate(-50%, -50%) translate3d(${nextX}px, ${nextY}px, 0)`;
      }
      animationFrameId = requestAnimationFrame(updateOutline);
    };
    updateOutline();

    // Hover listeners to expand cursor
    const handleMouseEnterInteractive = () => {
      if (cursorOutlineRef.current) cursorOutlineRef.current.classList.add('hovered');
    };
    const handleMouseLeaveInteractive = () => {
      if (cursorOutlineRef.current) cursorOutlineRef.current.classList.remove('hovered');
    };

    const attachCursorHoverListeners = () => {
      const interactives = document.querySelectorAll('a, button, input, select, textarea, .filter-btn, .theme-toggle-btn');
      interactives.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnterInteractive);
        el.addEventListener('mouseleave', handleMouseLeaveInteractive);
      });
    };

    // Attach listeners and run observer for dynamic nodes
    attachCursorHoverListeners();
    const observer = new MutationObserver(attachCursorHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  // --- Scroll Spy & Sticky Header ---
  useEffect(() => {
    const handleScroll = () => {
      // Sticky header logic
      if (window.scrollY > 50) {
        setStickyHeader(true);
      } else {
        setStickyHeader(false);
      }

      // Scroll spy active tab highlights
      const sections = document.querySelectorAll('section');
      let activeSection = 'home';
      sections.forEach(sec => {
        const top = sec.offsetTop;
        if (window.scrollY >= (top - 120)) {
          activeSection = sec.getAttribute('id');
        }
      });
      setActiveNavLink(activeSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Scroll Reveal Animations ---
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  // --- Numbers Count Up Animations ---
  const countStats = useCallback((el, target) => {
    let current = 0;
    const duration = 2000;
    const stepTime = 16; // ~60fps
    const increment = target / (duration / stepTime);

    const runCount = () => {
      current += increment;
      if (current < target) {
        el.innerText = Math.floor(current);
        requestAnimationFrame(runCount);
      } else {
        el.innerText = target + (target === 99 ? '%' : '+');
      }
    };
    runCount();
  }, []);

  useEffect(() => {
    // Hero Section stats counter observer
    const heroStatsEl = heroStatsRef.current;
    if (heroStatsEl) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !countedHeroRef.current) {
            countedHeroRef.current = true;
            const numbers = heroStatsEl.querySelectorAll('.stat-number');
            numbers.forEach(num => {
              const target = parseInt(num.getAttribute('data-target'), 10);
              countStats(num, target);
            });
            observer.unobserve(heroStatsEl);
          }
        });
      }, { threshold: 0.5 });
      observer.observe(heroStatsEl);
      return () => observer.disconnect();
    }
  }, [loading, countStats]);

  useEffect(() => {
    // Stats bar section counter observer
    const statsBarEl = statsSectionRef.current;
    if (statsBarEl) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !countedRef.current) {
            countedRef.current = true;
            const numbers = statsBarEl.querySelectorAll('.bar-stat-number');
            numbers.forEach(num => {
              const target = parseInt(num.getAttribute('data-target'), 10);
              countStats(num, target);
            });
            observer.unobserve(statsBarEl);
          }
        });
      }, { threshold: 0.5 });
      observer.observe(statsBarEl);
      return () => observer.disconnect();
    }
  }, [loading, countStats]);

  // --- Testimonials Slider autoplay ---
  useEffect(() => {
    const slideCount = 3;
    const interval = setInterval(() => {
      setTestimonialIndex(prev => (prev + 1) % slideCount);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // --- Toast Notifications Manager ---
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove toast after 4s
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // --- Form Handlers ---
  const handleContactSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = data.get('name')?.trim();
    const email = data.get('email')?.trim();
    const service = data.get('service');
    const message = data.get('message')?.trim();

    if (!name || !email || !service || !message) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    showToast('Thank you! Inquiry submitted successfully.', 'success');
    e.target.reset();
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input')?.value.trim();

    if (!email) {
      showToast('Please enter your email.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    showToast('Subscribed! Thank you for joining.', 'success');
    e.target.reset();
  };

  // --- Portfolio Filter handling ---
  const handleFilterClick = (filterValue) => {
    setPortfolioFilter(filterValue);
    setPortfolioFade(true);
    setTimeout(() => {
      setPortfolioFade(false);
    }, 250);
  };

  return (
    <>
      {/* ==========================================
           1. Splash Loading Screen
           ========================================== */}
      <div id="loader" className={loading ? '' : 'fade-out'}>
        <div className="loader-logo-wrap">
          <div className="loader-logo">
            <svg className="brand-logo-svg loader-logo-svg" viewBox="0 0 132 37" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 0 0 H 16 C 24 0 28 4 28 11 C 28 16 25 20 19 21.5 L 29 35 H 19 L 10.5 23 H 8.5 V 35 H 0 V 0 Z M 8.5 7 V 16 H 15 C 18.5 16 20 14.5 20 11.5 C 20 8.5 18.5 7 15 7 H 8.5 Z" fill="currentColor"/>
              <path d="M 34 35 L 45 0 H 53 L 64 35 H 55.5 L 49 14 L 42.5 35 H 34 Z" fill="currentColor"/>
              <path d="M 70 0 H 78.5 V 23.5 C 78.5 28.5 81.5 30 84.5 30 C 87.5 30 90.5 28.5 90.5 23.5 V 0 H 99 V 23.5 C 99 32 93 36.5 84.5 36.5 C 76 36.5 70 32 70 23.5 V 0 Z" fill="currentColor"/>
              <path d="M 104 0 H 132 V 7.5 H 122.5 V 35 H 113.5 V 7.5 H 104 V 0 Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
        <div className="loader-ring"></div>
      </div>

      {/* ==========================================
           Interactive Custom Cursor
           ========================================== */}
      <div className="custom-cursor-dot" ref={cursorDotRef} id="cursor-dot"></div>
      <div className="custom-cursor-outline" ref={cursorOutlineRef} id="cursor-outline"></div>

      {/* ==========================================
           Header / Navigation Bar
           ========================================== */}
      <header className={`header glass-panel ${stickyHeader ? 'sticky' : ''}`} id="header">
        <a href="#home" className="logo" aria-label="RAUT Home">
          <svg className="brand-logo-svg" viewBox="0 0 132 37" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 0 0 H 16 C 24 0 28 4 28 11 C 28 16 25 20 19 21.5 L 29 35 H 19 L 10.5 23 H 8.5 V 35 H 0 V 0 Z M 8.5 7 V 16 H 15 C 18.5 16 20 14.5 20 11.5 C 20 8.5 18.5 7 15 7 H 8.5 Z" fill="currentColor"/>
            <path d="M 34 35 L 45 0 H 53 L 64 35 H 55.5 L 49 14 L 42.5 35 H 34 Z" fill="currentColor"/>
            <path d="M 70 0 H 78.5 V 23.5 C 78.5 28.5 81.5 30 84.5 30 C 87.5 30 90.5 28.5 90.5 23.5 V 0 H 99 V 23.5 C 99 32 93 36.5 84.5 36.5 C 76 36.5 70 32 70 23.5 V 0 Z" fill="currentColor"/>
            <path d="M 104 0 H 132 V 7.5 H 122.5 V 35 H 113.5 V 7.5 H 104 V 0 Z" fill="currentColor"/>
          </svg>
        </a>
        
        <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`} id="nav-menu">
          <li><a href="#home" onClick={() => setMobileMenuOpen(false)} className={`nav-link ${activeNavLink === 'home' ? 'active' : ''}`}>Home</a></li>
          <li><a href="#about" onClick={() => setMobileMenuOpen(false)} className={`nav-link ${activeNavLink === 'about' ? 'active' : ''}`}>About</a></li>
          <li><a href="#services" onClick={() => setMobileMenuOpen(false)} className={`nav-link ${activeNavLink === 'services' ? 'active' : ''}`}>Services</a></li>
          <li><a href="#portfolio" onClick={() => setMobileMenuOpen(false)} className={`nav-link ${activeNavLink === 'portfolio' ? 'active' : ''}`}>Portfolio</a></li>
          <li><a href="#why-choose" onClick={() => setMobileMenuOpen(false)} className={`nav-link ${activeNavLink === 'why-choose' ? 'active' : ''}`}>Why Us</a></li>
          <li><a href="#team" onClick={() => setMobileMenuOpen(false)} className={`nav-link ${activeNavLink === 'team' ? 'active' : ''}`}>Team</a></li>
          <li><a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className={`nav-link ${activeNavLink === 'testimonials' ? 'active' : ''}`}>Testimonials</a></li>
          <li><a href="#contact" onClick={() => setMobileMenuOpen(false)} className={`nav-link ${activeNavLink === 'contact' ? 'active' : ''}`}>Contact</a></li>
        </ul>

        <div class="header-actions">
          <button className="theme-toggle-btn" id="theme-toggle" onClick={toggleTheme} aria-label="Toggle Dark/Light Mode">
            {lightMode ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <a href="#contact" className="btn btn-primary header-cta" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>Let's Talk</a>
          <div className={`hamburger ${mobileMenuOpen ? 'active' : ''}`} onClick={() => setMobileMenuOpen(p => !p)} id="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </header>

      {/* ==========================================
           2. Hero Section & WebGL Orb Background
           ========================================== */}
      <section className="hero-section" id="home">
        {/* React WebGL Orb Background component */}
        <OrbBackground hue={330} hoverIntensity={0.5} />
        
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>

        <div className="hero-grid">
          
          {/* Hero text */}
          <div className="hero-content-block reveal reveal-slide-left active">
            <div className="hero-tagline">
              <Sparkles size={14} style={{ marginRight: '0.5rem' }} /> Transforming Ideas Into Digital Excellence
            </div>
            <h1 className="hero-title-responsive">
              Building Innovative Solutions<br />for <span className="text-gradient">Modern Businesses</span>
            </h1>
            <p className="hero-desc-responsive">
              We deliver enterprise-grade software engineering, cloud architecture, and digital transformation solutions that scale with your growth.
            </p>
            
            <div className="hero-ctas-responsive">
              <a href="#services" className="btn btn-primary">Get Started <ArrowRight size={16} /></a>
              <a href="#contact" className="btn btn-secondary">Contact Us</a>
            </div>

            <div className="hero-stats-responsive reveal reveal-slide-up delay-200" ref={heroStatsRef}>
              <div className="stat-item-responsive first">
                <div className="stat-number" data-target="500">0</div>
                <div className="stat-label">Projects Delivered</div>
              </div>
              <div className="stat-item-responsive">
                <div className="stat-number" data-target="150">0</div>
                <div className="stat-label">Global Clients</div>
              </div>
              <div className="stat-item-responsive">
                <div className="stat-number" data-target="10">0</div>
                <div className="stat-label">Years Experience</div>
              </div>
              <div className="stat-item-responsive">
                <div className="stat-number" data-target="99">0</div>
                <div className="stat-label">Satisfaction Rate</div>
              </div>
            </div>
          </div>

          {/* 3D Lanyard canvas block in the center-right of the hero section */}
          <div className="hero-lanyard-wrapper reveal reveal-scale delay-200">
            <Lanyard />
          </div>
        </div>
      </section>

      {/* ==========================================
           3. About Us Section
           ========================================== */}
      <section className="section-container" id="about">
        <div className="section-title-wrap reveal reveal-fade">
          <span className="section-badge">Who We Are</span>
          <h2 className="section-title">Empowering Growth through Innovation</h2>
          <p className="section-subtitle">A journey of digital excellence, engineering robust platforms and designing immersive user experiences.</p>
        </div>

        <div className="about-grid">
          <div className="about-content reveal reveal-slide-left">
            <h3>We build technical foundations for next-generation enterprises.</h3>
            <p className="about-desc">
              Founded on principles of engineering excellence and customer transparency, RAUT partners with companies ranging from ambitious startups to Fortune 500 giants. We combine cutting-edge technology stacks with expert business strategy to bring robust digital products to market.
            </p>
            
            <div className="about-core-pillars">
              <div className="pillar-card glass-card">
                <div className="pillar-icon-box"><Target size={24} /></div>
                <h4>Our Mission</h4>
                <p>Accelerating technology adoption to drive business value.</p>
              </div>
              <div className="pillar-card glass-card">
                <div className="pillar-icon-box"><Eye size={24} /></div>
                <h4>Our Vision</h4>
                <p>To be the global benchmark for enterprise cloud and engineering solutions.</p>
              </div>
              <div className="pillar-card glass-card">
                <div className="pillar-icon-box"><Heart size={24} /></div>
                <h4>Our Values</h4>
                <p>Transparency, performance excellence, and architectural integrity.</p>
              </div>
            </div>

            <div className="about-timeline-wrap">
              <h4>Our Growth Journey</h4>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <span className="timeline-year">2016</span>
                  <div className="timeline-title">The Foundation</div>
                  <p className="timeline-desc">RAUT was launched with a core team of 5 engineers focused on web frameworks.</p>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <span class="timeline-year">2019</span>
                  <div className="timeline-title">Enterprise Scaling</div>
                  <p className="timeline-desc">Expanded services to Cloud Architecture, ERP integrations, and global clients.</p>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <span class="timeline-year">2023</span>
                  <div className="timeline-title">AI & Automation</div>
                  <p class="timeline-desc">Integrated advanced AI models and DevOps orchestration tools into our core suite.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-achievements reveal reveal-slide-right">
            <div className="achievement-card glass-card">
              <div className="achievement-icon"><Award size={28} /></div>
              <div className="achievement-details">
                <h4>Global IT Award Winner</h4>
                <p>Recognized for architectural design and software scalability at the annual Tech Summit.</p>
              </div>
            </div>
            <div className="achievement-card glass-card">
              <div className="achievement-icon"><ShieldCheck size={28} /></div>
              <div className="achievement-details">
                <h4>SOC2 Type II Certified</h4>
                <p>Our implementation standards adhere strictly to international security and privacy protocols.</p>
              </div>
            </div>
            <div className="achievement-card glass-card">
              <div className="achievement-icon"><Globe size={28} /></div>
              <div className="achievement-details">
                <h4>15+ Countries Served</h4>
                <p>We deploy and manage highly available multi-region instances for global operations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
           4. Our Services Section
           ========================================== */}
      <section className="section-container" id="services">
        <div className="section-title-wrap reveal reveal-fade">
          <span className="section-badge">Our Services</span>
          <h2 className="section-title">Comprehensive Tech Capabilities</h2>
          <p className="section-subtitle">We design, implement, deploy, and scale end-to-end digital solutions utilizing modern technology stacks.</p>
        </div>

        <div className="services-grid">
          <div className="service-card glass-card reveal reveal-slide-up delay-100">
            <div className="service-icon-box"><Code size={28} /></div>
            <h3>Web Development</h3>
            <p className="service-desc">High-performance web applications built using React, Next.js, and lightweight responsive architectures.</p>
            <a href="#contact" className="service-link">Learn More <ChevronRight size={14} /></a>
          </div>

          <div className="service-card glass-card reveal reveal-slide-up delay-200">
            <div className="service-icon-box"><Database size={28} /></div>
            <h3>ERP Solutions</h3>
            <p className="service-desc">Custom enterprise resource planning frameworks to manage inventories, supply chains, and HR operations.</p>
            <a href="#contact" className="service-link">Learn More <ChevronRight size={14} /></a>
          </div>

          <div className="service-card glass-card reveal reveal-slide-up delay-300">
            <div className="service-icon-box"><Smartphone size={28} /></div>
            <h3>Mobile App Development</h3>
            <p className="service-desc">Cross-platform iOS and Android apps built with Flutter and React Native for smooth, native performance.</p>
            <a href="#contact" className="service-link">Learn More <ChevronRight size={14} /></a>
          </div>

          <div className="service-card glass-card reveal reveal-slide-up delay-100">
            <div className="service-icon-box"><Palette size={28} /></div>
            <h3>UI/UX Design</h3>
            <p className="service-desc">Figma-prototyped sleek designs, logical wireframing, and interactive components that users love.</p>
            <a href="#contact" className="service-link">Learn More <ChevronRight size={14} /></a>
          </div>

          <div className="service-card glass-card reveal reveal-slide-up delay-200">
            <div className="service-icon-box"><Cloud size={28} /></div>
            <h3>Cloud Solutions</h3>
            <p className="service-desc">Secure migrations, serverless frameworks, and high availability systems engineered on AWS and Azure.</p>
            <a href="#contact" className="service-link">Learn More <ChevronRight size={14} /></a>
          </div>

          <div className="service-card glass-card reveal reveal-slide-up delay-300">
            <div className="service-icon-box"><Shuffle size={28} /></div>
            <h3>Digital Transformation</h3>
            <p className="service-desc">Refactoring legacy databases, migrating monolithic systems to microservices, and automating operations.</p>
            <a href="#contact" className="service-link">Learn More <ChevronRight size={14} /></a>
          </div>

          <div className="service-card glass-card reveal reveal-slide-up delay-100">
            <div className="service-icon-box"><InfinityIcon size={28} /></div>
            <h3>DevOps Services</h3>
            <p className="service-desc">Automated CI/CD pipelines, GitOps configurations, and container orchestration with Docker & Kubernetes.</p>
            <a href="#contact" className="service-link">Learn More <ChevronRight size={14} /></a>
          </div>

          <div className="service-card glass-card reveal reveal-slide-up delay-200">
            <div className="service-icon-box"><Cpu size={28} /></div>
            <h3>AI & Automation</h3>
            <p className="service-desc">Integrating NLP, custom machine learning models, and automated bots to boost operational performance.</p>
            <a href="#contact" className="service-link">Learn More <ChevronRight size={14} /></a>
          </div>

          <div className="service-card glass-card reveal reveal-slide-up delay-300">
            <div className="service-icon-box"><ShoppingBag size={28} /></div>
            <h3>E-Commerce Solutions</h3>
            <p className="service-desc">Scalable storefronts integrated with modern headless commerce platforms, stripe logic, and analytics.</p>
            <a href="#contact" className="service-link">Learn More <ChevronRight size={14} /></a>
          </div>

          <div className="service-card glass-card reveal reveal-slide-up delay-100">
            <div className="service-icon-box"><Users size={28} /></div>
            <h3>IT Consulting</h3>
            <p className="service-desc">Strategic audits on code safety, technical feasibility planning, and infrastructure cost assessments.</p>
            <a href="#contact" className="service-link">Learn More <ChevronRight size={14} /></a>
          </div>
        </div>
      </section>

      {/* ==========================================
           5. Industries We Serve Section
           ========================================== */}
      <section className="section-container" style={{ background: 'var(--gradient-dark)' }} id="industries">
        <div className="section-title-wrap reveal reveal-fade">
          <span className="section-badge">Industries We Serve</span>
          <h2 className="section-title">Delivering Vertical Solutions</h2>
          <p className="section-subtitle">We build custom tools, compliance grids, and platforms tailored to specific industry verticals.</p>
        </div>

        <div className="industries-grid">
          <div className="industry-card glass-card reveal reveal-scale delay-100">
            <div className="industry-icon-box"><HeartPulse size={32} /></div>
            <h3>Healthcare</h3>
            <p>HIPAA compliant databases and patient care management portals.</p>
          </div>

          <div className="industry-card glass-card reveal reveal-scale delay-200">
            <div className="industry-icon-box"><GraduationCap size={32} /></div>
            <h3>Education</h3>
            <p>Robust e-learning platforms, exam panels, and administration apps.</p>
          </div>

          <div className="industry-card glass-card reveal reveal-scale delay-300">
            <div className="industry-icon-box"><Factory size={32} /></div>
            <h3>Manufacturing</h3>
            <p>IoT automation trackers, inventory pipelines, and logistics ERP.</p>
          </div>

          <div className="industry-card glass-card reveal reveal-scale delay-400">
            <div className="industry-icon-box"><Store size={32} /></div>
            <h3>Retail</h3>
            <p>Omnichannel POS connections, loyalty integrations, and dashboards.</p>
          </div>

          <div className="industry-card glass-card reveal reveal-scale delay-100">
            <div className="industry-icon-box"><LineChart size={32} /></div>
            <h3>Finance</h3>
            <p>Secure payment pathways, fraud trackers, and high-frequency grids.</p>
          </div>

          <div className="industry-card glass-card reveal reveal-scale delay-200">
            <div className="industry-icon-box"><Truck size={32} /></div>
            <h3>Logistics</h3>
            <p>GPS tracking systems, fleet allocation panels, and route optimizer.</p>
          </div>

          <div className="industry-card glass-card reveal reveal-scale delay-300">
            <div className="industry-icon-box"><Landmark size={32} /></div>
            <h3>Government</h3>
            <p>High-security data processing portals and public services platforms.</p>
          </div>

          <div className="industry-card glass-card reveal reveal-scale delay-400">
            <div className="industry-icon-box"><Rocket size={32} /></div>
            <h3>Startups</h3>
            <p>Rapid MVP prototyping, modular coding architectures, and auto-scalers.</p>
          </div>
        </div>
      </section>

      {/* ==========================================
           6. Portfolio / Projects Section
           ========================================== */}
      <section className="section-container" id="portfolio">
        <div className="section-title-wrap reveal reveal-fade">
          <span className="section-badge">Case Studies</span>
          <h2 class="section-title">Selected Projects Showcase</h2>
          <p class="section-subtitle">Explore details and performance metrics on systems we have engineered for our clients.</p>
        </div>

        <div className="portfolio-filter-wrap reveal reveal-fade">
          <button className={`filter-btn ${portfolioFilter === 'all' ? 'active' : ''}`} onClick={() => handleFilterClick('all')}>All Solutions</button>
          <button className={`filter-btn ${portfolioFilter === 'webapp' ? 'active' : ''}`} onClick={() => handleFilterClick('webapp')}>Web Apps</button>
          <button className={`filter-btn ${portfolioFilter === 'mobile' ? 'active' : ''}`} onClick={() => handleFilterClick('mobile')}>Mobile Apps</button>
          <button className={`filter-btn ${portfolioFilter === 'cloud' ? 'active' : ''}`} onClick={() => handleFilterClick('cloud')}>Cloud & ERP</button>
        </div>

        <div className="portfolio-grid" style={{ opacity: portfolioFade ? 0.3 : 1 }}>
          {/* Project 1 */}
          {(portfolioFilter === 'all' || portfolioFilter === 'webapp') && (
            <div className="portfolio-item glass-card reveal reveal-slide-up" data-category="webapp">
              <div className="portfolio-image-wrap">
                <img src="/dashboard_mockup.png" alt="SaaS Analytics Dashboard Project Mockup" />
                <div className="portfolio-image-overlay">
                  <div className="portfolio-tech-tags">
                    <span className="portfolio-tech-badge">Next.js</span>
                    <span className="portfolio-tech-badge">Node.js</span>
                    <span className="portfolio-tech-badge">PostgreSQL</span>
                  </div>
                </div>
              </div>
              <div className="portfolio-info">
                <span className="portfolio-category">Web Platform</span>
                <h3 className="portfolio-title">AeroAnalytics SaaS Portal</h3>
                <p className="portfolio-desc">An interactive real-time telemetry analytics platform designed for commercial aviation hardware tracking.</p>
                <div className="portfolio-stats-wrap">
                  <div className="portfolio-stat-box">
                    <span>Latency</span>
                    <span>&lt; 50ms</span>
                  </div>
                  <div className="portfolio-stat-box">
                    <span>Uptime</span>
                    <span>99.99%</span>
                  </div>
                </div>
                <a href="#contact" className="portfolio-btn">View Case Study</a>
              </div>
            </div>
          )}

          {/* Project 2 */}
          {(portfolioFilter === 'all' || portfolioFilter === 'mobile') && (
            <div className="portfolio-item glass-card reveal reveal-slide-up delay-100" data-category="mobile">
              <div className="portfolio-image-wrap">
                <img src="/mobile_mockup.png" alt="Sleek Mobile App Project Mockup" />
                <div className="portfolio-image-overlay">
                  <div className="portfolio-tech-tags">
                    <span className="portfolio-tech-badge">React Native</span>
                    <span className="portfolio-tech-badge">Firebase</span>
                    <span className="portfolio-tech-badge">GraphQL</span>
                  </div>
                </div>
              </div>
              <div className="portfolio-info">
                <span className="portfolio-category">Mobile App</span>
                <h3 className="portfolio-title">PulseMed Healthcare App</h3>
                <p className="portfolio-desc">A premium double-encrypted mobile healthcare companion app connecting patients with consulting doctors.</p>
                <div className="portfolio-stats-wrap">
                  <div className="portfolio-stat-box">
                    <span>Active Users</span>
                    <span>120k+</span>
                  </div>
                  <div className="portfolio-stat-box">
                    <span>Rating</span>
                    <span>4.9 / 5</span>
                  </div>
                </div>
                <a href="#contact" className="portfolio-btn">View Case Study</a>
              </div>
            </div>
          )}

          {/* Project 3 */}
          {(portfolioFilter === 'all' || portfolioFilter === 'cloud') && (
            <div className="portfolio-item glass-card reveal reveal-slide-up delay-200" data-category="cloud">
              <div className="portfolio-image-wrap">
                <img src="/cloud_mockup.png" alt="Futuristic Cloud Server Infrastructure Visualization" />
                <div className="portfolio-image-overlay">
                  <div className="portfolio-tech-tags">
                    <span className="portfolio-tech-badge">AWS EKS</span>
                    <span className="portfolio-tech-badge">Terraform</span>
                    <span className="portfolio-tech-badge">Docker</span>
                  </div>
                </div>
              </div>
              <div className="portfolio-info">
                <span className="portfolio-category">Cloud Orchestration</span>
                <h3 className="portfolio-title">Apex Logistics Grid Migration</h3>
                <p className="portfolio-desc">Complete legacy database migration to a serverless microservices setup on AWS, handling multi-region transactions.</p>
                <div className="portfolio-stats-wrap">
                  <div className="portfolio-stat-box">
                    <span>Server Cost</span>
                    <span>- 35%</span>
                  </div>
                  <div className="portfolio-stat-box">
                    <span>Deploy Speed</span>
                    <span>10x Faster</span>
                  </div>
                </div>
                <a href="#contact" className="portfolio-btn">View Case Study</a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ==========================================
           7. Why Choose RAUT Section
           ========================================== */}
      <section className="section-container" id="why-choose">
        <div className="section-title-wrap reveal reveal-fade">
          <span className="section-badge">Why Choose RAUT</span>
          <h2 className="section-title">Engineered For Reliability</h2>
          <p className="section-subtitle">We emphasize performance, architectural safety, and transparent partnerships in every delivery.</p>
        </div>

        <div className="why-grid">
          <div className="why-card glass-card reveal reveal-slide-up">
            <div className="why-icon-box"><Users2 size={24} /></div>
            <h3>Experienced Team</h3>
            <p>Our architects and senior developers average 8+ years of industry-specific engineering experience.</p>
          </div>

          <div className="why-card glass-card reveal reveal-slide-up delay-100">
            <div className="why-icon-box"><Lightbulb size={24} /></div>
            <h3>Innovative Solutions</h3>
            <p>We leverage modern framework design and custom machine learning modules to solve operational bottlenecks.</p>
          </div>

          <div className="why-card glass-card reveal reveal-slide-up delay-200">
            <div className="why-icon-box"><Clock size={24} /></div>
            <h3>On-Time Delivery</h3>
            <p>Using agile sprints, transparent jira metrics, and weekly demos, we ensure timelines are strictly adhered to.</p>
          </div>

          <div className="why-card glass-card reveal reveal-slide-up delay-300">
            <div className="why-icon-box"><HelpCircle size={24} /></div>
            <h3>24/7 Support</h3>
            <p>Our operations team runs rotating shifts offering round-the-clock incident response and hotfix updates.</p>
          </div>

          <div className="why-card glass-card reveal reveal-slide-up">
            <div className="why-icon-box"><Maximize size={24} /></div>
            <h3>Scalable Architecture</h3>
            <p>We design databases and APIs with modular patterns capable of managing spikes of millions of concurrent actions.</p>
          </div>

          <div className="why-card glass-card reveal reveal-slide-up delay-100">
            <div className="why-icon-box"><ShieldAlert size={24} /></div>
            <h3>Security First</h3>
            <p>Strict injection filters, end-to-end payload encryption, and automated vulnerability audits are standard.</p>
          </div>

          <div className="why-card glass-card reveal reveal-slide-up delay-200">
            <div className="why-icon-box"><PiggyBank size={24} /></div>
            <h3>Cost Effective</h3>
            <p>We optimize cloud instances, implement serverless architecture, and automate structures to lower server costs.</p>
          </div>

          <div className="why-card glass-card reveal reveal-slide-up delay-300">
            <div className="why-icon-box"><Globe2 size={24} /></div>
            <h3>Global Standards</h3>
            <p>Our codebases are written following international formatting rules, unit testing guidelines, and clean design logs.</p>
          </div>
        </div>
      </section>

      {/* ==========================================
           8. Company Stats Bar Section
           ========================================== */}
      <section className="stats-bar-section" ref={statsSectionRef}>
        <div className="stats-bar-grid">
          <div className="bar-stat-item">
            <div className="bar-stat-number" data-target="1200">0</div>
            <div className="bar-stat-label">Projects Completed</div>
          </div>
          <div className="bar-stat-item">
            <div className="bar-stat-number" data-target="320">0</div>
            <div className="bar-stat-label">Happy Clients</div>
          </div>
          <div className="bar-stat-item">
            <div className="bar-stat-number" data-target="85">0</div>
            <div className="bar-stat-label">Team Members</div>
          </div>
          <div className="bar-stat-item">
            <div className="bar-stat-number" data-target="15">0</div>
            <div className="bar-stat-label">Countries Served</div>
          </div>
          <div className="bar-stat-item">
            <div className="bar-stat-number" data-target="10">0</div>
            <div className="bar-stat-label">Years of Experience</div>
          </div>
        </div>
      </section>

      {/* ==========================================
           9. Team Section
           ========================================== */}
      <section className="section-container" id="team">
        <div className="section-title-wrap reveal reveal-fade">
          <span className="section-badge">Leadership</span>
          <h2 className="section-title">The Engineering Minds Behind RAUT</h2>
          <p className="section-subtitle">Meet our executive leadership and architectural experts driving digital solutions.</p>
        </div>

        <div className="team-grid">
          <div className="team-card glass-card reveal reveal-slide-up">
            <div className="team-image-box">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600" alt="Sarah Jenkins, CEO of RAUT" />
              <div className="team-social-overlay">
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="team-social-btn"><Linkedin size={18} /></a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="team-social-btn"><Twitter size={18} /></a>
              </div>
            </div>
            <div className="team-info">
              <h4 class="team-name">Arthur Vance</h4>
              <span class="team-role">Chief Executive Officer</span>
            </div>
          </div>

          <div className="team-card glass-card reveal reveal-slide-up delay-100">
            <div className="team-image-box">
              <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600" alt="Marcus Chen, Chief Technical Officer" />
              <div className="team-social-overlay">
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="team-social-btn"><Linkedin size={18} /></a>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="team-social-btn"><Github size={18} /></a>
              </div>
            </div>
            <div className="team-info">
              <h4 class="team-name">Dr. Marcus Chen</h4>
              <span class="team-role">Chief Technology Officer</span>
            </div>
          </div>

          <div className="team-card glass-card reveal reveal-slide-up delay-200">
            <div className="team-image-box">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600" alt="Elena Rostova, VP of Engineering" />
              <div className="team-social-overlay">
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="team-social-btn"><Linkedin size={18} /></a>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="team-social-btn"><Github size={18} /></a>
              </div>
            </div>
            <div className="team-info">
              <h4 class="team-name">Elena Rostova</h4>
              <span class="team-role">VP of Cloud Engineering</span>
            </div>
          </div>

          <div className="team-card glass-card reveal reveal-slide-up delay-300">
            <div className="team-image-box">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600" alt="David Miller, Design Lead" />
              <div className="team-social-overlay">
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="team-social-btn"><Linkedin size={18} /></a>
                <a href="https://dribbble.com" target="_blank" rel="noreferrer" className="team-social-btn"><Dribbble size={18} /></a>
              </div>
            </div>
            <div className="team-info">
              <h4 class="team-name">David Miller</h4>
              <span class="team-role">Chief Design Architect</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
           10. Testimonials Section
           ========================================== */}
      <section className="section-container" style={{ background: 'var(--gradient-dark)' }} id="testimonials">
        <div className="section-title-wrap reveal reveal-fade">
          <span className="section-badge">Client Reviews</span>
          <h2 className="section-title">Trusted By Leading Enterprises</h2>
          <p className="section-subtitle">Hear how we've helped companies transform their workflows and expand their capability metrics.</p>
        </div>

        <div className="testimonials-carousel-container glass-panel reveal reveal-scale">
          <div className="carousel-arrow carousel-arrow-prev" onClick={() => setTestimonialIndex(prev => (prev - 1 + 3) % 3)} id="prev-btn">
            <ChevronLeft size={20} />
          </div>
          <div className="carousel-arrow carousel-arrow-next" onClick={() => setTestimonialIndex(prev => (prev + 1) % 3)} id="next-btn">
            <ChevronRight size={20} />
          </div>

          <div className="testimonial-track" style={{ transform: `translateX(-${testimonialIndex * 100}%)` }} id="testimonial-track">
            {/* Slide 1 */}
            <div className="testimonial-slide">
              <div className="testimonial-rating">
                <Star size={18} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                <Star size={18} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                <Star size={18} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                <Star size={18} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                <Star size={18} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
              </div>
              <p className="testimonial-text">
                "RAUT refactored our legacy ERP architecture in under 3 months, saving our team countless hours in inventory tracking. Their deployment standards are among the best we have experienced in the digital services sector."
              </p>
              <div className="testimonial-user">
                <div className="testimonial-avatar">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" alt="Clara Sterling" />
                </div>
                <div className="testimonial-meta">
                  <h4 className="testimonial-name">Clara Sterling</h4>
                  <span className="testimonial-company">Director of Operations, Aero Logistics</span>
                </div>
              </div>
            </div>

            {/* Slide 2 */}
            <div className="testimonial-slide">
              <div className="testimonial-rating">
                <Star size={18} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                <Star size={18} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                <Star size={18} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                <Star size={18} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                <Star size={18} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
              </div>
              <p className="testimonial-text">
                "The web portal created by RAUT has seen over 100,000 active monthly transactions since its launch, with absolutely zero downtime. Their security-first strategy gave our board total confidence."
              </p>
              <div className="testimonial-user">
                <div className="testimonial-avatar">
                  <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150" alt="Thomas Reyes" />
                </div>
                <div className="testimonial-meta">
                  <h4 className="testimonial-name">Thomas Reyes</h4>
                  <span className="testimonial-company">VP of Technology, Apex Financials</span>
                </div>
              </div>
            </div>

            {/* Slide 3 */}
            <div className="testimonial-slide">
              <div className="testimonial-rating">
                <Star size={18} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                <Star size={18} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                <Star size={18} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                <Star size={18} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                <Star size={18} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
              </div>
              <p className="testimonial-text">
                "RAUT's mobile app layout completely transformed patient engagement for our healthcare network. We have achieved a consistent 4.9-star rating on the App Store since implementation."
              </p>
              <div className="testimonial-user">
                <div className="testimonial-avatar">
                  <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150" alt="Dr. Sarah Kross" />
                </div>
                <div className="testimonial-meta">
                  <h4 className="testimonial-name">Dr. Sarah Kross</h4>
                  <span className="testimonial-company">Founder, PulseMed Systems</span>
                </div>
              </div>
            </div>
          </div>

          <div className="carousel-dots" id="carousel-dots">
            {[0, 1, 2].map((idx) => (
              <span 
                key={idx} 
                className={`carousel-dot ${testimonialIndex === idx ? 'active' : ''}`}
                onClick={() => setTestimonialIndex(idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
           11. Technologies Grid Section (Dynamic LogoLoop)
           ========================================== */}
      <section className="section-container" id="technologies">
        <div className="section-title-wrap reveal reveal-fade">
          <span className="section-badge">Tech Stack</span>
          <h2 className="section-title">Modern Technologies We Utilize</h2>
          <p className="section-subtitle">We employ state-of-the-art frameworks, deployment models, and database managers.</p>
        </div>

        {/* Dynamic LogoLoop slider component */}
        <div className="technologies-loop-wrap reveal reveal-fade">
          <LogoLoop speed={120} gap={40} logoHeight={48} fadeOut scaleOnHover />
        </div>
      </section>

      {/* ==========================================
           12. Contact Section & Map
           ========================================== */}
      <section className="section-container" id="contact">
        <div className="section-title-wrap reveal reveal-fade">
          <span className="section-badge">Get In Touch</span>
          <h2 className="section-title">Start Your Project With RAUT</h2>
          <p className="section-subtitle">Fill out our project inquiry form below or schedule a consultation with our technology team.</p>
        </div>

        <div className="contact-grid">
          <div className="contact-form-wrap glass-panel reveal reveal-slide-left" id="contact-panel">
            <h3 className="form-title">Send Us A Message</h3>
            <form id="contact-form" onSubmit={handleContactSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Full Name *</label>
                  <input type="text" id="name" name="name" className="form-control" placeholder="John Doe" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Work Email *</label>
                  <input type="email" id="email" name="email" class="form-control" placeholder="john@company.com" required />
                </div>
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <input type="tel" id="phone" name="phone" className="form-control" placeholder="+1 (555) 000-0000" />
                </div>
                <div className="form-group">
                  <label htmlFor="company" className="form-label">Company Name</label>
                  <input type="text" id="company" name="company" className="form-control" placeholder="Acme Corp" />
                </div>
                <div className="form-group form-group-full">
                  <label htmlFor="service" className="form-label">Service Required *</label>
                  <select id="service" name="service" className="form-control" required style={{ appearance: 'none', cursor: 'pointer' }}>
                    <option value="" disabled selected>Select a Service</option>
                    <option value="web-dev">Web Development</option>
                    <option value="erp">ERP Solutions</option>
                    <option value="mobile">Mobile App Development</option>
                    <option value="ui-ux">UI/UX Design</option>
                    <option value="cloud">Cloud Solutions</option>
                    <option value="devops">DevOps & CI/CD</option>
                    <option value="ai">AI & Automation</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                </div>
                <div className="form-group form-group-full">
                  <label htmlFor="message" class="form-label">Message *</label>
                  <textarea id="message" name="message" className="form-control" placeholder="Tell us about your project, timeline, and goals..." required></textarea>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Inquiry <Send size={16} /></button>
            </form>
          </div>

          <div className="contact-info-col reveal reveal-slide-right">
            <div className="info-card glass-panel">
              <h3 className="info-title">Office Contacts</h3>
              <ul className="info-list">
                <li className="info-item">
                  <div className="info-icon-box"><MapPin size={18} /></div>
                  <div className="info-text">
                    <h4>Address</h4>
                    <p>100 Apple Parkway, Suite 500<br />Cupertino, CA 95014</p>
                  </div>
                </li>
                <li className="info-item">
                  <div className="info-icon-box"><Mail size={18} /></div>
                  <div className="info-text">
                    <h4>Email</h4>
                    <p>inquiries@raut-tech.com<br />support@raut-tech.com</p>
                  </div>
                </li>
                <li className="info-item">
                  <div className="info-icon-box"><Phone size={18} /></div>
                  <div className="info-text">
                    <h4>Phone</h4>
                    <p>+1 (408) 555-7288<br />+1 (800) 909-RAUT</p>
                  </div>
                </li>
                <li className="info-item">
                  <div className="info-icon-box"><Clock4 size={18} /></div>
                  <div className="info-text">
                    <h4>Business Hours</h4>
                    <p>Mon - Fri: 9:00 AM - 6:00 PM EST<br />Support: 24/7 Available</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="map-card glass-panel">
              <iframe title="Office Map Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3172.332530514264!2d-122.03118!3d37.33182!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb59127351799%3A0xa2383cd8c7154d!2sApple%20Park!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
           13. Footer Section
           ========================================== */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-col footer-col-about">
            <div className="footer-logo">
              <svg className="brand-logo-svg" viewBox="0 0 132 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0 0 H 16 C 24 0 28 4 28 11 C 28 16 25 20 19 21.5 L 29 35 H 19 L 10.5 23 H 8.5 V 35 H 0 V 0 Z M 8.5 7 V 16 H 15 C 18.5 16 20 14.5 20 11.5 C 20 8.5 18.5 7 15 7 H 8.5 Z" fill="currentColor"/>
                <path d="M 34 35 L 45 0 H 53 L 64 35 H 55.5 L 49 14 L 42.5 35 H 34 Z" fill="currentColor"/>
                <path d="M 70 0 H 78.5 V 23.5 C 78.5 28.5 81.5 30 84.5 30 C 87.5 30 90.5 28.5 90.5 23.5 V 0 H 99 V 23.5 C 99 32 93 36.5 84.5 36.5 C 76 36.5 70 32 70 23.5 V 0 Z" fill="currentColor"/>
                <path d="M 104 0 H 132 V 7.5 H 122.5 V 35 H 113.5 V 7.5 H 104 V 0 Z" fill="currentColor"/>
              </svg>
            </div>
            <p>Providing industry-defining technical orchestration, custom codebases, and cloud management systems for modern global enterprises.</p>
            <div className="footer-socials">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="footer-social-btn"><Linkedin size={18} /></a>
              <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="footer-social-btn"><Github size={18} /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="footer-social-btn"><Twitter size={18} /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="footer-social-btn"><Youtube size={18} /></a>
            </div>
          </div>

          <div className="footer-col">
            <h3>Services</h3>
            <ul className="footer-links">
              <li><a href="#services">Web Development</a></li>
              <li><a href="#services">Cloud Solutions</a></li>
              <li><a href="#services">ERP Development</a></li>
              <li><a href="#services">DevOps Pipelines</a></li>
              <li><a href="#services">AI Automation</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Resources</h3>
            <ul className="footer-links">
              <li><a href="#portfolio">Our Portfolio</a></li>
              <li><a href="#about">Growth Timeline</a></li>
              <li><a href="#why-choose">Security Policies</a></li>
              <li><a href="#team">Leadership Team</a></li>
              <li><a href="#contact">Contact Support</a></li>
            </ul>
          </div>

          <div className="footer-col footer-newsletter">
            <h3>Newsletter</h3>
            <p>Subscribe to receive architectural patterns, updates, and SaaS deployment insights.</p>
            <form className="newsletter-form" id="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input type="email" className="newsletter-input" placeholder="Your Email" aria-label="Your Email" required />
              <button type="submit" className="newsletter-btn" aria-label="Subscribe"><ArrowRight size={18} /></button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-container">
            <p>&copy; 2026 RAUT Technologies Inc. All rights reserved.</p>
            <div className="footer-legal-links">
              <a href="#contact">Privacy Policy</a>
              <a href="#contact">Terms of Service</a>
              <a href="#contact">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast Notifications Container */}
      <div className="toast-container" id="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type} show`}>
            {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span className="toast-text">{toast.message}</span>
          </div>
        ))}
      </div>
    </>
  );
}
