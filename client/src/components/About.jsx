import { motion } from 'framer-motion';

export default function About() {
    const fade = {
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    };

    return (
        <section id="about" className="py-24 relative z-10">
            <div className="max-w-7xl mx-auto px-6 sm:px-10">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
                    className="grid md:grid-cols-2 gap-16 items-center"
                >
                    {/* Text */}
                    <div>
                        <motion.div variants={fade} className="flex items-center gap-4 mb-6">
                            <h2 className="text-3xl md:text-4xl font-black text-white">
                                <span className="text-brand-blue mr-2">01.</span> About Me
                            </h2>
                            <div className="h-px bg-slate-800 flex-1" />
                        </motion.div>

                        <div className="space-y-5 text-lg text-slate-400 leading-relaxed">
                            <motion.p variants={fade}>
                                Hello! My name is Ayush and I enjoy creating things that live on the internet. My interest in web development started back when I decided to try editing custom Tumblr themes — turns out hacking together HTML &amp; CSS taught me a lot about architecture!
                            </motion.p>
                            <motion.p variants={fade}>
                                Fast-forward to today, and I've had the privilege of building high-performance landing pages, complex dashboards, and interactive web experiences. My main focus these days is building accessible, inclusive products and digital experiences for a variety of clients.
                            </motion.p>
                            <motion.p variants={fade}>
                                When I'm not at the computer, you can usually find me reading, exploring new tech stack architectures, or improving my design skills.
                            </motion.p>
                        </div>
                    </div>

                    {/* Image */}
                    <motion.div
                        variants={{ hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }}
                        className="relative group w-full max-w-sm mx-auto md:mx-0 justify-self-center lg:justify-self-end"
                    >
                        <div className="absolute inset-0 bg-brand-blue rounded-2xl group-hover:translate-x-2 group-hover:translate-y-2"
                            style={{ transform: 'translate(12px,12px)', transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)', zIndex: 0 }} />
                        <div className="relative z-10 rounded-2xl overflow-hidden aspect-square border-2 border-slate-700 bg-slate-800 group-hover:-translate-x-1 group-hover:-translate-y-1"
                            style={{ transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)' }}>
                            <img src="/ayush-profile.jpeg" alt="Ayush Rai"
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0"
                                style={{ transition: 'filter 0.5s ease' }}
                                loading="lazy" />
                            <div className="absolute inset-0 bg-brand-purple/20 mix-blend-multiply group-hover:opacity-0"
                                style={{ transition: 'opacity 0.3s ease' }} />
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
