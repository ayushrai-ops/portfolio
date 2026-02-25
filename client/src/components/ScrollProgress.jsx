import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleY = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
    const [activeSection, setActiveSection] = useState('home');
    const sections = ['home', 'about', 'skills', 'projects', 'contact'];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => { if (entry.isIntersecting) setActiveSection(entry.target.id); });
            },
            { threshold: 0.45 }
        );
        sections.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
        return () => observer.disconnect();
    }, []);

    return (
        <>
            {/* Progress bar */}
            <div className="fixed right-0 top-0 w-[3px] h-full z-50 bg-slate-900/50 hidden md:block">
                <motion.div className="w-full bg-gradient-to-b from-brand-blue to-brand-purple origin-top" style={{ scaleY }} />
            </div>

            {/* Section dots */}
            <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex-col gap-4 hidden md:flex">
                {sections.map(id => (
                    <a key={id} href={`#${id}`} title={id.charAt(0).toUpperCase() + id.slice(1)} className="group flex items-center justify-end gap-2">
                        <span className={`text-[10px] font-mono opacity-0 group-hover:opacity-100 text-slate-500 ${activeSection === id ? 'opacity-100 !text-brand-blue' : ''}`}
                            style={{ transition: 'opacity 0.2s ease' }}>
                            {id}
                        </span>
                        <span className={`w-1.5 h-1.5 rounded-full ${activeSection === id ? 'bg-brand-blue scale-150' : 'bg-slate-700 group-hover:bg-slate-400'}`}
                            style={{ transition: 'all 0.3s ease' }} />
                    </a>
                ))}
            </div>
        </>
    );
}
