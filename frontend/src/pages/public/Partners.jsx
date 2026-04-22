import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PartnersHero from '../../components/PartnersPage/PartnersHero';
import PartnersList from '../../components/PartnersPage/PartnersList';

/**
 * Code Walkthrough: Partners.jsx (Public Shell)
 * 
 * Purpose: The main container for the "Our Partners" page.
 * Implementation: Reuses the global Navbar and Footer for brand consistency,
 * while orchestrating the specialized PartnersHero and PartnersList components.
 * Includes a mandatory scroll-to-top effect on initial mount.
 */
const Partners = () => {
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            {/* MAIN CONTENT ECOSYSTEM */}
            <main className="flex-grow">
                <PartnersHero />
                <PartnersList />
            </main>

            <Footer />
        </div>
    );
};

export default Partners;
