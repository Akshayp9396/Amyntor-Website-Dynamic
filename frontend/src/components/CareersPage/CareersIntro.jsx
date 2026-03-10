import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { careersPageData } from './careersData';

const CareersIntro = () => {
    const { intro } = careersPageData;

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
                            <p className="text-lg text-[#0b1021]/80 leading-relaxed max-w-xl">
                                {intro.description}
                            </p>

                            <div className="pt-8">
                                <button
                                    onClick={handleScrollToRoles}
                                    className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full border border-slate-200 text-[#0b1021] font-semibold overflow-hidden transition-all duration-300 hover:border-transparent hover:shadow-lg focus:outline-none"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-brand-dark to-brand-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                                    <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Explore Open Roles</span>
                                    <ArrowDown size={20} className="relative z-10 transition-colors duration-300 group-hover:text-white group-hover:translate-y-1" />
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
