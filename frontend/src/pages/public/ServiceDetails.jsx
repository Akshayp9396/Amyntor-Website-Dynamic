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
import { ChevronRight, ArrowRight, ShieldCheck, ServerCog, CloudCog, Headphones, Boxes, FileKey } from 'lucide-react';
import { mockServicesPageData } from '../../components/ServicesPage/servicesData';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const iconMap = {
    Fingerprint: ShieldCheck, // Fallbacks
    ServerCog: ServerCog,
    CloudCog: CloudCog,
    Headset: Headphones,
    Boxes: Boxes,
    FileKey: FileKey
};

const ServiceDetails = () => {
    // 1. Data Fetching via React Router params
    const { serviceId } = useParams();

    // 2. Filter Logic to map the slug to the actual service object
    const service = mockServicesPageData.servicesList.items.find(item => item.slug === serviceId);

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
                        <img
                            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b"
                            alt={service.title}
                            className="w-full h-full object-cover opacity-[0.35]"
                        />
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
                            {/* 1. Amyntor Tag (Matching image_413e24.jpg & About style) */}
                            <div className="mb-6">
                                <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#02A1FD] to-[#0167F3] text-white text-[13px] sm:text-sm font-semibold tracking-wide shadow-lg shadow-brand-primary/25">
                                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                    Amyntor
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
                                <span className="text-[#02A1FD]">{service.title}</span>
                            </div>

                            {/* 4. Tagline - Standardized font-light style */}
                            <p className="text-[15px] md:text-base text-white/90 max-w-[85%] sm:max-w-2xl mx-auto leading-relaxed font-light drop-shadow-sm">
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
                                <h2 className="text-2xl font-bold text-[#0b1021] mb-6">Service Overview</h2>
                                <p className="text-slate-600 text-lg leading-relaxed text-justify">
                                    {service.description}
                                </p>

                                {/* Placeholder Content Block for further details */}
                                <div className="mt-12 pt-12 border-t border-slate-100 grid md:grid-cols-2 gap-8">
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <h3 className="font-bold text-[#0b1021] mb-3">Key Benefits</h3>
                                        <ul className="space-y-3 text-slate-600">
                                            <li className="flex items-start gap-2"><CheckCircle2 className="text-brand-primary mt-1 shrink-0" size={16} /> Scalable architecture to grow with your needs</li>
                                            <li className="flex items-start gap-2"><CheckCircle2 className="text-brand-primary mt-1 shrink-0" size={16} /> 24/7 proactive monitoring and rapid response</li>
                                            <li className="flex items-start gap-2"><CheckCircle2 className="text-brand-primary mt-1 shrink-0" size={16} /> Ensure complete data privacy and regulatory compliance</li>
                                        </ul>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <h3 className="font-bold text-[#0b1021] mb-3">Our Approach</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            We employ a systematic, framework-driven methodology to guarantee the highest level of execution. By aligning tightly with global standards, we ensure operational resilience and strategic technology advantages for our partners.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Sidebar: Related Services / Contact CTA */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="lg:w-1/3 space-y-8"
                        >
                            {/* CTA Box */}
                            <div className="bg-[#0b1021] rounded-3xl p-8 text-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-brand-primary/10 transition-opacity duration-300 group-hover:bg-brand-primary/20"></div>
                                <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Need a Custom Solution?</h3>
                                <p className="text-slate-300 mb-8 relative z-10 text-sm">
                                    Speak directly with our engineering team to architect a solution perfectly fitted to your enterprise.
                                </p>
                                <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-3 bg-brand-primary text-white font-bold text-sm tracking-wider rounded-full hover:bg-white hover:text-brand-primary transition-all duration-300 relative z-10 shadow-[0_0_20px_rgba(2,161,253,0.3)]">
                                    GET IN TOUCH <ArrowRight size={16} />
                                </Link>
                            </div>

                            {/* Menu: All Services List */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                                <h3 className="text-lg font-bold text-[#0b1021] mb-6">Our Services</h3>
                                <div className="flex flex-col space-y-2">
                                    {mockServicesPageData.servicesList.items.map((srv) => (
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

// Required missing import addition
const CheckCircle2 = ({ className, size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);

export default ServiceDetails;
