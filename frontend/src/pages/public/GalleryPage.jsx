import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import GalleryHero from '../../components/GalleryPage/GalleryHero';
import GalleryGrid from '../../components/GalleryPage/GalleryGrid';
import { useContent } from '../../context/ContentContext';

const GalleryPage = () => {
    const { loading } = useContent();

    // Scroll to top on page mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-blue-500 font-bold tracking-widest text-[10px] uppercase animate-pulse">Establishing Visual Mission...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
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
