import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, SearchX } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CaseStudyDetailsHero from '../../components/CaseStudyDetailsPage/CaseStudyDetailsHero';
import CaseStudyDetailsContent from '../../components/CaseStudyDetailsPage/CaseStudyDetailsContent';
import CaseStudySidebar from '../../components/CaseStudyDetailsPage/CaseStudySidebar';
import { useContent } from '../../context/ContentContext';

/**
 * Code Walkthrough
 * This is the dynamic page template for individual Case Studies.
 * It uses the purely dynamic `projectId` parameter from the URL to fetch the exact study data.
 * Features a seamless "Not Found" state and a premium 70/30 desktop layout wrapping the Content and Sidebar.
 */
const CaseStudyDetails = () => {
    const { projectId } = useParams();
    const { caseStudyPageData } = useContent();

    // Scroll to top automatically when navigating to a new project
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [projectId]);

    if (!caseStudyPageData) return null;

    // Find the specific project from the context
    const project = caseStudyPageData.caseStudies.find(
        (p) => p.id === parseInt(projectId)
    );

    // Fallback UI if project doesn't exist
    if (!project) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
                <Navbar />
                <main className="flex-grow flex flex-col items-center justify-center pt-24 pb-20 px-4">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
                        <SearchX size={40} />
                    </div>
                    <h1 className="text-4xl font-bold text-[#0b1021] mb-4 text-center">Project Not Found</h1>
                    <p className="text-slate-500 mb-8 text-center max-w-md">
                        The case study you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>
                    <Link to="/case-study" className="bg-brand-primary text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-brand-dark transition-colors shadow-lg">
                        <ArrowLeft size={18} />
                        Back to Case Studies
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    // Main Dynamic Render
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow">
                {/* Reusable Hero Component */}
                <CaseStudyDetailsHero project={project} />

                {/* Content Structure Wrapper (70/30 Split on Desktop) */}
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-16 pb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">

                        {/* Main Body Column (Spans 2/3) */}
                        <div className="lg:col-span-2">
                            <CaseStudyDetailsContent project={project} />
                        </div>

                        {/* Sticky Sidebar Right (Spans 1/3) */}
                        <div className="lg:col-span-1">
                            <CaseStudySidebar />
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CaseStudyDetails;
