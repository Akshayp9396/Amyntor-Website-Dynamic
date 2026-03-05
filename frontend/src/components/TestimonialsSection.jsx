import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import Testimonial1 from '../assets/images/testimonial1.png';

import 'swiper/css';
import { motion } from 'framer-motion';
import { Star, CheckCircle, Quote } from 'lucide-react';

/**
 * Code Walkthrough
 * This component renders the Testimonials Section on the Home Page.
 * It features a split header with a 'Trusted Clients' element.
 * The layout uses CSS Grid to display two testimonial cards and a custom stylized
 * 'Status Card' on the right side.
 * Framer Motion is used for staggered entry animations and smooth hover scaling.
 * 
 * Technical Note: The 'Status Card' background is built entirely out of CSS radial
 * gradients and absolute positioned decorative circles to avoid blurry static images
 * and maintain crisp retina quality.
 */

const mockTestimonialData = [
    {
        id: 1,
        name: "Maisha Jakulin",
        designation: "UI/UX Designer",
        quote: "Amazing Services!",
        feedback: "Technically sound chains main business and paids marketplace technology that's targeted audience simplify interoperable vortals via reliable done",

        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
    },
    {
        id: 2,
        name: "Jobaer Khanom",
        designation: "App Developer",
        quote: "Amazing Services!",
        feedback: "Technically sound chains main business and paids marketplace technology that's targeted audience simplify interoperable vortals via reliable done",

        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150"
    }
];

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
    return (
        <section className="py-24 md:py-32 bg-[#F3F6FA] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

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
                        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-brand-primary/30 bg-white mb-6 shadow-sm">
                            <CheckCircle size={14} className="text-brand-primary" fill="currentColor" stroke="white" />
                            <span className="text-brand-primary font-medium text-sm">Testimonial</span>
                        </div>
                        <h2 className="text-2xl md:text-5xl font-bold text-slate-900 leading-tight">
                            What Our Customers  <br />
                            Are Saying
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

                {/* Main Content Grid */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "0px" }}
                    variants={containerVariants}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                    {/* Testimonial Cards (Left and Center) */}
                    {mockTestimonialData.map((testimonial) => (
                        <motion.div
                            key={testimonial.id}
                            variants={itemVariants}
                            className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 relative group flex flex-col"
                        >
                            {/* User Info */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="relative">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                        <Quote size={10} className="text-white fill-current" />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="text-slate-900 font-bold text-lg">{testimonial.name}</h4>
                                    <span className="text-slate-500 text-sm">{testimonial.designation}</span>
                                </div>
                            </div>

                            {/* Divider Line */}
                            <hr className="border-slate-100 mb-8" />

                            {/* Quote & Description */}
                            <h3 className="text-xl font-bold  mb-4">"{testimonial.quote}"</h3>
                            <p className="text-slate-500 leading-relaxed mb-auto pb-8">
                                {testimonial.feedback}
                            </p>



                        </motion.div>
                    ))}

                    {/* Status Custom Background Card (Right) */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-[#0b1021] rounded-[2rem] shadow-2xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden flex flex-col justify-end min-h-[450px] md:min-h-[500px] lg:min-h-0 lg:h-auto w-full max-w-[420px] mx-auto lg:max-w-none"
                    >
                        {/* Pre-designed Background & Subject Combined Image */}
                        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                            <img
                                src={Testimonial1}
                                alt="Satisfied Professional"
                                className="w-full h-full object-cover object-center"
                            />
                        </div>

                        {/* Gradient Overlay for bottom text readability */}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0b1021] via-[#0b1021]/80 to-transparent z-20 pointer-events-none"></div>

                        {/* Bottom Stats Overlay */}
                        <div className="relative z-30 p-8 flex items-end justify-center">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-lg">
                                    <CheckCircle size={16} className="text-brand-primary" fill="currentColor" stroke="white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white font-medium text-lg leading-tight">97% Customers</span>
                                    <span className="text-gray-300 text-sm">Satisfaction Rate</span>
                                </div>
                            </div>
                        </div>

                    </motion.div>

                </motion.div>

            </div>
        </section>
    );
};

export default TestimonialsSection;
