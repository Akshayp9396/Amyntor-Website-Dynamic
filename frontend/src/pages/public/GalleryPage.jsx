import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import GalleryHero from '../../components/GalleryPage/GalleryHero';
import GalleryGrid from '../../components/GalleryPage/GalleryGrid';

const GalleryPage = () => {
    // Scroll to top on page mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white overflow-hidden">
            <Navbar />

            <main>
                <GalleryHero />
                <GalleryGrid />
            </main>

            <Footer />
        </div>
    );
};

export default GalleryPage;
