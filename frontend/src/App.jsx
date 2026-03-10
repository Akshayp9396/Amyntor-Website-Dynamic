/**
 * Code Walkthrough
 * This is the root component of the React application.
 * It configures client-side routing using React Router DOM.
 * The Home page is set as the default index route.
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Services from './pages/public/Services';
import ServiceDetails from './pages/public/ServiceDetails';
import Contact from './pages/public/Contact';
import CaseStudy from './pages/public/CaseStudy';
import CaseStudyDetails from './pages/public/CaseStudyDetails';
import BlogPage from './pages/public/BlogPage';
import GalleryPage from './pages/public/GalleryPage';
import CareersPage from './pages/public/CareersPage';
import CareersDetails from './pages/public/CareersDetails';


function App() {
  return (
    <Router>
      <Routes>
        {/* Main Landing Route */}
        <Route path="/" element={<Home />} />

        {/* Phase 2 Linked Routes */}
        <Route path="/about" element={<About />} />

        {/* Placeholder Routes for pending sections */}
        <Route path="/services" element={<Services />} />
        <Route path="/services/:serviceId" element={<ServiceDetails />} />
        <Route path="/case-study" element={<CaseStudy />} />
        <Route path="/case-study/:projectId" element={<CaseStudyDetails />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/careers/:jobSlug" element={<CareersDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/quote" element={<div className="p-8 flex justify-center items-center h-screen text-2xl font-bold text-gray-400">Get Quote Page (Under Construction)</div>} />
      </Routes>
    </Router>
  );
}

export default App;
