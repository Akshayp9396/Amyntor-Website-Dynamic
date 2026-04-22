/**
 * Code Walkthrough
 * This is the dynamic page template for individual Job Openings.
 * It reads the `jobSlug` from the URL, finds the job in `careersData.js`, and displays the job description.
 */
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, SearchX, Briefcase, Calendar, Clock, MapPin, Users, ChevronRight } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useContent } from '../../context/ContentContext';

const CareersDetails = () => {
    const { careersPageData } = useContent();
    const { jobSlug } = useParams();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [jobSlug]);

    const job = careersPageData?.openRoles.find(r => r.slug === jobSlug);

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
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Navbar />

            {/* Primary Hero Section — Standardized height matched with ServiceDetails */}
            <section className="w-full bg-[#F8FAFC] px-4 md:px-8 py-4 md:py-6 text-center">
                <div className="relative w-full h-[50vh] min-h-[380px] max-h-[500px] rounded-[2rem] md:rounded-[2.5rem] flex flex-col items-center justify-center bg-[#050B14] overflow-hidden shadow-2xl transition-all duration-300">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1573164713988-8665fc963095"
                            alt="Job Role Background"
                            className="w-full h-full object-cover opacity-[0.35]"
                        />
                        <div className="absolute inset-0 bg-[#050B14]/40 mix-blend-multiply"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050B14]/30 to-[#050B14]/90"></div>
                    </div>

                    <div className="relative z-10 text-center px-6 max-w-4xl mx-auto w-full h-full flex flex-col items-center justify-center">
                        <div className="flex flex-col items-center">
                            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-brand-dark to-brand-primary text-white text-[13px] sm:text-sm font-semibold tracking-wide shadow-lg mb-6 shadow-brand-primary/20">
                                <Briefcase size={16} strokeWidth={2.5} />
                                CAREERS
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight drop-shadow-md">
                                Amyntor Tech Solutions
                            </h1>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Unified Content Container — Aligned with Navbar at max-w-[1400px] */}
            <main className="flex-grow max-w-[1400px] mx-auto w-full px-4 md:px-8 py-12">
                <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">

                    {/* Header Section within Container */}
                    <div className="p-8 md:p-12 border-b border-slate-100">
                        {/* Security Tag (job.category) removed as requested */}

                        <h2 className="text-3xl md:text-5xl font-extrabold text-[#0b1021] mb-10 tracking-tight">
                            {job.title}
                        </h2>

                        {/* Stretched Horizontal Metadata Row with Bar Separators */}
                        <div className="flex flex-wrap items-center justify-between gap-y-6">
                            <div className="flex items-center flex-1">
                                <div className="flex items-center gap-3">
                                    <Clock size={20} className="text-brand-primary shrink-0" />
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Experience</p>
                                        <p className="font-bold text-[#0b1021] text-[15px]">{job.experience}</p>
                                    </div>
                                </div>
                                <div className="hidden lg:block mx-auto w-px h-8 bg-slate-200" /> {/* Centered Bar */}
                            </div>

                            <div className="flex items-center flex-1">
                                <div className="flex items-center gap-3">
                                    <Users size={20} className="text-brand-primary shrink-0" />
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Openings</p>
                                        <p className="font-bold text-[#0b1021] text-[15px]">{job.openings} Positions</p>
                                    </div>
                                </div>
                                <div className="hidden lg:block mx-auto w-px h-8 bg-slate-200" /> {/* Centered Bar */}
                            </div>

                            <div className="flex items-center flex-1">
                                <div className="flex items-center gap-3">
                                    <Briefcase size={20} className="text-brand-primary shrink-0" />
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Job Type</p>
                                        <p className="font-bold text-[#0b1021] text-[15px]">{job.type || 'Full-Time'}</p>
                                    </div>
                                </div>
                                <div className="hidden lg:block mx-auto w-px h-8 bg-slate-200" /> {/* Centered Bar */}
                            </div>

                            <div className="flex items-center flex-1">
                                <div className="flex items-center gap-3">
                                    <MapPin size={20} className="text-brand-primary shrink-0" />
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Job Location</p>
                                        <p className="font-bold text-[#0b1021] text-[15px]">Trivandrum (Hybrid)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section within same Container */}
                    <div className="p-8 md:p-12 space-y-12 bg-white">
                        <div>
                            <h3 className="text-2xl font-bold text-[#0b1021] mb-6">Role Overview</h3>
                            <p className="text-slate-600 text-[15.5px] md:text-lg leading-relaxed text-justify">
                                {job.roleOverview}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-[#0b1021] mb-4">Job Responsibilities</h3>
                            <ul className="list-disc pl-5 space-y-3 text-slate-600 text-[15.5px] marker:text-brand-primary">
                                {job.responsibilities?.map((item, index) => (
                                    <li key={index} className="leading-relaxed text-justify">{item}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-[#0b1021] mb-4">Qualifications and General Skills</h3>
                            <ul className="list-disc pl-5 space-y-3 text-slate-600 text-[15.5px] marker:text-brand-primary">
                                {job.qualifications?.map((item, index) => (
                                    <li key={index} className="leading-relaxed text-justify">{item}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-8 border-t border-slate-100">
                            <h3 className="text-xl font-bold text-[#0b1021] mb-4">How to Apply</h3>
                            <p className="text-slate-600 text-[15.5px] md:text-lg leading-relaxed text-justify mb-8">
                                {job.howToApply ? (
                                    <span>{job.howToApply}</span>
                                ) : (
                                    <>
                                        To apply for this position, please send your resume and cover letter to our HR department at <a href={`mailto:hr@amyntortech.com?subject=Application for ${job.title}`} className="text-brand-primary font-semibold hover:underline">hr@amyntortech.com</a>, or submit your details using the application form below.
                                    </>
                                )}
                            </p>

                            <Link
                                to={`/careers/${job.slug}/apply`}
                                className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-brand-dark to-brand-primary text-white font-bold tracking-wide shadow-lg hover:shadow-brand-primary/30 transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                <span className="relative z-10">Apply Now</span>
                                <ArrowRight size={18} className="relative z-10 transform transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CareersDetails;
