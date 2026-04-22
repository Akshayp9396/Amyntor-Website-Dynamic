import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Clock, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '../../context/ContentContext';

const JobBoard = () => {
    const { careersPageData } = useContent();
    const allRoles = careersPageData?.openRoles || [];
    const openRoles = allRoles.filter(role => role.is_active);

    return (
        <section id="open-roles-section" className="py-24 bg-[#F5F8FA]">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">

                <div className="mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0b1021] mb-4">
                        Current Openings
                    </h2>
                    <p className="text-lg text-[#0b1021]/80 font-medium tracking-tight">
                        <span className="font-bold text-[#0b1021]">{openRoles.length}</span> Jobs Listed
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {openRoles.length > 0 ? openRoles.map((role) => (
                        <div
                            key={role.id}
                            className="relative bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex flex-col h-full transition-all duration-300"
                        >
                            {/* Job Meta Info */}
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                    {role.category}
                                </span>
                                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                                    <Calendar size={12} />
                                    <span>{new Date(role.postedDate).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-[#0b1021] mb-auto leading-tight">
                                {role.title}
                            </h3>

                            {/* Job Brief Details */}
                            <div className="mt-8 pt-6 border-t border-slate-50 space-y-4">
                                <div className="flex items-center gap-3 text-[#0b1021]/70 font-bold text-[11px] uppercase tracking-wider">
                                    <Users size={14} className="text-slate-400" />
                                    <span>{role.openings} Opening{role.openings !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex items-center gap-3 text-[#0b1021]/70 font-bold text-[11px] uppercase tracking-wider">
                                    <Clock size={14} className="text-slate-400" />
                                    <span>{role.experience} EXP</span>
                                </div>
                            </div>

                            {/* Button Section */}
                            <div className="mt-8">
                                <Link
                                    to={`/careers/${role.slug}`}
                                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-slate-50 border border-slate-100 text-[#0b1021] text-sm font-bold transition-transform duration-300 hover:scale-[1.03]"
                                >
                                    <span>View Details</span>
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                                <Users size={32} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-400 mb-2 tracking-tight">No positions available currently.</h3>
                            <p className="text-slate-400 font-medium max-w-sm mx-auto text-sm leading-relaxed">We're always growing! Check back soon or follow us for future opportunities.</p>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
};

export default JobBoard;
