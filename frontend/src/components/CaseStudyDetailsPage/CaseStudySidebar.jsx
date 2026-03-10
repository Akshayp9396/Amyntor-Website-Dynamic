import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PhoneCall, Mail } from 'lucide-react';

/**
 * Code Walkthrough
 * A sticky right-hand sidebar for the Case Study Detail page.
 * Provides immediate Call-To-Action pathways for users inspired by the case study.
 */
const CaseStudySidebar = () => {
    return (
        <div className="sticky top-32 flex flex-col gap-6">

            {/* Primary CTA Box */}
            <div className="bg-brand-primary rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-brand-primary/20">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-dark/40 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-4 leading-tight">Need a Similar Solution?</h3>
                    <p className="text-white/80 mb-8 font-light leading-relaxed">
                        Our engineering team is ready to architect a custom, secure, and scalable infrastructure tailored exactly to your operational needs.
                    </p>

                    <Link to="/contact" className="w-full bg-white text-brand-primary hover:bg-slate-50 px-6 py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-colors shadow-lg">
                        Start Your Project
                        <ArrowRight size={18} strokeWidth={2.5} />
                    </Link>
                </div>
            </div>

            {/* Quick Contact Info */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                <h4 className="font-bold text-[#0b1021] mb-6">Quick Contact</h4>

                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-brand-primary shrink-0">
                            <PhoneCall size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Call Us</p>
                            <a href="tel:+914712080478" className="text-sm font-bold text-slate-700 hover:text-brand-primary transition-colors">+91 471 2080 478</a>
                        </div>
                    </div>

                    <div className="w-full h-[1px] bg-slate-100 my-2"></div>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-brand-primary shrink-0">
                            <Mail size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Email Us</p>
                            <a href="mailto:Info@amyntortech.com" className="text-sm font-bold text-slate-700 hover:text-brand-primary transition-colors">Info@amyntortech.com</a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default CaseStudySidebar;
