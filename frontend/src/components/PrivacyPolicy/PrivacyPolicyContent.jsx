import React from 'react';

/**
 * Code Walkthrough: PrivacyPolicyContent.jsx
 * 
 * Purpose: A world-class, clean editorial layout for presenting the site's privacy guidelines.
 * Design: Features lead-weighted headers (#0B1021) and justified text, ensuring that 
 * legal information is highly readable and authoritative.
 */
const PrivacyPolicyContent = () => {
    // 🕵️ DUMMY LEGAL DATA: Organized and professional sections
    const policySections = [
        {
            id: 1,
            title: "1. Introduction",
            content: "At Amyntor Tech, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website and interact with our world-class cybersecurity services. Our commitment to operational integrity extending to your digital privacy rights."
        },
        {
            id: 2,
            title: "2. Information We Collect",
            content: "We may collect various types of information, including personal identification details (name, email address, phone number) when you contact us via our forms. Additionally, we collect non-personal information such as browsing behavior and IP addresses to optimize our platform's performance and cybersecurity resilience."
        },
        {
            id: 3,
            title: "3. How We Use Your Information",
            content: "The data we collect is primarily used to provide and maintain our services, respond to your inquiries, and ensure the security of our platform. We also utilize this information to enhance our digital infrastructure and provide you with personalized updates regarding our strategic technological findings."
        },
        {
            id: 4,
            title: "4. Data Security & Protection",
            content: "As a premier cybersecurity firm, we implement world-class security measures to protect your personal data against unauthorized access, alteration, or disclosure. We use state-of-the-art encryption protocols and advanced monitoring to ensure your privacy information remains highly secure within our enterprise ecosystem."
        },
        {
            id: 5,
            title: "5. Cookie Policy",
            content: "Our website uses cookies to enhance your browsing experience and analyze site traffic. You can choose to disable cookies through your individual browser settings; however, this may affect the functionality of some strategic resources within our platform."
        },
        {
            id: 6,
            title: "6. Changes to This Policy",
            content: "We reserve the right to update this Privacy Policy at any time to reflect changes in our legal requirements or operational practices. We encourage you to review this page periodically to stay informed about how we are protecting your privacy rights."
        }
    ];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-[1000px] mx-auto px-6 md:px-12">
                
                {/* 📝 EDITORIAL HEADER */}
                <div className="mb-16 pb-8 border-b border-slate-100">
                    <p className="text-brand-primary font-bold text-sm tracking-widest uppercase mb-4">Effective Date: April 2026</p>
                    <h2 className="text-3xl font-extrabold text-[#0B1021] tracking-tight">Our Commitment to Digital Privacy</h2>
                </div>

                {/* 🧭 POLICY SECTIONS */}
                <div className="flex flex-col gap-12">
                    {policySections.map((section) => (
                        <div key={section.id} className="flex flex-col">
                            <h3 className="text-xl font-bold text-[#0B1021] mb-4 tracking-tight">
                                {section.title}
                            </h3>
                            <p className="text-slate-600 text-[15.5px] md:text-base leading-relaxed font-medium text-justify">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>

               

            </div>
        </section>
    );
};

export default PrivacyPolicyContent;
