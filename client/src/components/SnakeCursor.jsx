import { useEffect, useRef } from 'react';

const SEGMENTS = 15;
const SEGMENT_DIST = 10;
const BASE_RADIUS = 7;

/**
 * Performance-optimized canvas snake cursor.
 * - 15 segments max
 * - All state in refs (zero React re-renders for mouse)
 * - requestAnimationFrame loop
 * - Disabled on touch / mobile
 * - pointer-events: none
 */
export default function SnakeCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Disable on mobile / touch devices
    const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    if (isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const mouse = { x: w / 2, y: h / 2 };
    const prevMouse = { x: w / 2, y: h / 2 };
    const segments = Array.from({ length: SEGMENTS }, () => ({ x: w / 2, y: h / 2 }));
    let hoverState = 'default'; // default | button | link | card
    let animId = 0;

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const onMouseMove = (e) => {
      prevMouse.x = mouse.x;
      prevMouse.y = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el) return;
      if (el.closest('button') || el.tagName === 'BUTTON') hoverState = 'button';
      else if (el.closest('a') || el.tagName === 'A') hoverState = 'link';
      else if (el.closest('[data-card]')) hoverState = 'card';
      else hoverState = 'default';
    };

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      const speed = Math.hypot(mouse.x - prevMouse.x, mouse.y - prevMouse.y);
      const stretch = Math.min(speed * 0.04, 1.2);

      // Head follows mouse
      segments[0].x += (mouse.x - segments[0].x) * 0.2;
      segments[0].y += (mouse.y - segments[0].y) * 0.2;

      for (let i = 1; i < SEGMENTS; i++) {
        const prev = segments[i - 1];
        const curr = segments[i];
        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        const d = Math.hypot(dx, dy);
        if (d > SEGMENT_DIST) {
          const r = (d - SEGMENT_DIST) / d;
          curr.x -= dx * r * 0.55;
          curr.y -= dy * r * 0.55;
        }
      }

      // Draw with simple circles — GPU friendly, no shadows
      for (let i = SEGMENTS - 1; i >= 0; i--) {
        const t = i / SEGMENTS; // 0=head 1=tail
        const alpha = 1 - t * 0.88;
        const radius = Math.max((BASE_RADIUS - t * BASE_RADIUS * 0.65) * (1 + stretch * 0.08 * (1 - t)), 1);

        let r, g, b;
        switch (hoverState) {
          case 'button':
            r = 56; g = 189; b = 248; break;
          case 'link':
            r = 192; g = 132; b = 252; break;
          case 'card':
            r = 251; g = 146; b = 60; break;
          default: {
            r = Math.round(14 + t * 154);
            g = Math.round(165 + t * (-80));
            b = Math.round(233 + t * 14);
          }
        }

        ctx.beginPath();
        ctx.arc(segments[i].x, segments[i].y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
