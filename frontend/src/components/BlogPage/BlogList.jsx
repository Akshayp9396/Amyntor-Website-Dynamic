import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '../../context/ContentContext';

const BlogList = () => {
    const { blogPageData } = useContent();
    const blogList = blogPageData?.blogList;

    const [activeCard, setActiveCard] = useState(null);

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

    if (!blogList) return null;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <section className="py-24 bg-[#F5F8FA]">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">

                {/* Header Section */}
                <div className="flex flex-col items-center text-center space-y-6 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-brand-primary/20 bg-blue-50 shadow-sm"
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-primary"></span>
                        <span className="font-bold text-[15.5px] tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-dark">{blogList.tag}</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#0b1021] leading-snug max-w-3xl tracking-tight"
                    >
                        {blogList.heading}
                    </motion.h2>
                </div>

                {/* Grid Layout */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "0px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {blogList.items.map((blog) => (
                        <motion.article
                            key={blog.id}
                            variants={cardVariants}
                            whileHover="hover"
                            animate={activeCard === blog.id ? "hover" : "initial"}
                            onMouseEnter={() => setActiveCard(blog.id)}
                            onMouseLeave={() => setActiveCard(null)}
                            onClick={() => setActiveCard(blog.id)}
                            className={`bg-white rounded-[2.5rem] p-0 shadow-sm transition-shadow duration-300 group flex flex-col h-full overflow-hidden border border-slate-100 ${activeCard === blog.id ? 'shadow-xl' : 'hover:shadow-xl'}`}
                        >
                            {/* Image Wrapper */}
                            <div className="relative h-[260px] mb-8 bg-slate-100 overflow-hidden">
                                <motion.img
                                    variants={{ hover: { scale: 1.1 } }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-full object-cover"
                                    draggable="false"
                                />

                                {/* Dynamic Cutout Date Badge Overlay */}
                                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl border border-slate-100/50 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-brand-primary" />
                                        <span className="text-[13px] font-bold text-slate-700">{formatDate(blog.date)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Static Content Body */}
                            <div className="px-8 pb-8 flex flex-col flex-grow bg-white">
                                <h3 className="text-xl md:text-2xl font-bold text-[#0b1021] mb-8 leading-snug hover:text-brand-primary transition-colors duration-300">
                                    <Link to={`/blogs/${blog.slug}`}>
                                        {blog.title}
                                    </Link>
                                </h3>

                                <div className="mt-auto">
                                    <hr className="border-slate-100 mb-6" />
                                    <div className="flex items-center">
                                        <Link
                                            to={`/blogs/${blog.slug}`}
                                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-200 text-[15px] font-bold text-slate-700 transition-colors duration-300 hover:shadow-sm ${activeCard === blog.id ? 'border-brand-primary' : 'group-hover:border-brand-primary'}`}
                                        >
                                            <span className={`transition-all duration-300 ${activeCard === blog.id ? 'bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-dark' : 'group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-brand-primary group-hover:to-brand-dark'}`}>Read More</span>
                                            <ArrowRight size={18} className={`transform transition-all duration-300 ${activeCard === blog.id ? 'translate-x-1 text-brand-primary' : 'group-hover:translate-x-1 group-hover:text-brand-primary'}`} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>

            </div>
        </section>
    );
};

export default BlogList;
