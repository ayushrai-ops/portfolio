import { useRef, useCallback } from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, X } from 'lucide-react';

const projects = [
    {
        id: 1,
        title: 'E-Commerce Platform',
        shortDesc: 'Full-stack shopping experience with real-time inventory.',
        description: 'A full-stack e-commerce solution with dynamic cart, secure checkout, and real-time inventory management. Built with React, Node.js, and Stripe integration.',
        image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=800',
        tags: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
        github: '#',
        demo: '#',
        accent: 'from-brand-blue to-cyan-400',
    },
    {
        id: 2,
        title: 'AI Dashboard API',
        shortDesc: 'Data visualization with real-time ML prediction feeds.',
        description: 'An interactive data visualization dashboard consuming real-time machine learning predictions. Features comprehensive charting and data export capabilities.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
        tags: ['TypeScript', 'Next.js', 'Tailwind', 'Python'],
        github: '#',
        demo: '#',
        accent: 'from-brand-purple to-pink-400',
    },
    {
        id: 3,
        title: 'Web3 NFT Marketplace',
        shortDesc: 'Decentralized app for minting and trading NFTs.',
        description: 'A decentralized application for minting, buying, and selling NFTs on the Ethereum blockchain. Includes smart contract interactions via ethers.js.',
        image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?auto=format&fit=crop&q=80&w=800',
        tags: ['React', 'Solidity', 'Ethers.js', 'Framer Motion'],
        github: '#',
        demo: '#',
        accent: 'from-emerald-400 to-brand-blue',
    }
];

/**
 * Pure CSS perspective tilt card – no library overhead.
 * Direct DOM manipulation via ref for mouse tracking (no setState = no re-renders).
 * Uses CSS transform (GPU-accelerated) only.
 */
function TiltCard({ children, className = '' }) {
    const ref = useRef(null);

    const handleMove = useCallback((e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 to 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale3d(1.03,1.03,1.03)`;
    }, []);

    const handleLeave = useCallback(() => {
        if (ref.current) ref.current.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale3d(1,1,1)';
    }, []);

    return (
        <div
            ref={ref}
            data-card
            className={className}
            style={{ transition: 'transform 0.45s cubic-bezier(0.22,1,0.36,1)', willChange: 'transform', transformStyle: 'preserve-3d' }}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
        >
            {children}
        </div>
    );
}

export default function Projects() {
    const [selectedProject, setSelectedProject] = useState(null);

    return (
        <section id="projects" className="py-24 relative z-10">
            <div className="max-w-7xl mx-auto px-6 sm:px-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center gap-4 mb-16"
                >
                    <div className="h-px bg-slate-800 flex-1" />
                    <h2 className="text-3xl md:text-4xl font-black text-white whitespace-nowrap">
                        <span className="text-brand-blue mr-2">03.</span> Featured Projects
                    </h2>
                    <div className="h-px bg-slate-800 flex-1" />
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, idx) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                        >
                            <TiltCard className="glass-card flex flex-col h-full group cursor-pointer overflow-hidden rounded-2xl relative">
                                <div onClick={() => setSelectedProject(project)} className="flex flex-col h-full">
                                    {/* Animated gradient border — lightweight, GPU-only */}
                                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 p-px bg-gradient-to-br ${project.accent} pointer-events-none`}
                                        style={{ transition: 'opacity 0.4s ease' }}>
                                        <div className="w-full h-full rounded-2xl bg-[#0c1222]" />
                                    </div>

                                    {/* Image */}
                                    <div className="h-48 overflow-hidden relative z-10 rounded-t-2xl">
                                        <img src={project.image} alt={project.title}
                                            className="w-full h-full object-cover group-hover:scale-110"
                                            style={{ transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)' }}
                                            loading="lazy" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1222] via-[#0c1222]/30 to-transparent" />
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-grow relative z-10">
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-blue"
                                            style={{ transition: 'color 0.3s ease' }}>
                                            {project.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm mb-4 flex-grow">{project.shortDesc}</p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {project.tags.map(tag => (
                                                <span key={tag} className="text-xs font-mono text-brand-purple px-2 py-1 bg-brand-purple/10 rounded-full border border-brand-purple/20">{tag}</span>
                                            ))}
                                        </div>

                                        <div className="flex gap-4 mt-auto border-t border-slate-800/50 pt-4">
                                            <a href={project.github} onClick={e => e.stopPropagation()} target="_blank" rel="noreferrer"
                                                className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white" style={{ transition: 'color 0.2s ease' }}>
                                                <Github size={14} /> Code
                                            </a>
                                            <a href={project.demo} onClick={e => e.stopPropagation()} target="_blank" rel="noreferrer"
                                                className="flex items-center gap-1.5 text-sm text-brand-blue hover:text-cyan-300" style={{ transition: 'color 0.2s ease' }}>
                                                <ExternalLink size={14} /> Demo
                                            </a>
                                            <span className="ml-auto text-xs text-slate-700 self-center">Click to expand →</span>
                                        </div>
                                    </div>
                                </div>
                            </TiltCard>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
                    >
                        <div className="absolute inset-0 bg-black/70" onClick={() => setSelectedProject(null)} />
                        <motion.div
                            className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0c1222] border border-slate-800"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <button onClick={() => setSelectedProject(null)}
                                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white" style={{ transition: 'color 0.2s ease' }}>
                                <X size={22} />
                            </button>

                            <div className="relative h-64 sm:h-80 overflow-hidden rounded-t-3xl">
                                <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1222] to-transparent" />
                            </div>

                            <div className="p-8 md:p-12 -mt-16 relative">
                                <h3 className="text-4xl md:text-5xl font-black text-white mb-4">{selectedProject.title}</h3>
                                <div className="flex flex-wrap gap-3 mb-8">
                                    {selectedProject.tags.map(tag => (
                                        <span key={tag} className="text-sm font-mono text-brand-blue px-3 py-1 bg-brand-blue/10 rounded-full border border-brand-blue/30">{tag}</span>
                                    ))}
                                </div>
                                <p className="text-slate-300 text-lg leading-relaxed mb-10 max-w-3xl">{selectedProject.description}</p>
                                <div className="flex flex-wrap gap-4">
                                    <a href={selectedProject.github} target="_blank" rel="noreferrer"
                                        className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white font-semibold rounded-full hover:bg-slate-700" style={{ transition: 'background 0.2s ease' }}>
                                        <Github size={18} /> View Code
                                    </a>
                                    <a href={selectedProject.demo} target="_blank" rel="noreferrer"
                                        className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${selectedProject.accent} text-white font-semibold rounded-full hover:opacity-90`} style={{ transition: 'opacity 0.2s ease' }}>
                                        <ExternalLink size={18} /> Live Demo
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
