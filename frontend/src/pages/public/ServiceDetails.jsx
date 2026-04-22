/**
 * Code Walkthrough
 * This component acts as the dynamic template for all individual service pages.
 * It uses React Router's `useParams` to extract the `serviceId` (slug) from the URL.
 * It then filters the `mockServicesPageData` to locate the exact service details to render.
 * If the slug is invalid, it gracefully handles the error by displaying a "Service Not Found" state.
 */

import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, Share2, ShieldCheck, ServerCog, CloudCog, Headphones, Boxes, FileKey, Server } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useContent } from '../../context/ContentContext';

const iconMap = {
    Fingerprint: ShieldCheck, 
    ServerCog: ServerCog,
    CloudCog: CloudCog,
    Headset: Headphones,
    Boxes: Boxes,
    FileKey: FileKey,
    Server: Server,
    ShieldCheck: ShieldCheck
};

const ServiceDetails = () => {
    const { serviceId } = useParams();
    const { servicesPageData } = useContent();
    const service = servicesPageData?.servicesList?.items?.find(item => item.slug === serviceId);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [serviceId]);

    // Error Handling for invalid URLs
    if (!service) {
        return (
            <div className="min-h-screen flex flex-col pt-20 bg-slate-50">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-4xl font-bold text-[#0b1021] mb-4">Service Not Found</h1>
                    <p className="text-slate-500 mb-8 max-w-md">The service you are looking for does not exist or has been moved.</p>
                    <Link to="/services" className="px-8 py-3 bg-brand-primary text-white font-bold rounded-full hover:bg-opacity-90 transition-colors">
                        RETURN TO SERVICES
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const IconComponent = iconMap[service.icon] || ShieldCheck;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
            <Navbar />

            {/* 3. Hero Section (Dynamic) */}
            <section className="w-full bg-white px-4 md:px-8 py-4 md:py-6">
                {/* This container matches the AboutHero's height and rounded constraints */}
                <div className="relative w-full h-[50vh] min-h-[380px] max-h-[500px] rounded-[2rem] md:rounded-[2.5rem] flex flex-col items-center justify-center bg-[#050B14] overflow-hidden shadow-2xl">

                    {/* Background Layer with Exact Opacity and Gradients from Reference */}
                    <div className="absolute inset-0 z-0">
                        {service.image ? (
                            <img
                                src={service.image}
                                alt={service.title}
                                className="w-full h-full object-cover opacity-[0.35]"
                            />
                        ) : (
                            <div className="w-full h-full bg-slate-900 opacity-[0.35]"></div>
                        )}
                        <div className="absolute inset-0 bg-[#050B14]/40 mix-blend-multiply"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050B14]/30 to-[#050B14]/90"></div>
                    </div>

                    {/* Content Area - Uses max-w-4xl to keep text tight */}
                    <div className="relative z-10 text-center px-6 max-w-4xl mx-auto w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col items-center"
                        >
                            {/* 1. SERVICES Tag (Matching ServiceHero) */}
                            <div className="mb-6">
                                <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-brand-dark to-brand-primary text-white text-[13px] sm:text-sm font-semibold tracking-wide shadow-lg shadow-brand-primary/25">
                                    <Share2 size={16} strokeWidth={2.5} />
                                    SERVICES
                                </span>
                            </div>

                            {/* 2. Title - Responsive sizing from AboutHero */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-md">
                                {service.title}
                            </h1>

                            {/* 3. Breadcrumbs - Matching Reference layout */}
                            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-white/80 text-[15px] font-medium mb-8">
                                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                                <ChevronRight size={14} className="text-white/60" />
                                <Link to="/services" className="hover:text-white transition-colors">Services</Link>
                                <ChevronRight size={14} className="text-white/60" />
                                <span className="text-white/90">{service.title}</span>
                            </div>

                            {/* 4. Tagline - Standardized font-light style */}
                            <p className="text-[15px] md:text-base text-white/90 max-w-[85%] sm:max-w-2xl mx-auto leading-relaxed font-light drop-shadow-sm text-justify">
                                Enterprise-grade solutions tailored to protect and optimize your digital infrastructure.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 4. Body Content */}
            <section className="py-20 flex-grow">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                    <div className="flex flex-col lg:flex-row gap-16">

                        {/* Main Description Block */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="lg:w-2/3"
                        >
                            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
                                <h2 className="text-2xl font-bold text-black mb-6">Service Overview</h2>
                                <p className="text-slate-600 text-lg leading-relaxed text-[15.5px] text-justify">
                                    {service.description}
                                </p>

                                {/* Scalable Dynamic Grid Core */}
                                {service.cards && service.cards.length > 0 && (
                                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                                        {service.cards.map((card, idx) => {
                                            const CardIcon = iconMap[card.icon] || ShieldCheck;
                                            return (
                                                <div
                                                    key={idx}
                                                    className="p-8 rounded-[2rem] transition-all duration-300 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_20px_50px_rgba(2,161,253,0.08)] hover:-translate-y-1"
                                                >
                                                    {/* Gradient Blue Circle Icon Wrapper */}
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#02A1FD] to-[#0167F3] text-white flex items-center justify-center mb-6 shadow-md shadow-blue-500/30 overflow-hidden p-2">
                                                        {card.icon && (card.icon.startsWith('data:image') || card.icon.startsWith('/') || card.icon.startsWith('http'))
                                                            ? <img src={card.icon} alt={card.title} className="w-full h-full object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
                                                            : <CardIcon size={22} strokeWidth={2} />
                                                        }
                                                    </div>

                                                    <h3 className="text-[19px] font-bold mb-4 leading-tight text-black">
                                                        {card.title}
                                                    </h3>

                                                    <p className="text-[14.5px] leading-relaxed text-slate-600">
                                                        {card.description}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Conclusion Block */}
                                {service.conclusion && (
                                    <div className="mt-12 pt-10 border-t border-slate-100">
                                        <h3 className="text-[22px] font-bold text-black mb-6">Conclusion</h3>
                                        <p className="text-slate-700 leading-relaxed text-[15.5px] text-justify">
                                            {service.conclusion}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Sidebar: Related Services / Contact CTA */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="lg:w-1/3 space-y-8"
                        >
                            {/* Premium CTA Sidebar Card */}
                            <div className="bg-white rounded-[2.5rem] p-10 relative overflow-hidden border border-slate-100 shadow-[0_15px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_80px_-15px_rgba(2,161,253,0.12)] transition-all duration-500 group">
                                {/* Animated Decorative Elements */}
                                <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-brand-primary/10 rounded-full blur-[60px] group-hover:bg-brand-primary/20 transition-all duration-700"></div>

                                <div className="relative z-10 flex flex-col items-center">
                                    {/* Icon Wrapper */}
                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 relative group-hover:scale-110 transition-transform duration-500 shadow-sm border border-slate-100">
                                        <Headphones size={30} className="text-brand-primary" strokeWidth={1.5} />
                                    </div>

                                    <h3 className="text-[22px] font-bold text-black mb-4 tracking-tight leading-tight text-center">
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

                            {/* Menu: All Services List */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                                <h3 className="text-lg font-bold text-[#0b1021] mb-6">Our Services</h3>
                                <div className="flex flex-col space-y-2">
                                    {servicesPageData?.servicesList?.items?.map((srv) => (
                                        <Link
                                            key={srv.id}
                                            to={`/services/${srv.slug}`}
                                            className={`p-3 rounded-xl flex items-center justify-between transition-colors ${srv.id === service.id ? 'bg-brand-primary/10 text-brand-primary font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-brand-primary'}`}
                                        >
                                            <span className="text-sm">{srv.title}</span>
                                            <ChevronRight size={14} className={srv.id === service.id ? "opacity-100" : "opacity-0"} />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};


export default ServiceDetails;
