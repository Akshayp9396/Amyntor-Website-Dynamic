import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PrivacyPolicyHero from '../../components/PrivacyPolicy/PrivacyPolicyHero';
import PrivacyPolicyContent from '../../components/PrivacyPolicy/PrivacyPolicyContent';

/**
 * Code Walkthrough: PrivacyPolicy.jsx
 * 
 * Purpose: The final page shell for Amyntor Tech's Privacy Policy.
 * Structure: 
 * 1. Navbar: Global professional navigation.
 * 2. PrivacyPolicyHero: Rounded-frame hero breadcrumb system.
 * 3. PrivacyPolicyContent: Highly readable legal editorial content.
 * 4. Footer: Global professional site map.
 */
const PrivacyPolicy = () => {
    // 🕵️ SCROLL SYNC: Ensures the page starts at the top for world-class UX
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main>
                <PrivacyPolicyHero />
                <PrivacyPolicyContent />
            </main>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
