import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ContactHero from '../../components/ContactPage/ContactHero';
import ContactInfo from '../../components/ContactPage/ContactInfo';
import ContactForm from '../../components/ContactPage/ContactForm';
import ContactBranches from '../../components/ContactPage/ContactBranches';

/**
 * Code Walkthrough
 * This is the master Page component for the Contact section.
 * It renders the global Navbar/Footer and composes the Contact-specific
 * Hero, Info, and Form components into a responsive side-by-side grid.
 */
const Contact = () => {
    // Scroll to top when page is loaded
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
            <Navbar />

            <main className="flex-grow">
                {/* Visual Header */}
                <ContactHero />

                {/* Main Content Grid */}
                <section className="py-20 bg-slate-50">
                    <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

                            {/* Left Column: Contact Methods (Takes up 2/5ths of grid) */}
                            <div className="lg:col-span-2">
                                <ContactInfo />
                            </div>

                            {/* Right Column: Secure Form (Takes up 3/5ths of grid) */}
                            <div className="lg:col-span-3">
                                <ContactForm />
                            </div>

                        </div>
                    </div>
                </section>

                <ContactBranches />
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
