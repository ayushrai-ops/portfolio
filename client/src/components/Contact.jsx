import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import MagneticButton from './MagneticButton';

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('idle');

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) return;
        setStatus('submitting');
        try {
            const res = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) { setStatus('success'); setFormData({ name: '', email: '', message: '' }); }
            else setStatus('error');
        } catch { setStatus('error'); }
        if (status === 'error') setTimeout(() => setStatus('idle'), 4000);
    };

    const inputClass = 'w-full bg-slate-950/60 border border-slate-700/50 rounded-xl px-4 py-4 text-white placeholder-transparent peer focus:outline-none focus:border-brand-blue';
    const labelClass = 'absolute left-4 top-2 text-xs text-brand-blue peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-brand-blue';

    return (
        <section id="contact" className="py-24 relative z-10">
            <div className="max-w-4xl mx-auto px-6 sm:px-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                        Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple">Touch</span>
                    </h2>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto">
                        Currently open to new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="glass-card p-8 md:p-12 rounded-2xl relative overflow-hidden"
                >
                    {status === 'success' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-[#0c1222]/95 z-20 flex flex-col items-center justify-center">
                            <CheckCircle size={56} className="text-emerald-400 mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                            <p className="text-slate-400 text-center px-6">Thank you for reaching out. I will get back to you shortly.</p>
                            <button onClick={() => setStatus('idle')}
                                className="mt-8 px-6 py-2 border border-slate-700 text-slate-300 rounded-full hover:bg-slate-800" style={{ transition: 'background 0.2s ease' }}>
                                Send Another
                            </button>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="relative">
                                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className={inputClass} placeholder="Name" style={{ transition: 'border-color 0.2s ease' }} />
                                <label htmlFor="name" className={labelClass} style={{ transition: 'all 0.2s ease' }}>Name</label>
                            </div>
                            <div className="relative">
                                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder="Email" style={{ transition: 'border-color 0.2s ease' }} />
                                <label htmlFor="email" className={labelClass} style={{ transition: 'all 0.2s ease' }}>Email</label>
                            </div>
                        </div>

                        <div className="relative">
                            <textarea name="message" id="message" value={formData.message} onChange={handleChange} required rows={5}
                                className={`${inputClass} resize-none`} placeholder="Message" style={{ transition: 'border-color 0.2s ease' }} />
                            <label htmlFor="message" className={labelClass} style={{ transition: 'all 0.2s ease' }}>Message</label>
                        </div>

                        {status === 'error' && (
                            <div className="flex items-center gap-2 text-red-400 text-sm">
                                <AlertCircle size={16} /> Something went wrong. Please try again.
                            </div>
                        )}

                        <MagneticButton className="w-full">
                            <button type="submit" disabled={status === 'submitting'}
                                className="ripple-btn w-full py-4 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold rounded-xl flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                                style={{ transition: 'transform 0.2s ease, opacity 0.2s ease' }}>
                                {status === 'submitting' ? 'Sending...' : 'Send Message'}
                                {status !== 'submitting' && <Send size={16} />}
                            </button>
                        </MagneticButton>
                    </form>
                </motion.div>
            </div>
        </section>
    );
}
