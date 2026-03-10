import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, Clock, MapPin, Facebook, Twitter, Linkedin, Instagram, ArrowRight } from 'lucide-react';
import Logo from '../assets/images/amyntor-logo.png';
import ContactBg from '../assets/images/contact-bg.png';

/**
 * Code Walkthrough
 * This is the global Footer component.
 * It features a prominent overlapping "floating" CTA banner at the top (`absolute` positioning),
 * a 4-column highly organized grid layout for links and contact info, and a bottom copyright bar.
 * `filter-white` utility class logic is simulated with inline styles to ensure the logo is visible on dark backgrounds.
 */

const mockFooterData = {
    contact: {
        phone: "+91 471 208 0478",
        hours: "Mon-Sat, 10am-6pm",
        email: "info@amyntortech.com"
    },
    locations: [
        { id: 1, title: "Amyntor Tech Solutions Pvt Ltd, T-TBI, G3B, Ground Floor, Thejaswini Building, Technopark Campus, Kariyavattom, Trivandrum", icon: <MapPin size={18} /> },
        { id: 2, title: "Amyntor Tech Solutions Pvt , TC.97/603, SPRA-157, Opp: Don Bosco Road Monvila, Thiruvananthapuram PIN:695581", icon: <MapPin size={18} /> },
        { id: 3, title: "1st Floor, Joemars , Behind Community Hall, Girinagar , Kadavantra, Cochin, Kerala, 682020", icon: <MapPin size={18} /> }
    ],
    exploreLinks: [
        { label: "Home", path: "/" },
        { label: "About Us", path: "/about" },
        { label: "Services", path: "/services" },
        { label: "Blogs", path: "/blogs" },
        { label: "Case Study", path: "/case-study" },
        { label: "Contact Us", path: "/contact" }
    ],
    serviceLinks: [
        { label: "IT Infrastructure", path: "/services/it-infrastructure" },
        { label: "Cloud and DevOps", path: "/services/cloud-devops" },
        { label: "Cyber Security", path: "/services/cyber-security" },
        { label: "Managed Services", path: "/services/managed-services" },
        { label: "Digital Personal Data Protection", path: "/services/dpdp" },
        { label: "Distribution", path: "/services/distribution" }
    ],
    social: [
        { id: 'fb', icon: <Facebook size={16} />, link: "#" },
        { id: 'ig', icon: <Instagram size={16} />, link: "#" },
        { id: 'x', icon: <Twitter size={16} />, link: "#" },
        { id: 'li', icon: <Linkedin size={16} />, link: "#" },
    ]
};

const Footer = () => {
    const location = useLocation();
    const isContactPage = location.pathname === '/contact';

    return (
        <div className={`w-full px-4 md:px-8 pb-8 ${isContactPage ? 'pt-12' : 'pt-48'} flex justify-center`}>
            <footer className={`relative bg-[#03091e] text-slate-300 rounded-[2.5rem] ${isContactPage ? 'pt-12' : 'pt-30'} pb-1 overflow-visible w-full max-w-[1500px] shadow-2xl`}>

                {/* 1. Floating Top CTA Bar */}
                {!isContactPage && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[80%] max-w-[1050px] z-20">
                        <div className="rounded-3xl shadow-2xl py-6 px-8 md:py-8 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-6 border border-cyan-500/20 relative overflow-hidden bg-[#050B14]">

                            {/* Responsive Background Image Layer */}
                            <img
                                src={ContactBg}
                                alt=""
                                className="absolute inset-0 z-0 w-full h-full object-cover object-right md:object-center scale-110 md:scale-105"
                            />

                            {/* Very subtle gradient overlay to ensure text stays crisp on the left while the network nodes stay bright on the right */}
                            <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#020617]/80 via-[#020617]/40 to-transparent pointer-events-none"></div>

                            {/* Left/Center Content */}
                            <div className="flex flex-col md:flex-row items-center md:items-start lg:items-center gap-4 md:gap-6 relative z-10 w-full lg:w-2/3">
                                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 shrink-0">
                                    <Mail size={28} className="text-white" />
                                </div>
                                <div className="text-center md:text-left">
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1.5">Contact Us</h3>
                                    <p className="text-white/90 text-sm md:text-base font-medium leading-relaxed">
                                        We build greater futures through innovation and collective knowledge.
                                    </p>
                                </div>
                            </div>

                            {/* Right Button */}
                            <div className="shrink-0 relative z-10 w-full md:w-auto flex justify-center lg:justify-end mt-2 lg:mt-0">
                                <Link
                                    to="/contact"
                                    className="group flex items-center gap-2 bg-white text-brand-primary px-6 py-3 rounded-full font-bold text-[15px] hover:bg-slate-50 transition-colors shadow-lg"
                                >
                                    Get In Touch
                                    <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Subtle textured background wave effect inside footer body (Optional abstract shape) */}
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900 via-transparent to-transparent"></div>

                {/* 2. Main Footer Layout */}
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-8 pt-10 pb-8">

                    {/* Left Frame: Brand & Locations */}
                    <div className="w-full lg:w-[28%] shrink-0 flex flex-col gap-6 border-r-0 lg:border-r border-white/5 pr-4 py-2">
                        <Link to="/">
                            {/* We use CSS filter to turn the default dark logo entirely white to match the dark footer */}
                            <img
                                src={Logo}
                                alt="Amyntor Tech Logo"
                                className="h-10 object-contain"
                                style={{ filter: "brightness(0) invert(1)" }}
                            />
                        </Link>

                        <div className="mt-4 space-y-4">
                            {mockFooterData.locations.map((loc) => (
                                <div key={loc.id} className="flex items-start gap-3 text-slate-300">
                                    <span className="mt-1 text-slate-500">{loc.icon}</span>
                                    <span className="text-sm font-medium leading-relaxed hover:text-white transition-colors cursor-default">{loc.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Frame: Links, Contact, and Copyright */}
                    <div className="w-full lg:w-[72%] flex flex-col justify-between">
                        {/* Top Group: Columns Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12 lg:pl-10 w-full">

                            {/* Column 2: Contact Info */}
                            <div className="flex flex-col gap-6 py-2">
                                <h4 className="text-white text-xl font-bold mb-2 relative inline-block">
                                    Contact Us
                                </h4>

                                <div className="flex flex-col gap-8">
                                    <div>
                                        <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-2">Free Conversation</p>
                                        <div className="flex items-center gap-3 text-white/90 hover:text-brand-primary transition-colors text-sm font-medium">
                                            <Mail size={18} className="text-brand-primary" />
                                            <a href={`mailto:${mockFooterData.contact.email}`}>
                                                {mockFooterData.contact.email}
                                            </a>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-2">CALL US :</p>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-3 text-white/90 hover:text-brand-primary transition-colors text-sm font-medium">
                                                <Phone size={18} className="text-brand-primary" />
                                                <a href={`tel:${mockFooterData.contact.phone.replace(/\s+/g, '')}`}>
                                                    {mockFooterData.contact.phone}
                                                </a>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-400">
                                                <Clock size={16} className="text-brand-primary/80" />
                                                <span className="text-xs font-medium">{mockFooterData.contact.hours}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Column 3: Explore */}
                            <div className="flex flex-col gap-6">
                                <h4 className="text-white text-xl font-bold mb-2">Explore</h4>
                                <ul className="space-y-3">
                                    {mockFooterData.exploreLinks.map((link, idx) => (
                                        <li key={idx}>
                                            <Link
                                                to={link.path}
                                                className="text-slate-400 text-sm font-medium hover:text-white hover:translate-x-1 inline-block transition-all"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Column 4: Services */}
                            <div className="flex flex-col gap-6">
                                <h4 className="text-white text-xl font-bold mb-2">Services</h4>
                                <ul className="space-y-3">
                                    {mockFooterData.serviceLinks.map((link, idx) => (
                                        <li key={idx}>
                                            <Link
                                                to={link.path}
                                                className="text-slate-400 text-sm font-medium hover:text-white hover:translate-x-1 inline-block transition-all"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div> {/* End Top Group Grid */}

                        {/* Bottom Group: Integrated Copyright & Socials Row closely hugging the columns */}
                        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 mt-10 lg:mt-12 border-t border-white/10 gap-6 w-full ml-auto lg:pl-10">
                            <p className="text-[13px] text-slate-400 font-medium text-center sm:text-left">
                                Copyright © 2026 Amyntor Tech by <span className="text-brand-primary">Amyntor Tech</span>. All Rights Reserved.
                            </p>
                            <div className="flex items-center gap-4">
                                {mockFooterData.social.map((social) => (
                                    <a
                                        key={social.id}
                                        href={social.link}
                                        className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-brand-primary hover:border-brand-primary hover:scale-110 transition-all shadow-sm"
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>

                    </div> {/* End Right Frame */}

                </div>
            </footer>
        </div>
    );
};

export default Footer;
