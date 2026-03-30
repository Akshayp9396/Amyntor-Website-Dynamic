import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useContent } from '../../context/ContentContext';

/**
 * Code Walkthrough
 * AboutSection dynamically pulls 'aboutData' and 'statsData' from the central ContentContext.
 */
const CountUpNumber = ({ end, suffix = "", duration = 2.5 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (isInView) {
            const controls = animate(0, end, {
                duration: duration,
                onUpdate(value) {
                    setCount(Math.round(value));
                },
                ease: "easeOut"
            });
            return () => controls.stop();
        }
    }, [isInView, end, duration]);

    return <span ref={ref}>{count}{suffix}</span>;
};

const AboutSection = () => {
    const { aboutData, statsData } = useContent();

    // Animation variants for scroll reveals
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const slideUpVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const slideRightVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <section className="py-24 md:py-20 bg-white relative overflow-hidden">

            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">

                    {/* Left Side: Image Grid & Overlapping Cards */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "0px" }}
                        variants={containerVariants}
                        className="relative w-full max-w-lg sm:max-w-2xl md:max-w-4xl mx-auto lg:max-w-none ml-0 lg:ml-8"
                    >
                        <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 justify-center">
                            {/* Left Column of Cards */}
                            <div className="flex flex-col gap-6 lg:gap-8 w-full max-w-[380px] sm:max-w-none sm:flex-1 mx-auto sm:mx-0 shrink-0 z-20">

                                {/* Top Image */}
                                <motion.div variants={slideUpVariants} className="w-full h-[200px] lg:h-[240px] rounded-[2rem] overflow-hidden shadow-xl">
                                    <img src={aboutData.topImage} alt="Team" className="w-full h-full object-cover object-center" />
                                </motion.div>

                                {/* Bottom Card - Global Clients */}
                                <motion.div
                                    variants={slideUpVariants}
                                    className="bg-white border border-gray-300 rounded-[2.5rem] p-8 text-center sm:text-left flex flex-col justify-center shadow-2xl h-[240px] lg:h-[300px]"
                                >
                                    <h3 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary mb-6">
                                        <CountUpNumber
                                            end={parseInt(aboutData.leftCardValue)}
                                            suffix="+"
                                        />
                                    </h3>

                                    <div className="flex items-center space-x-4 mb-4 relative">
                                        <div className="w-1/2 h-[1px] bg-gradient-to-r from-brand-dark to-brand-primary"></div>

                                        <span className="font-semibold text-slate-900 text-base whitespace-nowrap">
                                            {aboutData.leftCardText}
                                        </span>
                                    </div>

                                    <p className="text-gray-500 text-base leading-relaxed text-left">
                                        {aboutData.leftCardDescription || "We serve businesses of all sizes around the world"}
                                    </p>
                                </motion.div>
                            </div>

                            {/* Main Right Image */}
                            <motion.div variants={slideRightVariants} className="w-full max-w-[380px] sm:max-w-none sm:flex-1 rounded-[2.5rem] overflow-hidden shadow-xl relative h-[400px] sm:h-[464px] lg:h-[564px] mx-auto sm:mx-0">
                                <img src={aboutData.mainImage} alt="Team Meeting" className="w-full h-full object-cover" />

                                {/* Circular Badge Override overlapping */}

                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right Side: Clean Breathable Content */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "0px" }}
                        variants={containerVariants}
                        className="w-full lg:sticky lg:top-32"
                    >
                        {/* Content Container (No Box) */}
                        <div className="p-4 md:p-8 relative">
                            {/* Tag */}
                            <motion.div variants={slideUpVariants} className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#EEF4FF] border border-[#D1E0FF] mb-3">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-brand-dark to-brand-primary"></div>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary font-semibold text-sm">{aboutData.tag}</span>
                            </motion.div>

                            {/* Headline */}
                            <motion.h2 variants={slideUpVariants} className="text-3xl md:text-5xl font-semibold text-slate-900 leading-tight mb-4">
                                {aboutData.title}
                            </motion.h2>

                            {/* Description */}
                            <motion.p variants={slideUpVariants} className="text-gray-600 text-[15px] leading-relaxed mb-8 text-justify">
                                {aboutData.description}
                            </motion.p>

                            {/* Features List (Removed for brevity but handled dynamically before, let's keep it clean since it was empty in the mock anyway) */}

                            {/* CTA */}
                            <motion.div variants={slideUpVariants}>
                                <Link to={aboutData.ctaLink}>
                                    <motion.button
                                        whileHover={{ x: 5 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="group flex items-center space-x-3 transition-all duration-300 hover:opacity-90 px-8 py-3.5 rounded-full border border-transparent shadow-sm"
                                        style={{
                                            backgroundImage: "linear-gradient(white, white), linear-gradient(to right, #2563eb, #02a1fd)",
                                            backgroundOrigin: "border-box",
                                            backgroundClip: "padding-box, border-box"
                                        }}
                                    >
                                        <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary">
                                            {aboutData.ctaText}
                                        </span>
                                        <div className="text-brand-primary group-hover:translate-x-1 transition-transform duration-300">
                                            <ArrowRight size={22} className="stroke-[3]" />
                                        </div>
                                    </motion.button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>

                </div>

                {/* Bottom Stats Row */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "0px" }}
                    variants={containerVariants}
                    className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
                >
                    {statsData.map((stat, index) => {
                        const isImage = stat.icon?.startsWith('data:image') || stat.icon?.startsWith('http') || stat.icon?.startsWith('/');
                        const Icon = !isImage ? (LucideIcons[stat.icon] || LucideIcons.HelpCircle) : null;

                        return (
                            <motion.div
                                key={index}
                                variants={slideUpVariants}
                                className="bg-white rounded-[2rem] p-8 shadow-lg border border-gray-200 relative overflow-hidden group transition-all duration-500 hover:shadow-xl"
                            >
                                {/* Soft Blue Hover Glow */}
                                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-brand-dark/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="relative z-10 flex justify-between items-start mb-10">
                                    <div>
                                        <p className="text-slate-800 font-semibold text-lg leading-tight">
                                            {stat.title}
                                        </p>
                                        <p className="text-slate-600 font-medium text-base leading-tight">
                                            {stat.subtitle}
                                        </p>
                                    </div>

                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand-primary to-brand-dark flex items-center justify-center text-white shadow-md overflow-hidden">
                                        {isImage ? (
                                            <img src={stat.icon} alt={stat.title} className="w-full h-full object-cover p-2 bg-white" />
                                        ) : (
                                            <Icon size={20} />
                                        )}
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary">
                                        <CountUpNumber end={parseInt(stat.value)} suffix="+" />
                                    </h3>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

            </div>
        </section>
    );
};

export default AboutSection;
