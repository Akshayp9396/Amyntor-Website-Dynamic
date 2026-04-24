import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import { motion } from 'framer-motion';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

/**
 * Code Walkthrough
 * This component renders the Testimonials Section on the Home Page.
 * Now pulling dynamic data from ContentContext.
 */

const mockAvatars = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

// SVG component for the decorative hand-drawn arrow
const ArrowIcon = () => (
    <svg width="40" height="40" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-primary">
        <path d="M49.3338 41.2863C47.3371 41.0189 45.451 40.0964 43.8341 38.8687C41.6506 37.2104 39.7712 35.1554 38.2435 32.8988C35.9452 29.5042 34.3516 25.5413 34.2562 21.4398C34.2057 19.2661 34.6195 16.9208 35.8504 15.1118C37.0729 13.3155 39.1171 12.3307 41.2721 12.2343C45.3378 12.0526 49.0308 14.9961 50.3157 18.847C51.6421 22.8222 50.3444 27.2764 47.3592 30.2223C44.3857 33.1565 39.993 34.2885 36.0028 33.5658C30.6554 32.597 25.756 29.3562 21.5796 26.04C16.5376 22.036 12.0628 17.3822 7.77884 12.5804" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M49.333 41.2861C49.5028 38.6496 50.0763 36.0593 51.0183 33.6062" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M49.333 41.2865C46.8532 42.0673 44.2573 42.4542 41.6543 42.4285" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);


const TestimonialsSection = () => {
    const { testimonials, testimonialHeader } = useContent();

    return (
        <section className="py-24 md:py-32 bg-[#F3F6FA] relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">

                {/* Split Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "0px" }}
                    variants={containerVariants}
                    className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8"
                >
                    {/* Left Side: Tag & Title */}
                    <motion.div variants={itemVariants} className="max-w-2xl">
                        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#EEF4FF] border border-[#D1E0FF] mb-6">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-brand-dark to-brand-primary"></div>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary font-semibold text-sm">{testimonialHeader?.tag || 'Testimonial'}</span>
                        </div>
                        <h2 className="text-2xl md:text-5xl font-bold text-slate-900 leading-tight whitespace-pre-line">
                            {testimonialHeader?.title || "What Our Customers\nAre Saying"}
                        </h2>
                    </motion.div>

                    {/* Right Side: Trusted Clients Badges */}
                    <motion.div variants={itemVariants} className="flex items-center gap-6 pb-2">
                        <div className="hidden sm:block">
                            <ArrowIcon />
                        </div>
                        <div className="flex items-center">
                            {/* Overlapping Avatars */}
                            <div className="flex -space-x-4">
                                {mockAvatars.map((avatar, idx) => (
                                    <img
                                        key={idx}
                                        src={avatar}
                                        alt="Trusted Client"
                                        className="w-14 h-14 rounded-full border-4 border-[#F3F6FA] object-cover relative z-10 shadow-sm"
                                        style={{ zIndex: 30 - idx }}
                                    />
                                ))}

                            </div>
                        </div>
                        <div className="flex flex-col ml-2">
                            <span className="text-slate-900 font-bold text-lg leading-tight">Trusted Clients</span>
                            <span className="text-slate-600 font-medium leading-tight">Worldwide</span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Main Content: Sliding Lane + Fixed Pillar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT LANE: Sliding Testimonials (Occupies 2/3 of space on Desktop) */}
                    <div className="lg:col-span-2 overflow-hidden">
                        <Swiper
                            modules={[Autoplay, Pagination]}
                            spaceBetween={24}
                            slidesPerView={1}
                            loop={testimonials.length > 2}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                            }}
                            breakpoints={{
                                768: {
                                    slidesPerView: 2,
                                }
                            }}
                            className="testimonials-swiper !pb-12"
                        >
                            {testimonials.map((testimonial) => (
                                <SwiperSlide key={testimonial.id}>
                                    <motion.div
                                        variants={itemVariants}
                                        className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300 relative group flex flex-col h-[400px]"
                                    >
                                        {/* User Info */}
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="relative">
                                                {testimonial.avatar && (
                                                    <img
                                                        src={testimonial.avatar}
                                                        alt={testimonial.name}
                                                        className="w-16 h-16 rounded-full object-cover border-2 border-slate-50"
                                                    />
                                                )}
                                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                                    <Quote size={10} className="text-white fill-current" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <h4 className="text-slate-900 font-bold text-lg">{testimonial.name}</h4>
                                                <span className="text-slate-500 text-sm font-medium">{testimonial.designation}</span>
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <hr className="border-slate-100 mb-6" />

                                        {/* Quote & Description */}
                                        <div className="flex-grow">

                                            <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight whitespace-pre-line">"{testimonial.quote}"</h3>
                                            <p className="text-slate-500 leading-relaxed line-clamp-5 italic whitespace-pre-line">
                                                {testimonial.feedback}
                                            </p>
                                        </div>
                                    </motion.div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* RIGHT PILLAR: Fixed Stat Card */}
                    <div className="lg:col-span-1">
                        <motion.div
                            variants={itemVariants}
                            className="bg-[#0b1021] rounded-[2rem] shadow-2xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden flex flex-col justify-end h-[400px] w-full"
                        >
                            {/* Pre-designed Background */}
                            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                                {testimonialHeader?.sideImage && (
                                    <img
                                        src={testimonialHeader?.sideImage}
                                        alt="Satisfied Professional"
                                        className="w-full h-full object-cover object-center bg-slate-800"
                                    />
                                )}
                            </div>

                            {/* Gradient Overlay */}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0b1021] via-[#0b1021]/80 to-transparent z-20 pointer-events-none"></div>

                            {/* Bottom Stats Overlay */}
                            <div className="relative z-30 p-8 flex items-end justify-center">
                                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shadow-2xl">
                                    <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center shadow-lg">
                                        <CheckCircle size={18} className="text-white" fill="currentColor" stroke="none" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-black text-xl leading-tight">{testimonialHeader?.statValue}</span>
                                        <span className="text-gray-300 text-xs font-bold uppercase tracking-widest">{testimonialHeader?.statText}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default TestimonialsSection;
