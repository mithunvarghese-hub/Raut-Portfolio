import React, { useEffect, useRef } from 'react';

export default function LogoLoop({
  speed = 120,
  direction = 'left',
  logoHeight = 48,
  gap = 40,
  hoverSpeed = 0,
  scaleOnHover = true,
  fadeOut = true,
  ariaLabel = "Technology partners"
}) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

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

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    // Apply inline style custom properties
    container.style.setProperty('--logoloop-gap', `${gap}px`);
    container.style.setProperty('--logoloop-logoHeight', `${logoHeight}px`);

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
    
    if (window.lucide) {
      window.lucide.createIcons();
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
          if (window.lucide) {
            window.lucide.createIcons();
          }
        }
      }
    };

    let resizeObserver = null;
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        updateCopiesAndDimensions();
      });
      resizeObserver.observe(container);
    } else {
      window.addEventListener('resize', updateCopiesAndDimensions);
    }
    
    const timeoutId = setTimeout(updateCopiesAndDimensions, 100);

    // Easing variables
    let isHovered = false;
    let offset = 0;
    let velocity = 0;
    let lastTimestamp = null;
    const targetVelocity = speed;

    const handleMouseEnter = () => { isHovered = true; };
    const handleMouseLeave = () => { isHovered = false; };

    track.addEventListener('mouseenter', handleMouseEnter);
    track.addEventListener('mouseleave', handleMouseLeave);

    let rafId = null;
    const animate = (timestamp) => {
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      }
      const deltaTime = Math.max(0, timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      const target = isHovered && hoverSpeed !== undefined ? hoverSpeed : targetVelocity;
      const easingFactor = 1 - Math.exp(-deltaTime / 0.25);
      velocity += (target - velocity) * easingFactor;

      if (seqWidth > 0) {
        offset = offset + velocity * deltaTime;
        offset = ((offset % seqWidth) + seqWidth) % seqWidth;
        track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    // Link hover listeners for cursor outlines
    let cursorTimeout = setTimeout(() => {
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

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
      clearTimeout(cursorTimeout);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', updateCopiesAndDimensions);
      }
      track.removeEventListener('mouseenter', handleMouseEnter);
      track.removeEventListener('mouseleave', handleMouseLeave);
      track.innerHTML = '';
    };
  }, [speed, gap, logoHeight, hoverSpeed, scaleOnHover, fadeOut]);

  return (
    <div
      ref={containerRef}
      className={`logoloop ${fadeOut ? 'logoloop--fade' : ''} ${scaleOnHover ? 'logoloop--scale-hover' : ''}`}
      role="region"
      aria-label={ariaLabel}
    >
      <div ref={trackRef} className="logoloop__track" />
    </div>
  );
}
