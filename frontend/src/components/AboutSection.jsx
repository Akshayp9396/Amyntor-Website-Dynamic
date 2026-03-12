import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Users, Briefcase, Award } from 'lucide-react';
import AboutUs1 from '../assets/images/about-us1.jpg';
import AboutUs2 from '../assets/images/about-us2.jpg';

/**
 * Code Walkthrough
 * This is the AboutSection component specifically built for the Home Page.
 * It features a two-column layout:
 * 1. Left: An intricate image grid with overlapping statistic cards.
 * 2. Right: A glassmorphism content area with dynamic mock data, tags, and a CTA.
 * Framer Motion is used for scroll-reveal animations to maintain the enterprise feel.
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
    // Mock data for the About section to allow for easy future backend integration
    const mockAboutData = {
        tag: "Get to Know Us",
        title: "Transforming Businesses Through Technology",
        description: "Amyntor Tech Solutions, helmed by a diverse team of young and seasoned professionals, encompasses a rich tapestry of skills. With our headquarters nestled in Thiruvananthapuram, we extend our presence across the vast expanse of India. As proud sentinels of Cybersecurity Services, complete IT and Cloud Infrastructure solutions, and managed services prowess, we invite you to embark on a remarkable journey with us. Our unwavering dedication has garnered resounding endorsements from customers spanning the globe, attesting to our sterling reputation. Placing paramount importance on exceptional customer service, we fervently prioritize the unique needs and requirements of our esteemed clientele. Our unwavering mission is to deliver services of unparalleled quality, complemented by an unwavering commitment to exceptional after-sales support.",
        stats: {
            govProjects: "127+",
            workforce: "57+"
        },
        features: [

        ],
        ctaText: "Learn More",
        ctaLink: "/about",
        leftCards: {
            bottomCard: {
                number: "300+",
                text: "Projects Completed"
            }
        },
        bottomStats: [
            {
                title: "Happy",
                subtitle: "Clients",
                value: "352",
                icon: Users
            },
            {
                title: "Government",
                subtitle: "Projects",
                value: "127",
                icon: Briefcase
            },
            {
                title: "Expert",
                subtitle: "Workforce",
                value: "57",
                icon: Award
            }
        ],
        mainImage: AboutUs1, // Main right image (second grid)
        topImage: AboutUs2,  // Top left image (first grid)
    };

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

            <div className="max-w-[96%] mx-auto px-4 md:px-8">
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
                                    <img src={mockAboutData.topImage} alt="Team" className="w-full h-full object-cover object-center" />
                                </motion.div>

                                {/* Bottom Card - Global Clients */}
                                <motion.div
                                    variants={slideUpVariants}
                                    className="bg-white border border-gray-300 rounded-[2.5rem] p-8 text-center sm:text-left flex flex-col justify-center shadow-2xl h-[240px] lg:h-[300px]"
                                >
                                    <h3 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary mb-6">
                                        <CountUpNumber
                                            end={parseInt(mockAboutData.leftCards.bottomCard.number)}
                                            suffix="+"
                                        />
                                    </h3>

                                    <div className="flex items-center space-x-4 mb-4 relative">
                                        <div className="w-1/2 h-[1px] bg-gradient-to-r from-brand-dark to-brand-primary"></div>

                                        <span className="font-semibold text-slate-900 text-base whitespace-nowrap">
                                            {mockAboutData.leftCards.bottomCard.text}
                                        </span>
                                    </div>

                                    <p className="text-gray-500 text-base leading-relaxed text-left">
                                        We serve businesses of all sizes around the world
                                    </p>
                                </motion.div>
                            </div>

                            {/* Main Right Image */}
                            <motion.div variants={slideRightVariants} className="w-full max-w-[380px] sm:max-w-none sm:flex-1 rounded-[2.5rem] overflow-hidden shadow-xl relative h-[400px] sm:h-[464px] lg:h-[564px] mx-auto sm:mx-0">
                                <img src={mockAboutData.mainImage} alt="Team Meeting" className="w-full h-full object-cover" />

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
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary font-semibold text-sm">{mockAboutData.tag}</span>
                            </motion.div>

                            {/* Headline */}
                            <motion.h2 variants={slideUpVariants} className="text-3xl md:text-5xl font-semibold text-slate-900 leading-tight mb-4">
                                {mockAboutData.title}
                            </motion.h2>

                            {/* Description */}
                            <motion.p variants={slideUpVariants} className="text-gray-600 text-[15px] leading-relaxed mb-8 text-justify">
                                {mockAboutData.description}
                            </motion.p>

                            {/* Right Side stats removed per user layout instruction to move them down */}

                            {/* Features List */}
                            {mockAboutData.features.length > 0 && (
                                <motion.ul variants={slideUpVariants} className="space-y-5 mb-8">
                                    {mockAboutData.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center space-x-3 text-slate-800 font-semibold">
                                            <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                                                <CheckCircle2 size={16} fill="currentColor" stroke="white" />
                                            </div>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </motion.ul>
                            )}

                            {/* CTA */}
                            <motion.div variants={slideUpVariants}>
                                <Link to={mockAboutData.ctaLink}>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="bg-gradient-to-r from-brand-dark to-brand-primary text-white hover:opacity-90 px-8 py-4 rounded-full font-semibold transition-all shadow-lg shadow-brand-primary/30 inline-flex items-center space-x-3"
                                    >
                                        <span>{mockAboutData.ctaText}</span>
                                        <div className="">
                                            <ArrowRight size={16} />
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
                    {mockAboutData.bottomStats.map((stat, index) => {
                        const Icon = stat.icon;
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

                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand-primary to-brand-dark flex items-center justify-center text-white shadow-md">
                                        <Icon size={20} />
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
