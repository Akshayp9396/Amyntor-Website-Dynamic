/**
 * Code Walkthrough
 * This is the dynamic page template for individual Job Openings.
 * It reads the `jobSlug` from the URL, finds the job in `careersData.js`, and displays the job description.
 */
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, SearchX, Briefcase, Calendar, Clock, MapPin } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { careersPageData } from '../../components/CareersPage/careersData';

const CareersDetails = () => {
    const { jobSlug } = useParams();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [jobSlug]);

    const job = careersPageData.openRoles.find(r => r.slug === jobSlug);

    if (!job) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
                <Navbar />
                <main className="flex-grow flex flex-col items-center justify-center pt-24 pb-20 px-4">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
                        <SearchX size={40} />
                    </div>
                    <h1 className="text-4xl font-bold text-[#0b1021] mb-4 text-center">Job Not Found</h1>
                    <p className="text-slate-500 mb-8 text-center max-w-md">
                        The role you are looking for might have been closed or removed.
                    </p>
                    <Link to="/careers" className="bg-brand-primary text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-brand-dark transition-colors shadow-lg">
                        <ArrowLeft size={18} />
                        Back to Careers
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar />

            {/* Premium Hero Wrapper */}
            <section className="w-full bg-slate-50 px-4 md:px-8 py-4 md:py-6">
                <div className="relative w-full h-[40vh] min-h-[320px] max-h-[400px] rounded-[2rem] md:rounded-[2.5rem] flex flex-col items-center justify-center bg-[#050B14] overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1573164713988-8665fc963095"
                            alt="Job Role Background"
                            className="w-full h-full object-cover opacity-[0.2]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050B14]/60 to-[#050B14]"></div>
                    </div>
                    <div className="relative z-10 text-center px-6 max-w-4xl mx-auto w-full">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[13px] font-semibold tracking-wide shadow-lg mb-6">
                            <Briefcase size={14} />
                            {job.category}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-md">
                            {job.title}
                        </h1>
                    </div>
                </div>
            </section>

            {/* Main Content Split Area */}
            <main className="flex-grow max-w-[1400px] mx-auto w-full px-4 md:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

                    {/* Left Column (Job Details) */}
                    <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100">
                        <h2 className="text-2xl font-bold text-[#0b1021] mb-6">Role Overview</h2>
                        <p className="text-slate-600 text-[15.5px] md:text-lg leading-relaxed mb-8">
                            {job.roleOverview}
                        </p>

                        <h3 className="text-xl font-bold text-[#0b1021] mb-4">Job Responsibilities</h3>
                        <ul className="list-disc pl-5 space-y-3 text-slate-600 text-[15.5px] mb-8 marker:text-brand-primary">
                            {job.responsibilities?.map((item, index) => (
                                <li key={index} className="leading-relaxed">{item}</li>
                            ))}
                        </ul>

                        <h3 className="text-xl font-bold text-[#0b1021] mb-4">Qualifications and General Skills</h3>
                        <ul className="list-disc pl-5 space-y-3 text-slate-600 text-[15.5px] mb-8 marker:text-brand-primary">
                            {job.qualifications?.map((item, index) => (
                                <li key={index} className="leading-relaxed">{item}</li>
                            ))}
                        </ul>

                        {/* Apply Section moved to bottom of Left Column */}
                        <div className="mt-8">
                            <h3 className="text-xl font-bold text-[#0b1021] mb-4">How to Apply</h3>
                            <p className="text-slate-600 text-[15.5px] md:text-lg leading-relaxed">
                                To apply for this position, please send your resume to <a href={`mailto:hr@amyntortech.com?subject=Application for ${job.title}`} className="text-brand-primary font-semibold hover:underline">hr@amyntortech.com</a>. Be sure to include the job title in the subject line.
                            </p>
                        </div>
                    </div>

                    {/* Right Sticky Sidebar */}
                    <div className="lg:col-span-1 border border-slate-100 bg-white rounded-[2rem] p-8 shadow-sm lg:sticky lg:top-24">
                        <h3 className="text-xl font-bold text-[#0b1021] mb-6 border-b border-slate-100 pb-4">Job Summary</h3>

                        <div className="space-y-6 mb-8">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <Clock size={18} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400 font-medium">Experience Level</p>
                                    <p className="font-semibold text-[#0b1021]">{job.experience}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <Briefcase size={18} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400 font-medium">Openings</p>
                                    <p className="font-semibold text-[#0b1021]">{job.openings}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <Calendar size={18} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400 font-medium">Date Posted</p>
                                    <p className="font-semibold text-[#0b1021]">{job.postedDate}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400 font-medium">Location</p>
                                    <p className="font-semibold text-[#0b1021]">Trivandrum (Hybrid)</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CareersDetails;
