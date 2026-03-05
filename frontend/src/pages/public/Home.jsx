import React from 'react';

import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import AboutSection from '../../components/AboutSection';
import ServicesSection from '../../components/ServicesSection';
import TestimonialsSection from '../../components/TestimonialsSection';
import CaseStudySection from '../../components/CaseStudySection';
import PartnersSection from '../../components/PartnersSection';
import BlogSection from '../../components/BlogSection';
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
