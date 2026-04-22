import React from 'react';
import { useContent } from '../../context/ContentContext';

/**
 * Code Walkthrough: PartnersList.jsx (Compact Architectural Edition)
 * 
 * Purpose: A streamlined, low-profile display of strategic partners.
 * Design: 
 * - Switched back to Clean White theme as requested.
 * - Compact Layout: Merges logo and title into a top header row to reduce total card height.
 * - 3-Column Grid: Maintains breadth while feeling much shorter and tighter.
 */
const PartnersList = () => {
    const { partners } = useContent();

    return (
        <section className="py-24 bg-white font-sans">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">

                {/* 🏗️ MASTER SYNC: BRANDED CENTRED HEADER */}
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#EEF4FF] border border-[#D1E0FF] w-fit mb-6">
                        <span className="w-2 h-2 rounded-full bg-brand-primary"></span>
                        <span className="text-brand-primary font-bold text-[11px] uppercase tracking-[0.3em]">
                            Strategic Network
                        </span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-extrabold text-[#0F172A] leading-tight tracking-tight max-w-4xl">
                        Powering Enterprise Resilience through <br className="hidden md:block" />
                        World-Class Technological Partnerships
                    </h2>
                </div>

                {/* 🧭 COMPACT ARCHITECTURAL GRID (3-Columns) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {partners.map((partner, idx) => (
                        <div
                            key={partner.id || idx}
                            className="flex flex-col p-6 bg-white border border-slate-200 rounded-[1.5rem] transition-all duration-300 group"
                        >
                            {/* TOP HEADER: Logo and Title merged to save space */}
                            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-50">
                                <div className="w-16 h-12 flex-shrink-0 flex items-center justify-center p-3 bg-slate-50 rounded-xl border border-slate-100 transition-all duration-500 group-hover:bg-white">
                                    <img
                                        src={partner.logo}
                                        alt={partner.name}
                                        className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                                    />
                                </div>
                                <h4 className="text-lg font-black text-slate-800 tracking-tight leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-dark group-hover:to-brand-primary transition-all duration-300">
                                    {partner.name}
                                </h4>
                            </div>

                            {/* DESCRIPTION: Tucked neatly below */}
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                {partner.description || "Synthesizing world-class infrastructure management with advanced security protocols for total operational resilience."}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default PartnersList;
