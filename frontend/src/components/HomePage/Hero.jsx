import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

/**
 * Code Walkthrough
 * This is the Hero component serving as the main landing banner.
 * It consumes dynamic 'heroSlides' from the central ContentContext.
 */
const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const { heroSlides: slides } = useContent();

    // Auto-play interval
    useEffect(() => {
        // Change the 8000 below to increase or decrease the wait time in milliseconds (8000ms = 8 seconds)
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 7000);
        return () => clearInterval(timer);
    }, [slides.length]);

    // Animation Variants for Staggered Content
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <div className="w-full bg-white px-4 md:px-8 py-4 md:py-8">
            <div className="relative h-[85vh] min-h-[600px] max-h-[900px] w-full mx-auto overflow-hidden rounded-[2rem] bg-black">
                <AnimatePresence mode="sync">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="absolute inset-0 overflow-hidden"
                    >
                        {/* Background Image with slow Ken Burns Zoom Effect */}
                        <motion.div
                            initial={{ scale: 1.15 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 6, ease: "easeOut" }}
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
                        />
                        {/* Dynamic Gradient Overlays matching the new theme */}
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-primary/70 to-transparent z-10" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />

                        {/* Content Container */}
                        <div className="relative z-20 h-full max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col justify-center">

                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="max-w-2xl"
                            >
                                <motion.div variants={itemVariants} className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold tracking-wider mb-6">
                                    {slides[currentSlide].tag}
                                </motion.div>

                                <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                                    {slides[currentSlide].title}
                                </motion.h1>

                                <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl">
                                    {slides[currentSlide].subtitle}
                                </motion.p>

                                <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
                                    <Link to="/contact" className="inline-block">
                                        <motion.button
                                            whileHover="hover"
                                            className="flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-xl shadow-black/10"
                                        >
                                            <span>{slides[currentSlide].buttonText}</span>
                                            <motion.div variants={{ hover: { x: 5 } }}>
                                                <ArrowRight size={18} />
                                            </motion.div>
                                        </motion.button>
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Pagination Dots */}
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-30 flex flex-col space-y-3">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 relative ${currentSlide === index ? 'bg-white scale-125' : 'bg-white/40'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        >
                            {currentSlide === index && (
                                <span className="absolute -inset-1 rounded-full border border-brand-primary animate-ping opacity-75"></span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Hero;
