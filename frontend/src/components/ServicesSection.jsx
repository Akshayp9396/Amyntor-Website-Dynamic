import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Cloud, Server, Lock, Code, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import service images
import Service1Image from '../assets/images/service1.jpg';
import Service2Image from '../assets/images/service2.jpg';
import Service3Image from '../assets/images/service3.jpg';
import Service4Image from '../assets/images/service4.jpg';
import Service5Image from '../assets/images/service5.jpg';

/**
 * Code Walkthrough
 * This component renders the Services Section on the Home Page.
 * It features an auto-playing carousel using Swiper.js.
 * Each slide displays a service card with a custom glassmorphism hover effect.
 * The card's overlay expands on hover to reveal description text and a "Learn More" CTA.
 */

const mockServicesData = [
    {
        id: 1,
        title: "IT Infrastructure",
        description: "Secure, scalable IT infrastructure solutions for networks, servers, data centers, virtualization, and business continuity support.",
        icon: Shield,
        image: Service1Image
    },
    {
        id: 2,
        title: "Cloud and DevOps",
        description: "We deliver cloud and DevOps solutions to build scalable, secure systems, enabling faster development and seamless collaboration.",
        icon: Cloud,
        image: Service2Image
    },
    {
        id: 3,
        title: "Cyber Security",
        description: "Cybersecurity services including Red Teaming, VAPT, SOC monitoring, compliance, and security training to protect businesses.",
        icon: Server,
        image: Service3Image
    },
    {
        id: 4,
        title: "Managed Services",
        description: "Managed IT and security services with 24/7 monitoring, cloud management, backup, support, and threat protection for businesses.",
        icon: Lock,
        image: Service4Image
    },
    {
        id: 5,
        title: "Digital Personal Data Protection",
        description: "DPDP Act 2023 compliance services ensuring data privacy, security, and seamless regulatory adherence for your business.",
        icon: Code,
        image: Service5Image
    }
];

const ServicesSection = () => {
    const [swiperInstance, setSwiperInstance] = useState(null);
    const [activeCard, setActiveCard] = useState(null);

    return (
        <section className="py-24 md:py-22 bg-slate-50 relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-dark/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                {/* Section Header & Navigation */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "0px" }}
                        transition={{ duration: 0.6 }}
                        className="max-w-2xl"
                    >
                        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-brand-dark/20 bg-gradient-to-r from-brand-dark/10 to-brand-primary/10 text-sm font-semibold mb-4">
                            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-brand-dark to-brand-primary animate-pulse"></span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary">Our Expertise</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">
                            One Place for All <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-dark">
                                Solutions
                            </span>
                        </h2>
                        {/* <p className="text-slate-600 text-lg">
                            We deliver end-to-end IT and cybersecurity solutions designed to propel your business forward with confidence and resilience.
                        </p> */}
                    </motion.div>

                    {/* Custom Nav Buttons */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex space-x-4 shrink-0"
                    >
                        <button
                            onClick={() => swiperInstance?.slidePrev()}
                            className="w-14 h-14 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:text-white hover:border-transparent relative overflow-hidden group transition-all auto-hover-fix focus:outline-none"
                            aria-label="Previous service"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark to-brand-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <ChevronLeft size={24} className="relative z-10" />
                        </button>
                        <button
                            onClick={() => swiperInstance?.slideNext()}
                            className="w-14 h-14 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:text-white hover:border-transparent relative overflow-hidden group transition-all auto-hover-fix focus:outline-none"
                            aria-label="Next service"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark to-brand-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <ChevronRight size={24} className="relative z-10" />
                        </button>
                    </motion.div>
                </div>

                {/* Swiper Carousel */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px" }}
                    transition={{ duration: 0.8 }}
                >
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        onSwiper={setSwiperInstance}
                        spaceBetween={30}
                        slidesPerView={1}
                        loop={true}
                        speed={1500} // Increased for a very luxurious, fluid slide
                        autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="pb-12" // Padding bottom for shadow clearance
                    >
                        {mockServicesData.map((service) => (
                            <SwiperSlide key={service.id} className="h-auto">
                                <div
                                    className="relative w-full h-[450px] rounded-[2rem] overflow-hidden group cursor-pointer shadow-xl"
                                    onMouseEnter={() => setActiveCard(service.id)}
                                    onMouseLeave={() => setActiveCard(null)}
                                    onClick={() => setActiveCard(service.id)}
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
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-dark to-brand-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-brand-dark/40">
                                                <service.icon size={20} />
                                            </div>
                                        </div>

                                        {/* Hidden Content: Appears on Hover */}
                                        <div className={`transform transition-all duration-500 delay-100 mt-6 flex flex-col ${activeCard === service.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0'}`}>
                                            <p className="text-gray-200 text-sm leading-relaxed mb-6 line-clamp-3 text-justify">
                                                {service.description}
                                            </p>
                                            {/* Pill-shaped Outline Learn More Button */}
                                            <Link
                                                to="/services"
                                                onClick={(e) => {
                                                    if (activeCard !== service.id) {
                                                        e.preventDefault();
                                                        setActiveCard(service.id);
                                                    }
                                                }}
                                                className="inline-flex items-center space-x-2 text-white border border-white/40 rounded-full px-5 py-2 hover:bg-white/10 transition-colors font-medium group/btn w-fit backdrop-blur-sm"
                                            >
                                                <span className="text-sm">Learn More</span>
                                                <ArrowRight size={16} className="transform group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>

                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </motion.div>
            </div>
        </section>
    );
};

export default ServicesSection;
