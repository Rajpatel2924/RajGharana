'use client';

import { useCallback, useEffect, useRef } from 'react';
import './BorderGlow.css';

const parseHSL = hslString => {
  const match = hslString.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 24, s: 95, l: 53 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
};

const buildGlowVars = (glowColor, intensity) => {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const vars = {};
  [100, 60, 50, 40, 30, 20, 10].forEach((opacity, index) => {
    const key = index === 0 ? '' : `-${opacity}`;
    vars[`--glow-color${key}`] = `hsl(${base} / ${Math.min(opacity * intensity, 100)}%)`;
  });
  return vars;
};

const gradientPositions = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
const gradientKeys = ['--gradient-one', '--gradient-two', '--gradient-three', '--gradient-four', '--gradient-five', '--gradient-six', '--gradient-seven'];
const colorMap = [0, 1, 2, 0, 1, 2, 1];

const buildGradientVars = colors => {
  const vars = {};
  gradientKeys.forEach((key, index) => {
    vars[key] = `radial-gradient(at ${gradientPositions[index]}, ${colors[Math.min(colorMap[index], colors.length - 1)]} 0px, transparent 50%)`;
  });
  vars['--gradient-base'] = `linear-gradient(${colors[0]} 0 100%)`;
  return vars;
};

const BorderGlow = ({
  children,
  className = '',
  edgeSensitivity = 24,
  glowColor = '24 95 53',
  backgroundColor = '#f3f4f6',
  borderRadius = 8,
  glowRadius = 24,
  glowIntensity = 0.75,
  coneSpread = 24,
  colors = ['#ea580c', '#fb923c', '#f43f5e'],
  fillOpacity = 0.16,
}) => {
  const cardRef = useRef(null);

  const getCenter = useCallback(element => {
    const { width, height } = element.getBoundingClientRect();
    return [width / 2, height / 2];
  }, []);

  const handlePointerMove = useCallback(event => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const [centerX, centerY] = getCenter(card);
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const dx = x - centerX;
    const dy = y - centerY;
    const kx = dx === 0 ? Infinity : centerX / Math.abs(dx);
    const ky = dy === 0 ? Infinity : centerY / Math.abs(dy);
    const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    card.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(3)}`);
    card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
  }, [getCenter]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return undefined;
    const handlePointerLeave = () => card.style.setProperty('--edge-proximity', '0');
    card.addEventListener('pointerleave', handlePointerLeave);
    return () => card.removeEventListener('pointerleave', handlePointerLeave);
  }, []);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={`border-glow-card ${className}`}
      style={{
        '--card-bg': backgroundColor,
        '--edge-sensitivity': edgeSensitivity,
        '--border-radius': `${borderRadius}px`,
        '--glow-padding': `${glowRadius}px`,
        '--cone-spread': coneSpread,
        '--fill-opacity': fillOpacity,
        ...buildGlowVars(glowColor, glowIntensity),
        ...buildGradientVars(colors),
      }}
    >
      <span className="edge-light" />
      <div className="border-glow-inner">{children}</div>
    </div>
  );
};

export default BorderGlow;
