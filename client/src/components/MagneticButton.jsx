import { useRef, useCallback } from 'react';

/**
 * MagneticButton — subtle cursor-pull hover effect.
 * Uses refs for mouse tracking (no re-renders on mousemove).
 * GPU-only: uses transform only.
 */
export default function MagneticButton({ children, className = '', strength = 0.3 }) {
    const ref = useRef(null);

    const handleMove = useCallback((e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * strength;
        const dy = (e.clientY - cy) * strength;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
    }, [strength]);

    const handleLeave = useCallback(() => {
        if (ref.current) ref.current.style.transform = 'translate(0,0)';
    }, []);

    return (
        <span
            ref={ref}
            className={`inline-block ${className}`}
            style={{ transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)', willChange: 'transform' }}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
        >
            {children}
        </span>
    );
}
