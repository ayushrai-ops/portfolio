import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e) => {
            if (
                e.target.tagName.toLowerCase() === 'button' ||
                e.target.tagName.toLowerCase() === 'a' ||
                e.target.closest('button') ||
                e.target.closest('a')
            ) {
                setIsHovered(true);
            } else {
                setIsHovered(false);
            }
        };

        window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    const variants = {
        default: {
            x: mousePosition.x - 16,
            y: mousePosition.y - 16,
            scale: 1,
            backgroundColor: 'transparent',
            borderColor: 'var(--color-brand-blue)',
        },
        hover: {
            x: mousePosition.x - 24,
            y: mousePosition.y - 24,
            scale: 1.5,
            backgroundColor: 'rgba(14, 165, 233, 0.2)', // Brand blue with opacity
            borderColor: 'var(--color-brand-purple)',
            mixBlendMode: 'screen',
        },
    };

    return (
        <motion.div
            className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 pointer-events-none z-50 flex items-center justify-center"
            variants={variants}
            animate={isHovered ? 'hover' : 'default'}
            transition={{
                type: 'spring',
                stiffness: 500,
                damping: 28,
                mass: 0.5,
            }}
        >
            <motion.div
                className="w-1.5 h-1.5 bg-brand-blue rounded-full absolute"
                animate={{
                    scale: isHovered ? 0 : 1,
                    opacity: isHovered ? 0 : 1
                }}
                transition={{ duration: 0.2 }}
            />
        </motion.div>
    );
}
