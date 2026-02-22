import { useState } from 'react';
import { motion } from 'framer-motion';

const skills = [
    {
        category: 'Frontend', color: 'from-brand-blue to-cyan-400',
        items: [
            { name: 'React.js', level: 95, desc: 'Component-driven UIs, hooks, context, performance optimization' },
            { name: 'TypeScript', level: 88, desc: 'Typed React apps, generics, utility types' },
            { name: 'Tailwind CSS', level: 92, desc: 'Utility-first styling, complex responsive layouts' },
            { name: 'Next.js', level: 85, desc: 'SSR, SSG, App Router, API routes' },
            { name: 'Framer Motion', level: 80, desc: 'Declarative animations, gestures, layout transitions' },
        ],
    },
    {
        category: 'Backend', color: 'from-brand-purple to-pink-400',
        items: [
            { name: 'Node.js', level: 90, desc: 'REST APIs, event-driven architecture, streams' },
            { name: 'Express', level: 88, desc: 'Middleware, routing, authentication, rate limiting' },
            { name: 'PostgreSQL', level: 80, desc: 'Complex queries, indices, migrations, Prisma ORM' },
            { name: 'MongoDB', level: 78, desc: 'Document modelling, aggregation pipelines, Mongoose' },
            { name: 'REST APIs', level: 92, desc: 'RESTful design, versioning, JWT auth, OpenAPI docs' },
        ],
    },
    {
        category: 'Tools & DevOps', color: 'from-emerald-400 to-brand-blue',
        items: [
            { name: 'Git & GitHub', level: 93, desc: 'Branching strategy, PRs, CI/CD pipelines' },
            { name: 'Docker', level: 75, desc: 'Containerization, compose, multi-stage builds' },
            { name: 'Vite', level: 90, desc: 'Build tooling, plugins, HMR, bundling' },
            { name: 'Figma', level: 82, desc: 'Wireframing, design systems, component libraries' },
            { name: 'AWS', level: 70, desc: 'EC2, S3, Lambda, CloudFront deployments' },
        ],
    },
];

export default function Skills() {
    const [tooltip, setTooltip] = useState(null);

    return (
        <section id="skills" className="py-24 relative z-10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center gap-4 mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-black text-white whitespace-nowrap">
                        <span className="text-brand-purple mr-2">02.</span> Technical Arsenal
                    </h2>
                    <div className="h-px bg-slate-800 flex-1" />
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {skills.map((group, gi) => (
                        <motion.div
                            key={group.category}
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: gi * 0.1 }}
                            className="relative glass-card p-8 rounded-2xl group"
                            style={{ willChange: 'transform', transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1)' }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            {/* Border gradient on hover */}
                            <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 p-px bg-gradient-to-br ${group.color} pointer-events-none`}
                                style={{ transition: 'opacity 0.4s ease' }}>
                                <div className="w-full h-full rounded-2xl bg-[#0c1222]" />
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                    <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${group.color}`} />
                                    {group.category}
                                </h3>

                                <div className="space-y-5">
                                    {group.items.map((skill, si) => (
                                        <div key={skill.name}>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span
                                                    className="text-slate-300 cursor-help hover:text-white"
                                                    style={{ transition: 'color 0.2s ease' }}
                                                    onMouseEnter={e => {
                                                        const r = e.target.getBoundingClientRect();
                                                        setTooltip({ x: r.left, y: r.bottom + 8, name: skill.name, desc: skill.desc });
                                                    }}
                                                    onMouseLeave={() => setTooltip(null)}
                                                >
                                                    {skill.name}
                                                </span>
                                                <span className="text-slate-600 font-mono text-xs">{skill.level}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                                <motion.div
                                                    className={`h-full bg-gradient-to-r ${group.color} rounded-full`}
                                                    initial={{ scaleX: 0 }}
                                                    whileInView={{ scaleX: skill.level / 100 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 1, delay: 0.1 + si * 0.06, ease: [0.22, 1, 0.36, 1] }}
                                                    style={{ transformOrigin: 'left', willChange: 'transform' }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Tooltip */}
            {tooltip && (
                <div
                    className="fixed z-[100] max-w-xs bg-slate-900 border border-slate-700 text-slate-300 text-sm px-4 py-3 rounded-xl pointer-events-none"
                    style={{ top: tooltip.y, left: tooltip.x, opacity: 1 }}
                >
                    <span className="font-semibold text-white block mb-1">{tooltip.name}</span>
                    {tooltip.desc}
                </div>
            )}
        </section>
    );
}
