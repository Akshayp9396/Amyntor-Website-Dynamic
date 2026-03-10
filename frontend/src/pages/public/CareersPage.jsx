import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CareersHero from '../../components/CareersPage/CareersHero';
import CareersIntro from '../../components/CareersPage/CareersIntro';
import JobBoard from '../../components/CareersPage/JobBoard';

const CareersPage = () => {
    // Ensure scroll starts at top on direct navigation
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white overflow-hidden">
            <Navbar />

            <main>
                <CareersHero />
                <CareersIntro />
                <JobBoard />
            </main>

            <Footer />
        </div>
    );
};

export default CareersPage;
