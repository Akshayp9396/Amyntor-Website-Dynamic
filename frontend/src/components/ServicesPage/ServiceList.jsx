import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Fingerprint, ServerCog, CloudCog, Headphones, Boxes, FileKey, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

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
    const { servicesPageData } = useContent();
    const servicesList = servicesPageData?.servicesList || { items: [] };
    const navigate = useNavigate();
    const [activeCard, setActiveCard] = useState(null);

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
                        className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#EEF4FF] border border-[#D1E0FF] shadow-sm"
                    >
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-brand-dark to-brand-primary"></div>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary font-semibold text-sm uppercase tracking-[0.2em]">{servicesList.tag}</span>
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
                                className="h-[450px]"
                            >
                                <div
                                    className="relative w-full h-[450px] rounded-[2rem] overflow-hidden group cursor-pointer shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:shadow-brand-primary/20"
                                    onMouseEnter={() => setActiveCard(service.id)}
                                    onMouseLeave={() => setActiveCard(null)}
                                    onClick={() => navigate(`/services/${service.slug}`)}
                                >
                                    {/* Image Background */}
                                    <div className="absolute inset-0 w-full h-full">
                                        <img
                                            src={service.image}
                                            alt={service.title}
                                            className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${activeCard === service.id ? 'scale-110' : ''}`}
                                        />
                                    </div>

                                    {/* Dark Gradient Overlay for base text readability */}
                                    <div className={`absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent transition-opacity duration-500 ${activeCard === service.id ? 'opacity-90' : 'opacity-80 group-hover:opacity-90'}`} />

                                    {/* Dynamic Glassmorphism Content Box (Expands on Hover) */}
                                    <div className={`absolute bottom-4 left-4 right-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 flex flex-col justify-start overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-20 shadow-2xl ${activeCard === service.id ? 'h-[260px]' : 'h-[90px] group-hover:h-[260px]'}`}>

                                        {/* Always Visible: Title and Icon */}
                                        <div className="flex items-center justify-between shrink-0 h-[42px]">
                                            <h3 className="text-xl md:text-xl font-bold text-white pr-4">{service.title}</h3>
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#02A1FD] to-[#0167F3] flex items-center justify-center text-white shrink-0 shadow-lg shadow-brand-primary/40 overflow-hidden">
                                                {service.icon && (service.icon.startsWith('data:image') || service.icon.startsWith('/') || service.icon.startsWith('http')) 
                                                    ? <img src={service.icon} alt={service.title} className="w-full h-full object-contain p-2" />
                                                    : <IconComponent size={20} />
                                                }
                                            </div>
                                        </div>

                                        {/* Hidden Content: Appears on Hover */}
                                        <div className={`transform transition-all duration-500 delay-100 mt-6 flex flex-col ${activeCard === service.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0'}`}>
                                            <p className="text-gray-200 text-sm leading-relaxed mb-6 line-clamp-3 text-justify">
                                                {previewText}
                                            </p>
                                            <div className="inline-flex items-center space-x-2 text-white border border-white/40 rounded-full px-5 py-2 hover:bg-white/10 transition-colors font-medium group/btn w-fit backdrop-blur-sm">
                                                <span className="text-sm">Explore More</span>
                                                <ArrowRight size={16} className="transform group-hover/btn:translate-x-1 transition-transform" />
                                            </div>
                                        </div>

                                    </div>
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
