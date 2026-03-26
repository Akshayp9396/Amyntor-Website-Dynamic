import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

const ContactBranches = () => {
    const { contactPageData } = useContent();

    if (!contactPageData) return null;

    const { branches } = contactPageData;

    return (
        <section className="py-20 bg-slate-50 border-t border-slate-100">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 text-center">

                {/* Header Sequence */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-white mb-6 shadow-sm">
                    <span className="w-4 h-4 rounded-full bg-gradient-to-br from-brand-dark to-brand-primary flex items-center justify-center">
                        <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    </span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-dark to-brand-primary text-sm font-bold uppercase tracking-wider">{branches.tag}</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-[#0b1021] mb-6 tracking-tight">
                    {branches.title}
                </h2>

                <p className="text-slate-500 max-w-2xl mx-auto mb-16 text-lg leading-relaxed">
                    {branches.description}
                </p>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {branches.cards.map((branch, idx) => (
                        <div key={branch.id || idx} className="bg-white rounded-[2.5rem] p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-300">

                            {/* Circular Image with Dotted Border */}
                            <div className="mx-auto w-48 h-48 rounded-full border-[1.5px] border-dashed border-brand-primary p-2 mb-8">
                                <div className="w-full h-full rounded-full overflow-hidden">
                                    <img src={branch.image} alt={branch.city} className="w-full h-full object-cover grayscale-[20%] transition-transform duration-500 hover:scale-110" />
                                </div>
                            </div>

                            {/* Info */}
                            <h3 className="text-2xl font-bold text-[#0b1021] mb-3">{branch.city}</h3>
                            <h4 className="text-[11px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-dark to-brand-primary tracking-[0.2em] uppercase mb-6 flex flex-col items-center">
                                {branch.type}
                                <span className="w-8 h-[2px] bg-brand-primary/30 mt-3 block"></span>
                            </h4>

                            <p className="text-slate-500 text-[15px] leading-relaxed mb-6 min-h-[4.5rem]">
                                {branch.address}
                            </p>

                            <div className="flex flex-col items-center gap-2 text-slate-500 text-[15px]">
                                <span>{branch.phone}</span>
                                <span>{branch.email}</span>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default ContactBranches;
