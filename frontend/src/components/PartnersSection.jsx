import React from 'react';
import { motion } from 'framer-motion';
import { useContent } from '../context/ContentContext';

/**
 * Code Walkthrough:
 * We use `framer-motion` for a looping motion effect.
 * The `PartnerRow` component creates an infinite scroll loop sequence for the Logos.
 * Now pulling dynamic logos from ContentContext.
 */

const PartnerRow = ({ items, reverse }) => {
    // Duplicate 3 times for a seamless loop
    const duplicatedItems = [...items, ...items, ...items];

    return (
        <div className="flex w-full overflow-hidden py-3">
            <motion.div
                className="flex items-center gap-6 cursor-pointer"
                animate={{
                    x: reverse ? ["-33.33%", "0%"] : ["-33.33%", "-66.66%"],
                }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 35,
                }}
                style={{ width: "max-content" }}
                whileHover={{ animationPlayState: "paused" }} // Hover triggers CSS pause 
            >
                {duplicatedItems.map((item, idx) => (
                    <div
                        key={`${item.id}-${idx}`}
                        className="flex items-center justify-center bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 hover:shadow-md transition-shadow px-8 h-[90px] min-w-[200px]"
                    >
                        <img
                            src={item.logo}
                            alt={item.name}
                            style={{ width: item.width }}
                            className="object-contain"
                            draggable="false"
                        />
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

const PartnersSection = () => {
    const { partners } = useContent();
    // To make row 2 visually distinct and starting from a different subset, we reverse the data.
    const row2Data = [...partners].reverse();

    return (
        <section className="py-24 bg-[#FAFCFF] overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 text-center mb-16">
                <h2 className="text-[1.5rem] md:text-[2rem] font-bold text-[#0b1021] leading-snug max-w-4xl mx-auto">
                    We forge strategic partnerships with industry leaders to drive tangible business outcomes and foster unparalleled client achievements.
                </h2>
            </div>

            <div className="flex flex-col gap-2 relative max-w-[1600px] mx-auto">
                {/* Gradient masks for smooth edge fading */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#FAFCFF] to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#FAFCFF] to-transparent z-10 pointer-events-none"></div>

                <PartnerRow items={partners} reverse={false} />
                <PartnerRow items={row2Data} reverse={true} />
            </div>
        </section>
    );
};

export default PartnersSection;
