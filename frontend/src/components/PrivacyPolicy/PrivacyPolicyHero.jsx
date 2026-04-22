import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldAlert } from 'lucide-react';

import PrivacyBg from '../../assets/images/privacy-policy-bg.jpg';

/**
 * Code Walkthrough: PrivacyPolicyHero.jsx
 * 
 * Purpose: A clean, professional hero for the legal foundations of the site.
 * Design: Uses the "Deep Space" rounded frame standard established in About/Services,
 * providing the required breadcrumb hierarchy (Home > Resources > Privacy Policy).
 */
const PrivacyPolicyHero = () => {
    const breadcrumbs = [
        { label: "Home", link: "/" },
        { label: "Resources", link: "#" }, 
        { label: "Privacy Policy", link: "/privacy-policy" }
    ];

    return (
        <section className="w-full bg-[#F8FAFC] px-4 md:px-8 py-4 md:py-6">
            <div className="relative w-full h-[35vh] min-h-[280px] max-h-[400px] rounded-[2rem] md:rounded-[2.5rem] flex flex-col items-center justify-center bg-[#050B14] overflow-hidden shadow-2xl">
                
                {/* Background Image with precise readable Overlays */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={PrivacyBg}
                        alt="Privacy Policy Security Background"
                        className="w-full h-full object-cover opacity-[0.35]"
                    />
                    {/* Deep gradient overlays matching the global premium vibe */}
                    <div className="absolute inset-0 bg-[#050B14]/50 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050B14]/30 to-[#050B14]/90"></div>
                </div>

                {/* Main Content Area */}
                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center"
                    >
                        {/* 🛡️ THE BADGE */}
                        <div className="mb-6">
                            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[13px] sm:text-sm font-semibold tracking-wide">
                                <ShieldAlert size={16} />
                                LEGAL FOUNDATION
                            </span>
                        </div>

                        {/* 📣 THE HEADLINE */}
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                            Privacy Policy
                        </h1>

                        {/* 🧭 BREADCRUMBS */}
                        <div className="flex items-center justify-center gap-x-3 text-white/80 text-[15px] font-medium">
                            {breadcrumbs.map((crumb, index) => (
                                <React.Fragment key={index}>
                                    <Link to={crumb.link} className="hover:text-white transition-colors">
                                        {crumb.label}
                                    </Link>
                                    {index < breadcrumbs.length - 1 && (
                                        <ChevronRight size={14} className="text-white/60" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default PrivacyPolicyHero;
