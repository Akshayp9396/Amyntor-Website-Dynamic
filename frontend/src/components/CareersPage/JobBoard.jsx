import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Clock, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '../../context/ContentContext';

const JobBoard = () => {
    const { careersPageData } = useContent();
    const { openRoles } = careersPageData || { openRoles: [] };

    return (
        <section id="open-roles-section" className="py-24 bg-[#F5F8FA]">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">

                <div className="mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0b1021] mb-4">
                        Current Openings
                    </h2>
                    <p className="text-lg text-[#0b1021]/80 font-medium">
                        <span className="font-bold text-brand-primary">{openRoles.length}</span> Jobs Listed
                    </p>
                </div>

                <div className="flex flex-col space-y-6">
                    {openRoles.map((role, index) => (
                        <motion.div
                            key={role.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group relative bg-white/60 backdrop-blur-xl border border-white rounded-3xl p-6 md:p-8 lg:p-10 shadow-sm hover:shadow-xl hover:bg-white transition-all duration-300"
                        >
                            {/* Card background/shadow defines the hover */}

                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">

                                {/* Job Meta Information */}
                                <div className="flex-grow">
                                    <div className="flex flex-wrap items-center gap-3 mb-4">
                                        <span className="px-4 py-1.5 rounded-full bg-blue-50 text-brand-primary text-xs font-bold uppercase tracking-wider">
                                            {role.category}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-[#0b1021]/70 text-sm font-medium">
                                            <Calendar size={14} />
                                            <span>Posted: {new Date(role.postedDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl md:text-3xl font-bold text-[#0b1021] mb-6 transition-colors duration-300">
                                        {role.title}
                                    </h3>

                                    <div className="flex flex-wrap items-center gap-6">
                                        <div className="flex items-center gap-2 text-[#0b1021]/80 font-medium">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#0b1021]/60 transition-colors">
                                                <Users size={16} />
                                            </div>
                                            <span>{role.openings} Opening{role.openings !== 1 ? 's' : ''}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[#0b1021]/80 font-medium">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#0b1021]/60 transition-colors">
                                                <Clock size={16} />
                                            </div>
                                            <span>{role.experience} Experience</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Call to Action Button */}
                                <div className="flex-shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-8">
                                    <Link
                                        to={`/careers/${role.slug}`}
                                        className="group/btn inline-flex items-center gap-3 px-8 py-4 rounded-full bg-slate-50 border border-slate-200 text-[#0b1021] font-bold overflow-hidden transition-all duration-300 hover:bg-slate-200 hover:border-slate-300 focus:outline-none w-full lg:w-auto justify-center"
                                    >
                                        <span className="relative z-10">More Details</span>
                                        <div className="relative z-10 w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#0b1021] transition-transform duration-300 group-hover/btn:translate-x-1 shadow-sm">
                                            <ArrowRight size={14} className="stroke-[3]" />
                                        </div>
                                    </Link>
                                </div>

                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default JobBoard;
