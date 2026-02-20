import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, Linkedin } from 'lucide-react';

const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);

        // Active section detection via IntersectionObserver
        const sections = ['home', 'about', 'skills', 'projects', 'contact'];
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            },
            { threshold: 0.5 }
        );
        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, []);

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled
                    ? 'py-3 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 shadow-[0_0_30px_rgba(0,0,0,0.5)]'
                    : 'py-6 bg-transparent'
                }`}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="max-w-7xl mx-auto px-6 sm:px-10 flex justify-between items-center">
                {/* Logo */}
                <a href="#home" className="text-2xl font-black tracking-tighter">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple">AR.</span>
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-8 items-center">
                    {navLinks.map((link) => {
                        const isActive = activeSection === link.href.replace('#', '');
                        return (
                            <a
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-medium transition-colors relative group ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                {link.name}
                                {/* Animated underline */}
                                <motion.span
                                    className="absolute -bottom-1 left-0 h-px bg-gradient-to-r from-brand-blue to-brand-purple"
                                    animate={{ width: isActive ? '100%' : '0%' }}
                                    transition={{ duration: 0.3, ease: 'easeOut' }}
                                />
                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-blue/50 group-hover:w-full transition-all duration-300" />
                            </a>
                        );
                    })}

                    <div className="flex gap-3 ml-4 pl-4 border-l border-slate-700">
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-brand-purple transition-colors hover:scale-110 transform duration-200">
                            <Github size={18} />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-brand-blue transition-colors hover:scale-110 transform duration-200">
                            <Linkedin size={18} />
                        </a>
                    </div>
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-slate-300 hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <AnimatePresence mode="wait">
                        {mobileMenuOpen
                            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={24} /></motion.span>
                            : <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><Menu size={24} /></motion.span>
                        }
                    </AnimatePresence>
                </button>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="md:hidden absolute top-full left-4 right-4 mt-2 bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 flex flex-col gap-5 overflow-hidden"
                    >
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className={`text-lg font-medium transition-colors ${activeSection === link.href.replace('#', '')
                                        ? 'text-brand-blue'
                                        : 'text-slate-400 hover:text-white'
                                    }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
