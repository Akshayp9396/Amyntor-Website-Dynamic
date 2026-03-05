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
        <Route path="/case-study" element={<div className="p-8 flex justify-center items-center h-screen text-2xl font-bold text-gray-400">Case Study Page (Under Construction)</div>} />
        <Route path="/gallery" element={<div className="p-8 flex justify-center items-center h-screen text-2xl font-bold text-gray-400">Gallery Page (Under Construction)</div>} />
        <Route path="/blogs" element={<div className="p-8 flex justify-center items-center h-screen text-2xl font-bold text-gray-400">Blogs Page (Under Construction)</div>} />
        <Route path="/careers" element={<div className="p-8 flex justify-center items-center h-screen text-2xl font-bold text-gray-400">Careers Page (Under Construction)</div>} />
        <Route path="/contact" element={<div className="p-8 flex justify-center items-center h-screen text-2xl font-bold text-gray-400">Contact Us Page (Under Construction)</div>} />
        <Route path="/quote" element={<div className="p-8 flex justify-center items-center h-screen text-2xl font-bold text-gray-400">Get Quote Page (Under Construction)</div>} />
      </Routes>
    </Router>
  );
}

export default App;
