import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CaseStudyHero from '../../components/CaseStudyPage/CaseStudyHero';
import CaseStudyGrid from '../../components/CaseStudyPage/CaseStudyGrid';

const CaseStudy = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow bg-[#F8FAFC]">
                <CaseStudyHero />
                <CaseStudyGrid />
            </main>

            <Footer />
        </div>
    );
};

export default CaseStudy;
