import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ServiceHero from '../../components/ServicesPage/ServiceHero';
import ServiceAbout from '../../components/ServicesPage/ServiceAbout';
import ServiceList from '../../components/ServicesPage/ServiceList';

/**
 * Code Walkthrough
 * This is the main assembly container for the public Services Page.
 * It imports the globally shared Navbar and Footer, sandwiching the localized 
 * modular components from the ServicesPage directory.
 * useEffect ensures the page loads at the top, fixing client-side routing scroll memory.
 */
const Services = () => {
    // Ensure the page scrolls to top when loaded
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen flex flex-col font-sans">
            {/* Navigation Layer */}
            <Navbar />

            {/* Page Content Layer */}
            <main className="flex-grow bg-[#F8FAFC]">
                <ServiceHero />
                <ServiceAbout />
                <ServiceList />
            </main>

            {/* Footer Layer */}
            <Footer />
        </div>
    );
};

export default Services;
