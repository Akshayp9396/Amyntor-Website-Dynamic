import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

const CareersIntro = () => {
    const { careersPageData } = useContent();
    const intro = careersPageData?.intro;

    if (!intro) return null;

    const handleScrollToRoles = () => {
        document.getElementById('open-roles-section').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Left Side Component (Text & Button) */}
                    <div className="order-2 lg:order-1">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="flex flex-col space-y-6"
                        >
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0b1021] leading-tight">
                                {intro.heading}
                            </h2>
                            <p className="text-lg text-[#0b1021]/80 leading-relaxed max-w-xl text-justify">
                                {intro.description}
                            </p>

                            <div className="pt-8">
                                <button
                                    onClick={handleScrollToRoles}
                                    className="group relative inline-flex items-center gap-4 px-10 py-4 rounded-full border border-slate-200 text-[#0b1021] font-bold transition-all duration-300 hover:shadow-md focus:outline-none"
                                >
                                    <span className="relative z-10 transition-all duration-300 group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-brand-dark group-hover:to-brand-primary">
                                        Explore Open Roles
                                    </span>
                                    <div className="relative z-10">
                                        {/* Premium Gradient Icon */}
                                        <svg className="w-5 h-5 transition-all duration-300 group-hover:translate-y-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <linearGradient id="icon-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#2563eb" />
                                                    <stop offset="100%" stopColor="#02a1fd" />
                                                </linearGradient>
                                            </defs>
                                            <path
                                                d="M12 5V19M12 19L5 12M12 19L19 12"
                                                className="stroke-slate-400 group-hover:stroke-[url(#icon-grad)]"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side Component (Image) */}
                    <div className="order-1 lg:order-2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative w-full aspect-square md:aspect-video lg:aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl"
                        >
                            {/* Decorative Blur behind image */}
                            <div className="absolute -inset-4 bg-gradient-to-tr from-brand-primary/30 to-brand-dark/30 blur-2xl z-0" />

                            <img
                                src={intro.image}
                                alt="Our Company Culture"
                                className="relative z-10 w-full h-full object-cover rounded-[2.5rem]"
                            />
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default CareersIntro;
