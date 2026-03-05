import React from 'react';
import { motion } from 'framer-motion';

/**
 * Code Walkthrough:
 * We use `framer-motion` for a looping motion effect.
 * The `PartnerRow` component creates an infinite scroll loop sequence for the Logos.
 */

// Placeholder partner images
const mockPartnersData = [
    { id: 1, name: "Google Cloud", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg", width: 90 },
    { id: 2, name: "Cisco", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg", width: 70 },
    { id: 3, name: "TP-Link", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e4/TP-Link_logo_2016.svg", width: 100 },
    { id: 4, name: "Aruba", logo: "https://upload.wikimedia.org/wikipedia/commons/2/23/Aruba_Networks_logo.svg", width: 70 },
    { id: 5, name: "Hewlett Packard Enterprise", logo: "https://upload.wikimedia.org/wikipedia/commons/4/46/Hewlett_Packard_Enterprise_logo.svg", width: 90 },
    { id: 6, name: "Dell", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2ebe/Dell_logo_2016.svg", width: 50 },
    { id: 7, name: "Check Point", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Check_Point_logo.svg", width: 100 },
    { id: 8, name: "Sophos", logo: "https://upload.wikimedia.org/wikipedia/commons/4/41/Sophos_logo.svg", width: 80 }
];

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
    // To make row 2 visually distinct and starting from a different subset, we reverse the data.
    const row2Data = [...mockPartnersData].reverse();

    return (
        <section className="py-24 bg-[#FAFCFF] overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-4 text-center mb-16">
                <h2 className="text-[1.5rem] md:text-[2rem] font-bold text-[#0b1021] leading-snug max-w-4xl mx-auto">
                    We forge strategic partnerships with industry leaders to drive tangible business outcomes and foster unparalleled client achievements.
                </h2>
            </div>

            <div className="flex flex-col gap-2 relative max-w-[1600px] mx-auto">
                {/* Gradient masks for smooth edge fading */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#FAFCFF] to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#FAFCFF] to-transparent z-10 pointer-events-none"></div>

                <PartnerRow items={mockPartnersData} reverse={false} />
                <PartnerRow items={row2Data} reverse={true} />
            </div>
        </section>
    );
};

export default PartnersSection;
