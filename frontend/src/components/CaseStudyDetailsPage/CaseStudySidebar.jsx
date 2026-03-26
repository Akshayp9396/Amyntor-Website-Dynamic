import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Headphones } from 'lucide-react';

/**
 * Code Walkthrough
 * A sticky right-hand sidebar for the Case Study Detail page.
 * Provides a localized, premium Call-To-Action (CTA) for users inspired by the case study.
 * Redesigned to feature a minimalist white-background card with a gradient "GET IN TOUCH" button.
 */
const CaseStudySidebar = () => {
    return (
        <div className="sticky top-32 flex flex-col gap-6">

            {/* Premium CTA Sidebar Card */}
            <div className="bg-white rounded-[2.5rem] p-10 relative overflow-hidden border border-slate-100 shadow-[0_15px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_80px_-15px_rgba(2,161,253,0.12)] transition-all duration-500 group">
                {/* Animated Decorative Elements */}
                <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-brand-primary/10 rounded-full blur-[60px] group-hover:bg-brand-primary/20 transition-all duration-700"></div>

                <div className="relative z-10 flex flex-col items-center text-center">
                    {/* Icon Wrapper */}
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 relative group-hover:scale-110 transition-transform duration-500 shadow-sm border border-slate-100">
                        <Headphones size={30} className="text-brand-primary" strokeWidth={1.5} />
                    </div>

                    <h3 className="text-[22px] font-bold text-black mb-4 tracking-tight leading-tight">
                        Need a Custom Solution?
                    </h3>
                    
                    <p className="text-slate-500 text-[14.5px] leading-relaxed text-justify mb-10 w-full opacity-90">
                        Speak directly with our engineering team to architect a solution perfectly fitted to your enterprise.
                    </p>

                    <Link 
                        to="/contact" 
                        className="w-fit inline-flex items-center justify-center gap-2.5 py-3.5 px-10 bg-white border border-slate-200 rounded-full font-bold tracking-widest text-sm hover:border-brand-primary hover:-translate-y-1 transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] hover:shadow-brand-primary/10 group/btn"
                    >
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary">
                            GET IN TOUCH
                        </span>
                        <ArrowRight size={18} className="text-brand-primary group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

        </div>
    );
};

export default CaseStudySidebar;
