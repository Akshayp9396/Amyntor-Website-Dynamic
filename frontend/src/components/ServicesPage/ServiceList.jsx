import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Fingerprint, ServerCog, CloudCog, Headphones, Boxes, FileKey, ArrowRight, CheckCircle2 } from 'lucide-react';
import { mockServicesPageData } from './servicesData';

/**
 * Code Walkthrough
 * This component renders the massive Service List grid (6 cards).
 * Features an intelligent glassmorphism icon housing and complex responsive hover effects.
 * Matches the user-provided layout consisting of white cards with "Explore More" actions.
 */

const iconMap = {
    Fingerprint: Fingerprint,
    ServerCog: ServerCog,
    CloudCog: CloudCog,
    Headset: Headphones,
    Boxes: Boxes,
    FileKey: FileKey
};

const ServiceList = () => {
    const { servicesList } = mockServicesPageData;
    const navigate = useNavigate();

    // Framer motion variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeInOut" } }
    };

    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">

                {/* Header Section */}
                <div className="flex flex-col items-center text-center space-y-6 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-brand-primary/30 bg-white shadow-sm"
                    >
                        <CheckCircle2 size={16} strokeWidth={2.5} className="text-brand-primary" />
                        <span className="text-brand-primary text-sm font-semibold tracking-wide">{servicesList.tag}</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl md:text-2xl lg:text-3xl font-semibold text-[#0b1021] leading-snug max-w-3xl tracking-tight"
                    >
                        {servicesList.heading}
                    </motion.h2>
                </div>

                {/* Services Grid layout */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "0px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {servicesList.items.map((service, idx) => {
                        const IconComponent = iconMap[service.icon] || ShieldCheck;

                        // Limit to approx 140 characters and add ellipsis
                        const previewText = service.description.length > 140
                            ? service.description.substring(0, 140).trim() + '...'
                            : service.description;

                        return (
                            <motion.div
                                key={service.id}
                                variants={cardVariants}
                                whileHover={{ y: -8 }}
                                onClick={() => navigate(`/services/${service.slug}`)}
                                className="group relative bg-white/80 rounded-[2rem] p-8 md:p-10 flex flex-col items-center text-center shadow-sm border-[3px] border-transparent overflow-hidden hover:shadow-[0_20px_40px_rgba(2,161,253,0.08)] hover:bg-white/40 hover:backdrop-blur-2xl hover:border-white/70 cursor-pointer active:scale-[0.98]"
                                style={{ transition: "box-shadow 0.5s, background-color 0.5s, backdrop-filter 0.5s, border-color 0.5s, transform 0.2s" }}
                            >

                                {/* Sleek Minimalist Icon Ring */}
                                <div className="relative w-24 h-24 mb-8 rounded-full flex items-center justify-center bg-transparent border-[1.5px] border-gray-100 transition-transform duration-500 group-hover:scale-110 group-hover:border-brand-primary/20 z-10">
                                    <IconComponent size={40} strokeWidth={1.5} className="text-brand-primary transition-opacity duration-500 group-hover:opacity-80" />
                                </div>

                                {/* Title */}
                                <h3 className="text-[22px] font-bold text-[#0b1021] mb-5 leading-snug z-10 relative">
                                    {service.title}
                                </h3>

                                {/* Description */}
                                <p className="text-slate-500 text-[15px] leading-relaxed flex-grow z-10 relative text-justify">
                                    {previewText}
                                </p>

                                {/* Action Button */}
                                <div
                                    className="mt-8 w-full py-3 px-6 rounded-full border border-gray-200 bg-white text-[#0b1021] text-[11px] tracking-[0.2em] font-bold flex items-center justify-center gap-3 transition-all duration-300 group-hover:bg-brand-primary group-hover:border-brand-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-primary/30 z-10 relative"
                                >
                                    EXPLORE MORE
                                    <ArrowRight size={14} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-1" />
                                </div>

                            </motion.div>
                        );
                    })}
                </motion.div>

            </div>
        </section>
    );
};

export default ServiceList;
