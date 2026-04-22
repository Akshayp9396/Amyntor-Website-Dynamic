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
import JobApplication from './pages/public/JobApplication';
import Partners from './pages/public/Partners';
import PrivacyPolicy from './pages/public/PrivacyPolicy';

// Notification System
import { NotificationProvider } from './admin/context/NotificationContext';
import GlobalNotification from './admin/components/GlobalNotification';

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
import ManageApplications from './admin/pages/ManageApplications';
import ManageContact from './admin/pages/ManageContact';
import ManagePartners from './admin/pages/ManagePartners';
import AdminDashboard from './admin/pages/AdminDashboard';
import ManageInquiries from './admin/pages/ManageInquiries';

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <ContentProvider>
          <Router>
            <Routes>
              {/* ... routes remain unchanged ... */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:serviceId" element={<ServiceDetails />} />
              <Route path="/case-study" element={<CaseStudy />} />
              <Route path="/case-study/:projectId" element={<CaseStudyDetails />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/blogs" element={<BlogPage />} />
              <Route path="/blogs/:slug" element={<BlogDetails />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/careers/:jobSlug" element={<CareersDetails />} />
              <Route path="/careers/:jobSlug/apply" element={<JobApplication />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/quote" element={<div className="p-8 flex justify-center items-center h-screen text-2xl font-bold text-gray-400">Get Quote Page (Under Construction)</div>} />

              <Route path="/admin/login" element={<AdminLogin />} />

              <Route path="/admin" element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="home" element={<ManageHome />} />
                  <Route path="about" element={<ManageAbout />} />
                  <Route path="services" element={<ManageServices />} />
                  <Route path="case-studies" element={<ManageCaseStudies />} />
                  <Route path="blogs" element={<ManageBlogs />} />
                  <Route path="gallery" element={<ManageGallery />} />
                  <Route path="careers" element={<ManageCareers />} />
                  <Route path="applications" element={<ManageApplications />} />
                  <Route path="contact" element={<ManageContact />} />
                  <Route path="partners" element={<ManagePartners />} />
                  <Route path="inquiries" element={<ManageInquiries />} />
                </Route>
              </Route>
            </Routes>
          </Router>
          <GlobalNotification />
        </ContentProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
