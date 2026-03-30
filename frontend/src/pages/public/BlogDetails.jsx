/**
 * Code Walkthrough: BlogDetails.jsx
 * ──────────────────────────────────
 * This is the dynamic template for individual blog posts.
 * It uses React Router's `useParams` to extract the blog `slug` from the URL,
 * finds the matching blog from `mockBlogPageData`, and renders:
 *
 * 1. Navbar + Hero (reused from BlogPage)
 * 2. Main Content (2/3 width):
 *    - Blog cover image
 *    - Date + Category badge
 *    - Overview paragraph
 *    - Dynamic sections (heading + paragraph + tick-mark ✓ points)
 *    - Conclusion block
 * 3. Sidebar (1/3 width):
 *    - Contact CTA card (same premium design as ServiceDetails)
 *    - Related Blogs list
 * 4. Footer
 *
 * This structure is designed to map 1:1 to a future MySQL schema where
 * the admin can dynamically add/edit sections per blog post.
 */

import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, Headphones, Share2, Calendar, CheckCircle2 } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useContent } from '../../context/ContentContext';

const BlogDetails = () => {
    const { slug } = useParams();
    const { blogPageData } = useContent();

    // Find the current blog post by slug
    const blog = blogPageData?.blogList?.items.find(item => item.slug === slug);

    // Get related blogs (all blogs except the current one)
    const relatedBlogs = blogPageData?.blogList?.items.filter(item => item.slug !== slug) || [];

    // Hero data for the shared hero section
    const hero = blogPageData?.hero;

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return date.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (e) {
            return dateStr;
        }
    };

    // Scroll to top whenever the slug changes (user clicks a related blog)
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    // Framer Motion animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeInOut" }
        }
    };

    // Error Handling: Display a "Not Found" state if slug is invalid
    if (!blog) {
        return (
            <div className="min-h-screen flex flex-col pt-20 bg-[#F5F8FA]">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-4xl font-bold text-[#0b1021] mb-4">Blog Post Not Found</h1>
                    <p className="text-slate-500 mb-8 max-w-md">The blog post you are looking for does not exist or has been moved.</p>
                    <Link to="/blogs" className="px-8 py-3 bg-gradient-to-r from-brand-dark to-brand-primary text-white font-bold rounded-full hover:opacity-90 transition-opacity">
                        RETURN TO BLOG
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#F5F8FA] font-sans">
            <Navbar />

            {/* ─────────────────────────────────────────────────────────────
                HERO SECTION — Reuses the same dark-overlay pattern as BlogHero
               ───────────────────────────────────────────────────────────── */}
            <section className="w-full bg-[#F8FAFC] px-4 md:px-8 py-4 md:py-6">
                <div className="relative w-full h-[50vh] min-h-[380px] max-h-[500px] rounded-[2rem] md:rounded-[2.5rem] flex flex-col items-center justify-center bg-[#050B14] overflow-hidden shadow-2xl">

                    {/* Background Image with Overlays */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover opacity-[0.35]"
                        />
                        <div className="absolute inset-0 bg-[#050B14]/40 mix-blend-multiply"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050B14]/30 to-[#050B14]/90"></div>
                    </div>

                    {/* Content Area */}
                    <div className="relative z-10 text-center px-6 max-w-4xl mx-auto w-full mt-16 md:mt-20">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-col items-center"
                        >
                            {/* Badge */}
                            <motion.div variants={itemVariants} className="mb-6">
                                <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-brand-dark to-brand-primary text-white text-[13px] sm:text-sm font-semibold tracking-wide shadow-lg shadow-brand-primary/25">
                                    <Share2 size={16} strokeWidth={2.5} />
                                    {hero.tag}
                                </span>
                            </motion.div>

                            {/* Title — Shows the blog post title */}
                            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-md">
                                {hero.title}
                            </motion.h1>

                            {/* Breadcrumbs — Home > Resources > Blog > Post Title */}
                            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-white/80 text-[15px] font-medium mb-12">
                                <Link to="/" className="hover:text-white transition-colors drop-shadow-sm">Home</Link>
                                <ChevronRight size={14} className="text-white/60" />
                                <span className="text-white/70">Resources</span>
                                <ChevronRight size={14} className="text-white/60" />
                                <span className="text-white">Blogs</span>
                            </motion.div>

                            {/* Tagline */}
                            <motion.p variants={itemVariants} className="text-[15px] md:text-base text-white/90 max-w-[85%] sm:max-w-2xl mx-auto leading-relaxed font-light drop-shadow-sm">
                                {hero.tagline}
                            </motion.p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ─────────────────────────────────────────────────────────────
                BODY CONTENT — 2/3 Main + 1/3 Sidebar
               ───────────────────────────────────────────────────────────── */}
            <section className="py-20 flex-grow">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                    <div className="flex flex-col lg:flex-row gap-16">

                        {/* ═══════════════════════════════════════════
                            MAIN CONTENT COLUMN (2/3 width)
                           ═══════════════════════════════════════════ */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="lg:w-2/3"
                        >
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">

                                {/* Blog Cover Image */}
                                <div className="w-full h-[350px] md:h-[450px] overflow-hidden">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Content Body */}
                                <div className="p-8 md:p-12">

                                    <div className="flex flex-wrap items-center gap-4 mb-8">
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100">
                                            <Calendar size={14} className="text-brand-primary" />
                                            <span className="text-sm font-semibold text-slate-600">{formatDate(blog.date)}</span>
                                        </div>
                                    </div>

                                    {/* Blog Title */}
                                    <h1 className="text-2xl md:text-3xl font-bold text-[#0b1021] mb-6 leading-tight tracking-tight">
                                        {blog.title}
                                    </h1>

                                    {/* Overview Paragraph */}
                                    <p className="text-slate-600 text-[15.5px] leading-relaxed text-justify mb-10">
                                        {blog.overview}
                                    </p>

                                    {/* ─── Dynamic Sections ─── */}
                                    {blog.sections && blog.sections.map((section, idx) => (
                                        <div key={idx} className="mb-10">
                                            {/* Section Heading */}
                                            <h2 className="text-xl md:text-[22px] font-bold text-[#0b1021] mb-4 tracking-tight">
                                                {section.heading}
                                            </h2>

                                            {/* Section Paragraph */}
                                            <p className="text-slate-600 text-[15.5px] leading-relaxed text-justify mb-6">
                                                {section.paragraph}
                                            </p>

                                            {/* Tick-mark Points (✓ instead of dots) */}
                                            {section.points && section.points.length > 0 && (
                                                <ul className="space-y-3">
                                                    {section.points.map((point, pIdx) => (
                                                        <li key={pIdx} className="flex items-start gap-3">
                                                            {/* Gradient Tick Icon */}
                                                            <div className="mt-0.5 shrink-0">
                                                                <CheckCircle2 size={18} className="text-brand-primary" strokeWidth={2} />
                                                            </div>
                                                            <span className="text-slate-600 text-[15px] leading-relaxed text-justify">
                                                                {point}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}

                                    {/* ─── Conclusion ─── */}
                                    {blog.conclusion && (
                                        <div className="mt-12 pt-10 border-t border-slate-100">
                                            <h3 className="text-[22px] font-bold text-[#0b1021] mb-6">Conclusion</h3>
                                            <p className="text-slate-700 leading-relaxed text-[15.5px] text-justify">
                                                {blog.conclusion}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* ═══════════════════════════════════════════
                            SIDEBAR (1/3 width)
                           ═══════════════════════════════════════════ */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="lg:w-1/3 space-y-8"
                        >
                            {/* ── Premium Contact CTA Card ── */}
                            <div className="bg-white rounded-[2.5rem] p-10 relative overflow-hidden border border-slate-100 shadow-[0_15px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_80px_-15px_rgba(2,161,253,0.12)] transition-all duration-500 group">
                                {/* Animated Decorative Element */}
                                <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-brand-primary/10 rounded-full blur-[60px] group-hover:bg-brand-primary/20 transition-all duration-700"></div>

                                <div className="relative z-10 flex flex-col items-center">
                                    {/* Icon Wrapper */}
                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 relative group-hover:scale-110 transition-transform duration-500 shadow-sm border border-slate-100">
                                        <Headphones size={30} className="text-brand-primary" strokeWidth={1.5} />
                                    </div>

                                    <h3 className="text-[22px] font-bold text-black mb-4 tracking-tight leading-tight text-center">
                                        Need Expert Guidance?
                                    </h3>

                                    <p className="text-slate-500 text-[14.5px] leading-relaxed text-justify mb-10 w-full opacity-90">
                                        Have questions about the topics covered in this article? Our team is ready to help with personalized solutions.
                                    </p>

                                    <Link
                                        to="/contact"
                                        className="w-fit inline-flex items-center justify-center gap-2.5 py-3.5 px-10 bg-white border border-slate-200 rounded-full font-bold tracking-widest text-sm hover:border-brand-primary hover:-translate-y-1 transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] hover:shadow-brand-primary/10 group/btn"
                                    >
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary">
                                            GET IN TOUCH
                                        </span>
                                        <ArrowRight size={18} className="text-brand-primary group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>

                            {/* ── Related Blogs List ── */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                                <h3 className="text-lg font-bold text-[#0b1021] mb-6">Related Articles</h3>
                                <div className="flex flex-col space-y-3">
                                    {relatedBlogs.map((relBlog) => (
                                        <Link
                                            key={relBlog.id}
                                            to={`/blogs/${relBlog.slug}`}
                                            className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group/rel"
                                        >
                                            {/* Thumbnail */}
                                            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                                                <img
                                                    src={relBlog.image}
                                                    alt={relBlog.title}
                                                    className="w-full h-full object-cover group-hover/rel:scale-110 transition-transform duration-300"
                                                />
                                            </div>
                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-[#0b1021] leading-snug mb-1 line-clamp-2 group-hover/rel:text-brand-primary transition-colors">
                                                    {relBlog.title}
                                                </h4>
                                                <span className="text-xs text-slate-400 font-medium">{relBlog.date}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default BlogDetails;
