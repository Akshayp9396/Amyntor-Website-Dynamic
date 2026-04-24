import React from 'react';

import Navbar from '../../components/Navbar';
import Hero from '../../components/HomePage/Hero';
import AboutSection from '../../components/HomePage/AboutSection';
import ServicesSection from '../../components/HomePage/ServicesSection';
import TestimonialsSection from '../../components/HomePage/TestimonialsSection';
import CaseStudySection from '../../components/HomePage/CaseStudySection';
import PartnersSection from '../../components/HomePage/PartnersSection';
import BlogSection from '../../components/HomePage/BlogSection';
import Footer from '../../components/Footer';
/**
 * Code Walkthrough
 * This is the public Home Page component.
 * It assembles the main Navbar, Hero section, and About Us section.
 * Additional sections (Services, Case Studies, etc.) will be added here consecutively.
 */
const Home = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
                <Hero />
                <AboutSection />
                <ServicesSection />
                <TestimonialsSection />
                <CaseStudySection />
                <PartnersSection />
                <BlogSection />

                {/* Future sections (Case Studies, etc.) will go here */}
            </main>
            <Footer />
        </div>
    );
};

export default Home;
