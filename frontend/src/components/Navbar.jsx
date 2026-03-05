import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../assets/images/amyntor-logo.png';

/**
 * Code Walkthrough
 * This is the Navbar component that contains the site logo, navigation links, and action buttons.
 * It uses a custom dropdown for grouped resources (Case Study, Gallery, Blogs).
 * The action area features a vertical separator before the contact details to match the reference design.
 * It features a glassmorphism background effect that triggers when the user scrolls down.
 */
const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [expandedDropdowns, setExpandedDropdowns] = useState({});

    const toggleDropdown = (label) => {
        setExpandedDropdowns(prev => ({ ...prev, [label]: !prev[label] }));
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Grouped links structure
    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'About Us', path: '/about' },
        { label: 'Services', path: '/services' },
        {
            label: 'Resources',
            dropdown: true,
            subItems: [
                { label: 'Case Study', path: '/case-study' },
                { label: 'Gallery', path: '/gallery' },
                { label: 'Blogs', path: '/blogs' },
            ]
        },
        { label: 'Careers', path: '/careers' },
        // { label: 'Contact', path: '/contact' }, // Hidden as requested
    ];

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/70 backdrop-blur-md shadow-sm border-b border-white/20' : 'bg-white'}`}>
            <div className="max-w-[96%] mx-auto px-4 md:px-8 py-4 flex items-center justify-between">

                {/* Logo Section */}
                <div className="flex items-center justify-center">
                    <img src={Logo} alt="Amyntor Tech Solutions Logo" className="h-10 md:h-12 w-auto object-contain" />
                </div>

                {/* Navigation Links (Desktop) */}
                <div className="hidden lg:flex space-x-6 items-center">
                    {navItems.map((item, index) => {
                        if (item.dropdown) {
                            return (
                                <div key={index} className="relative group cursor-pointer inline-block py-2">
                                    <div className="flex items-center text-gray-700 hover:text-brand-primary font-medium transition-colors text-sm">
                                        {item.label}
                                        <ChevronDown size={14} className="ml-1 group-hover:rotate-180 transition-transform duration-200" />
                                    </div>
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform origin-top scale-95 group-hover:scale-100">
                                        <div className="py-2">
                                            {item.subItems.map((sub, subIdx) => (
                                                <Link
                                                    key={subIdx}
                                                    to={sub.path}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-primary transition-colors"
                                                >
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <Link
                                key={index}
                                to={item.path}
                                className="text-gray-700 hover:text-brand-primary font-medium transition-colors text-sm py-2"
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Actions Section */}
                <div className="hidden md:flex items-center">

                    {/* Contact Info with Left Separator */}
                    <div className="flex items-center border-l border-gray-200 pl-6 mr-6">
                        <div className="flex items-center space-x-2.5">
                            <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-slate-800">
                                <Phone size={14} fill="currentColor" strokeWidth={0} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-400 font-medium leading-tight">Have Any Questions?</span>
                                <span className="text-base font-bold text-slate-800 leading-tight mt-0.5 whitespace-nowrap">+91 471 2080 478</span>
                            </div>
                        </div>
                    </div>

                    <Link to="/contact">
                        <button className="bg-gradient-to-r from-brand-dark to-brand-primary text-white hover:shadow-lg hover:opacity-90 px-6 py-2.5 rounded-full font-semibold transition-all text-sm whitespace-nowrap shadow-md">
                            Get In Touch
                        </button>
                    </Link>

                </div>

                {/* Mobile menu button */}
                <div className="lg:hidden flex items-center">
                    <button onClick={() => setMobileMenuOpen(true)} className="text-gray-700 hover:text-brand-primary focus:outline-none">
                        <Menu size={28} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed inset-0 z-[100] bg-white/85 backdrop-blur-xl flex flex-col h-screen"
                    >
                        <div className="flex items-center justify-between p-4 md:px-8 border-b border-gray-200/50 shadow-sm relative z-20 bg-white/50">
                            <img src={Logo} alt="Amyntor Tech Solutions Logo" className="h-10 w-auto object-contain" />
                            <button onClick={() => setMobileMenuOpen(false)} className="text-gray-700 p-2 focus:outline-none hover:text-brand-primary bg-white/50 rounded-full shadow-sm">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex flex-col py-6 px-6 overflow-y-auto flex-grow relative z-10">
                            {navItems.map((item, index) => (
                                <div key={index} className="flex flex-col py-3.5 border-b border-slate-200/50 last:border-0">
                                    {item.dropdown ? (
                                        <>
                                            <button
                                                onClick={() => toggleDropdown(item.label)}
                                                className="flex items-center justify-between w-full text-lg font-bold text-slate-800 mb-1 focus:outline-none"
                                            >
                                                {item.label}
                                                <ChevronDown size={20} className={`transform transition-transform duration-300 ${expandedDropdowns[item.label] ? 'rotate-180' : ''}`} />
                                            </button>
                                            <AnimatePresence>
                                                {expandedDropdowns[item.label] && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="flex flex-col pl-4 gap-4 mt-4 mb-2">
                                                            {item.subItems.map((sub, subIdx) => (
                                                                <Link
                                                                    key={subIdx}
                                                                    to={sub.path}
                                                                    onClick={() => setMobileMenuOpen(false)}
                                                                    className="text-[15px] font-semibold text-slate-600 hover:text-brand-primary transition-colors flex items-center max-w-max"
                                                                >
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-3"></span>
                                                                    {sub.label}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </>
                                    ) : (
                                        <Link
                                            to={item.path}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="text-lg font-bold text-slate-800 hover:text-brand-primary transition-colors max-w-max"
                                        >
                                            {item.label}
                                        </Link>
                                    )}
                                </div>
                            ))}
                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <div className="flex flex-col space-y-2 mb-6 text-center">
                                    <span className="text-sm font-medium text-slate-400"> Have Any Questions?</span>
                                    <span className="text-xl font-bold text-slate-800">+91 471 2080 478</span>
                                </div>
                                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                                    <button className="w-full bg-gradient-to-r from-brand-dark to-brand-primary text-white py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-shadow shadow-brand-primary/20">
                                        Get In Touch
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
