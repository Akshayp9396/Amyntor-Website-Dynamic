/**
 * Code Walkthrough
 * This is the root component of the React application.
 * It configures client-side routing using React Router DOM.
 * The Home page is set as the default index route.
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Public Components
import Home from './pages/public/Home';
import About from './pages/public/About';
import Services from './pages/public/Services';
import ServiceDetails from './pages/public/ServiceDetails';
import Contact from './pages/public/Contact';
import CaseStudy from './pages/public/CaseStudy';
import CaseStudyDetails from './pages/public/CaseStudyDetails';
import BlogPage from './pages/public/BlogPage';
import BlogDetails from './pages/public/BlogDetails';
import GalleryPage from './pages/public/GalleryPage';
import CareersPage from './pages/public/CareersPage';
import CareersDetails from './pages/public/CareersDetails';
// Admin Components
import { AuthProvider } from './admin/context/AuthContext';
import { ContentProvider } from './context/ContentContext';
import ProtectedRoute from './admin/components/ProtectedRoute';
import AdminLogin from './admin/pages/auth/AdminLogin';
import AdminLayout from './admin/layouts/AdminLayout';
import ManageServices from './admin/pages/ManageServices';
import ManageHome from './admin/pages/ManageHome';
import ManageCaseStudies from './admin/pages/ManageCaseStudies';
import ManageBlogs from './admin/pages/ManageBlogs';
import ManageAbout from './admin/pages/ManageAbout';
import ManageGallery from './admin/pages/ManageGallery';
import ManageCareers from './admin/pages/ManageCareers';
import ManageContact from './admin/pages/ManageContact';

function App() {
  return (
    <AuthProvider>
      <ContentProvider>
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
            <Route path="/blogs/:slug" element={<BlogDetails />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/careers/:jobSlug" element={<CareersDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/quote" element={<div className="p-8 flex justify-center items-center h-screen text-2xl font-bold text-gray-400">Get Quote Page (Under Construction)</div>} />

            {/* --- ADMIN DASHBOARD ROUTES --- */}
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                {/* The index route determines what loads when hitting just /admin */}
                <Route index element={<ManageHome />} />
                <Route path="home" element={<ManageHome />} />
                <Route path="about" element={<ManageAbout />} />
                <Route path="services" element={<ManageServices />} />
                <Route path="case-studies" element={<ManageCaseStudies />} />
                <Route path="blogs" element={<ManageBlogs />} />
                <Route path="gallery" element={<ManageGallery />} />
                <Route path="careers" element={<ManageCareers />} />
                <Route path="contact" element={<ManageContact />} />
                <Route path="team" element={<div className="p-8 text-slate-800">Manage Team (Coming Soon)</div>} />
                <Route path="settings" element={<div className="p-8 text-slate-800">Platform Settings (Coming Soon)</div>} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </ContentProvider>
    </AuthProvider>
  );
}

export default App;
