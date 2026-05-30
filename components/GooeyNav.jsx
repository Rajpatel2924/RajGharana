'use client';

import { useEffect, useRef, useState } from 'react';
import './GooeyNav.css';

const GooeyNav = ({
  items,
  animationTime = 600,
  particleCount = 12,
  particleDistances = [54, 8],
  particleR = 80,
  timeVariance = 180,
  colors = [1, 2, 3, 1, 2, 3, 4],
  initialActiveIndex = 0,
  onNavigate,
}) => {
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const filterRef = useRef(null);
  const textRef = useRef(null);
  const navigationTimerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (distance, pointIndex, totalPoints) => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (i, time, distances, radius) => {
    const rotate = noise(radius / 10);

    return {
      start: getXY(distances[0], particleCount - i, particleCount),
      end: getXY(distances[1] + noise(7), particleCount - i, particleCount),
      time,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + radius / 20) * 10 : (rotate - radius / 20) * 10,
    };
  };

  const makeParticles = (element) => {
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty('--time', `${bubbleTime}ms`);

    for (let i = 0; i < particleCount; i += 1) {
      const time = animationTime * 2 + noise(timeVariance * 2);
      const particleData = createParticle(i, time, particleDistances, particleR);
      element.classList.remove('active');

      setTimeout(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');
        particle.classList.add('gooey-particle');
        particle.style.setProperty('--start-x', `${particleData.start[0]}px`);
        particle.style.setProperty('--start-y', `${particleData.start[1]}px`);
        particle.style.setProperty('--end-x', `${particleData.end[0]}px`);
        particle.style.setProperty('--end-y', `${particleData.end[1]}px`);
        particle.style.setProperty('--time', `${particleData.time}ms`);
        particle.style.setProperty('--scale', `${particleData.scale}`);
        particle.style.setProperty('--color', `var(--gooey-color-${particleData.color})`);
        particle.style.setProperty('--rotate', `${particleData.rotate}deg`);

        point.classList.add('gooey-point');
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => element.classList.add('active'));
        setTimeout(() => particle.remove(), time);
      }, 30);
    }
  };

  const updateEffectPosition = (element) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const position = element.getBoundingClientRect();
    const styles = {
      left: `${position.x - containerRect.x}px`,
      top: `${position.y - containerRect.y}px`,
      width: `${position.width}px`,
      height: `${position.height}px`,
    };

    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.innerText;
  };

  const selectItem = (element, index) => {
    if (activeIndex === index) return;

    setActiveIndex(index);
    updateEffectPosition(element);
    filterRef.current?.querySelectorAll('.gooey-particle').forEach((particle) => particle.remove());

    if (textRef.current) {
      textRef.current.classList.remove('active');
      void textRef.current.offsetWidth;
      textRef.current.classList.add('active');
    }

    if (filterRef.current) makeParticles(filterRef.current);
  };

  const handleClick = (event, item, index) => {
    event.preventDefault();
    selectItem(event.currentTarget.parentElement, index);

    if (!onNavigate) {
      window.location.assign(item.href);
      return;
    }

    if (navigationTimerRef.current) clearTimeout(navigationTimerRef.current);
    navigationTimerRef.current = setTimeout(() => onNavigate(item.href), 220);
  };

  const handleKeyDown = (event, item, index) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick(event, item, index);
    }
  };

  useEffect(() => {
    setActiveIndex(initialActiveIndex);
  }, [initialActiveIndex]);

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return undefined;
    const activeItem = navRef.current.querySelectorAll('li')[activeIndex];
    if (activeItem) {
      updateEffectPosition(activeItem);
      textRef.current?.classList.add('active');
    }

    const resizeObserver = new ResizeObserver(() => {
      const currentItem = navRef.current?.querySelectorAll('li')[activeIndex];
      if (currentItem) updateEffectPosition(currentItem);
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeIndex]);

  useEffect(() => () => clearTimeout(navigationTimerRef.current), []);

  return (
    <div className="gooey-nav-container" ref={containerRef}>
      <nav aria-label="Primary navigation">
        <ul ref={navRef}>
          {items.map((item, index) => (
            <li key={item.href} className={activeIndex === index ? 'active' : ''}>
              <a
                href={item.href}
                onClick={(event) => handleClick(event, item, index)}
                onKeyDown={(event) => handleKeyDown(event, item, index)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <span className="effect filter" ref={filterRef} />
      <span className="effect text" ref={textRef} />
    </div>
  );
};

export default GooeyNav;
