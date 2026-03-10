import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BlogHero from '../../components/BlogPage/BlogHero';
import BlogList from '../../components/BlogPage/BlogList';

const BlogPage = () => {
    // Scroll to top on page mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#F5F8FA] overflow-hidden">
            <Navbar />

            <main>
                <BlogHero />
                <BlogList />
            </main>

            <Footer />
        </div>
    );
};

export default BlogPage;
