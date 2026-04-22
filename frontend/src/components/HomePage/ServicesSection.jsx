import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Cloud, Server, Lock, Code, ArrowRight, ChevronLeft, ChevronRight, Fingerprint, ServerCog, CloudCog, Headphones, Boxes, FileKey, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { useContent } from '../../context/ContentContext';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const iconMap = {
    Fingerprint: Fingerprint,
    ServerCog: ServerCog,
    CloudCog: CloudCog,
    Headset: Headphones,
    Boxes: Boxes,
    FileKey: FileKey,
    Server: Server,
    ShieldCheck: ShieldCheck
};

const ServicesSection = () => {
    const { servicesPageData } = useContent();
    const serviceIntro = servicesPageData?.serviceIntro;
    const servicesItems = servicesPageData?.servicesList?.items || [];

    const [swiperInstance, setSwiperInstance] = useState(null);
    const [activeCard, setActiveCard] = useState(null);

    if (!servicesPageData) return null;

    return (
        <section className="py-24 md:py-22 bg-slate-50 relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-dark/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
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
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary">{serviceIntro?.tag || 'Our Expertise'}</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">
                            {serviceIntro?.heading ? (
                                <>
                                    {serviceIntro.heading.split('.').map((part, i) => (
                                        <React.Fragment key={i}>
                                            {part}
                                            {i === 0 && <br />}
                                        </React.Fragment>
                                    ))}
                                </>
                            ) : (
                                <>
                                    One Place for All <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-dark">
                                        Solutions
                                    </span>
                                </>
                            )}
                        </h2>
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
                            className="w-14 h-14 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:text-brand-primary transition-all duration-300 focus:outline-none relative group"
                            style={{
                                backgroundOrigin: "border-box",
                                backgroundClip: "padding-box, border-box"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundImage = "linear-gradient(white, white), linear-gradient(to right, #2563eb, #02a1fd)";
                                e.currentTarget.style.borderColor = "transparent";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundImage = "none";
                                e.currentTarget.style.borderColor = "#e2e8f0"; // slate-200
                            }}
                            aria-label="Previous service"
                        >
                            <ChevronLeft size={28} className="relative z-10 transition-transform group-hover:-translate-x-0.5" />
                        </button>
                        <button
                            onClick={() => swiperInstance?.slideNext()}
                            className="w-14 h-14 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:text-brand-primary transition-all duration-300 focus:outline-none relative group"
                            style={{
                                backgroundOrigin: "border-box",
                                backgroundClip: "padding-box, border-box"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundImage = "linear-gradient(white, white), linear-gradient(to right, #2563eb, #02a1fd)";
                                e.currentTarget.style.borderColor = "transparent";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundImage = "none";
                                e.currentTarget.style.borderColor = "#e2e8f0"; // slate-200
                            }}
                            aria-label="Next service"
                        >
                            <ChevronRight size={28} className="relative z-10 transition-transform group-hover:translate-x-0.5" />
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
                        {servicesItems.map((service) => {
                            const IconComp = iconMap[service.icon] || ShieldCheck;
                            return (
                                <SwiperSlide key={service.id} className="h-auto">
                                    <div
                                        className="relative w-full h-[520px] rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-xl"
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
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-dark to-brand-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-brand-dark/40 overflow-hidden p-2">
                                                    {service.icon?.startsWith('data:image') || service.icon?.startsWith('/') || service.icon?.startsWith('http')
                                                        ? <img src={service.icon} alt="" className="w-full h-full object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
                                                        : <IconComp size={20} />
                                                    }
                                                </div>
                                            </div>

                                            {/* Hidden Content: Appears on Hover */}
                                            <div className={`transform transition-all duration-500 delay-100 mt-6 flex flex-col ${activeCard === service.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0'}`}>
                                                <p className="text-gray-200 text-sm leading-relaxed mb-6 line-clamp-3 text-justify">
                                                    {service.description}
                                                </p>
                                                {/* Pill-shaped Outline Learn More Button */}
                                                <Link
                                                    to={`/services/${service.slug}`}
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
                            );
                        })}
                    </Swiper>
                </motion.div>
            </div>
        </section>
    );
};

export default ServicesSection;
