import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AboutHero from '../../components/AboutPage/AboutHero';
import AboutCompany from '../../components/AboutPage/AboutCompany';
import AboutTeam from '../../components/AboutPage/AboutTeam';

/**
 * Code Walkthrough
 * This is the main shell component for the "About Us" page.
 * It reuses the global Navbar and Footer to synchronize branding across the application,
 * and renders modular components specific to the About Page structure.
 */
const About = () => {
    // Scroll to top on load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-grow">
                <AboutHero />
                <AboutCompany />
                <AboutTeam />
                {/* New sections will be inserted here */}
            </main>

            <Footer />
        </div>
    );
};

export default About;
