import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Briefcase, UploadCloud, ChevronRight, X, FileText, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useContent } from '../../context/ContentContext';
import { useNotification } from '../../admin/context/NotificationContext';
import ContentService from '../../services/contentService';

const JobApplication = () => {
    const { careersPageData } = useContent();
    const { showNotification } = useNotification();
    const { jobSlug } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    // 🛡️ REFINED FORM STATE
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [jobSlug]);

    const job = careersPageData?.openRoles.find(r => r.slug === jobSlug);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Phone Validation (Exactly 10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Phone number must be exactly 10 digits';
        }

        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 1 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, file: "Please upload a file smaller than 1MB." }));
                e.target.value = "";
                return;
            }
            setErrors(prev => ({ ...prev, file: null }));
            setFile(selectedFile);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            if (droppedFile.size > 1 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, file: "Please upload a file smaller than 1MB." }));
                return;
            }
            setErrors(prev => ({ ...prev, file: null }));
            setFile(droppedFile);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const removeFile = () => {
        setFile(null);
        setErrors(prev => ({ ...prev, file: null }));
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // If a user navigates manually to a broken job slug
    if (!job) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
                <Navbar />
                <main className="flex-grow flex flex-col items-center justify-center pt-24 pb-20 px-4">
                    <h1 className="text-4xl font-bold text-[#0b1021] mb-4 text-center">Job Not Found</h1>
                    <p className="text-slate-500 mb-8 text-center max-w-md">
                        The role you are trying to apply for might have been closed.
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const isValid = validateForm();
        if (!isValid) return;

        if (!file) {
            showNotification('Please upload your resume to proceed.', 'error');
            return;
        }

        try {
            const fd = new FormData();
            fd.append('job_id', job.id);
            fd.append('first_name', formData.firstName);
            fd.append('last_name', formData.lastName);
            fd.append('email', formData.email);
            fd.append('phone', formData.phone);
            fd.append('message', formData.message);
            fd.append('resume', file); // 'resume' matches the multer key in backend

            const result = await ContentService.submitApplication(fd);
            if (result.success) {
                setIsSubmitted(true);
                window.scrollTo(0, 0);
            } else {
                showNotification('ERROR: Failed to submit application. Please try again.', 'error');
            }
        } catch (err) {
            console.error('❌ Application Submit Failure:', err);
            showNotification('CRITICAL ERROR: We could not process your application at this time.', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar />

            {/* Primary Hero Section — Standardized height matched with ServiceDetails */}
            {!isSubmitted && (
                <section className="w-full bg-[#F8FAFC] px-4 md:px-8 py-4 md:py-6">
                    <div className="relative w-full h-[50vh] min-h-[380px] max-h-[500px] rounded-[2rem] md:rounded-[2.5rem] flex flex-col items-center justify-center bg-[#050B14] overflow-hidden shadow-2xl transition-all duration-300">
                        <div className="absolute inset-0 z-0">
                            <img
                                src="https://images.unsplash.com/photo-1573164713988-8665fc963095"
                                alt="Apply Background"
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
            )}

            {/* Application Form or Success State */}
            <main className={`flex-grow max-w-[900px] mx-auto w-full px-4 md:px-8 ${isSubmitted ? 'py-20 md:py-32' : 'py-8 md:py-12'}`}>
                <AnimatePresence mode="wait">
                    {!isSubmitted ? (
                        <motion.div
                            key="application-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden"
                        >
                            <div className="bg-slate-50 border-b border-slate-100 p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-[#0b1021]">Submit your Application</h2>
                                <p className="text-slate-500 mt-2">All fields marked with an asterisk (*) are required.</p>
                            </div>

                            <div className="p-6 md:p-8">
                                <form className="space-y-6 md:space-y-8" onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">First Name *</label>
                                            <input 
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 rounded-xl border ${errors.firstName ? 'border-red-500' : 'border-slate-200'} focus:border-brand-primary outline-none transition-all placeholder:text-slate-400 text-slate-700`} 
                                                placeholder="First Name" 
                                            />
                                            {errors.firstName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.firstName}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name *</label>
                                            <input 
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 rounded-xl border ${errors.lastName ? 'border-red-500' : 'border-slate-200'} focus:border-brand-primary outline-none transition-all placeholder:text-slate-400 text-slate-700`} 
                                                placeholder="Last Name" 
                                            />
                                            {errors.lastName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.lastName}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address *</label>
                                            <input 
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-slate-200'} focus:border-brand-primary outline-none transition-all placeholder:text-slate-400 text-slate-700`} 
                                                placeholder="Email Address" 
                                            />
                                            {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number *</label>
                                            <input 
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                maxLength="10"
                                                className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-slate-200'} focus:border-brand-primary outline-none transition-all placeholder:text-slate-400 text-slate-700`} 
                                                placeholder="10-digit Phone Number" 
                                            />
                                            {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Cover Letter / Message</label>
                                        <textarea 
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            rows="5" 
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-primary outline-none transition-all placeholder:text-slate-400 text-slate-700 resize-none" 
                                            placeholder="Tell us why you are a great fit for this role..."
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Resume *</label>
                                        
                                        {/* Upload Zone - Always Visible */}
                                        <div
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            onClick={() => fileInputRef.current.click()}
                                            className={`relative border-2 border-dashed rounded-2xl p-8 md:p-12 transition-all cursor-pointer flex flex-col items-center justify-center text-center group ${
                                                isDragging 
                                                    ? 'border-slate-400 bg-slate-50 scale-[1.01]' 
                                                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                        >
                                            <input 
                                                ref={fileInputRef}
                                                type="file" 
                                                accept=".pdf,.doc,.docx" 
                                                className="hidden" 
                                                onChange={handleFileChange}
                                            />
                                            <div className="w-16 h-16 flex items-center justify-center text-slate-400 mb-4 transition-all">
                                                <UploadCloud size={32} />
                                            </div>
                                            <p className="text-[17px] font-bold text-[#0b1021]">
                                                {isDragging ? "Drop your resume here" : "Click to upload or drag & drop"}
                                            </p>
                                            <p className="text-sm text-slate-500 mt-1 font-medium italic">Click again to replace existing file</p>
                                            <p className="text-xs text-slate-400 mt-3 uppercase tracking-widest font-bold">PDF, DOC, DOCX (Max 1MB)</p>
                                        </div>
                                        {errors.file && <p className="text-red-500 text-xs mt-2 font-semibold">{errors.file}</p>}

                                        {/* File Preview - Appears below when file is chosen */}
                                        <AnimatePresence>
                                            {file && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="mt-4 flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-white shadow-sm"
                                                >
                                                    <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div className="flex-grow min-w-0">
                                                        <p className="text-sm font-bold text-[#0b1021] truncate">{file.name}</p>
                                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-tighter">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                    </div>
                                                    <button 
                                                        type="button"
                                                        onClick={removeFile}
                                                        className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg text-slate-400 transition-colors"
                                                        title="Remove file"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-100">
                                        <Link to={`/careers/${job.slug}`} className="w-full sm:w-auto px-6 py-3.5 flex justify-center rounded-full font-bold text-slate-500 hover:bg-slate-100 transition-colors">
                                            Go Back
                                        </Link>
                                        <button type="submit" className="group relative inline-flex items-center gap-3 w-full sm:w-auto justify-center px-10 py-3.5 rounded-full bg-gradient-to-r from-brand-dark to-brand-primary text-white font-bold tracking-wide shadow-lg hover:shadow-brand-primary/30 transition-all hover:-translate-y-0.5">
                                            <span className="relative z-10">Submit Application</span>
                                            <ArrowRight size={18} className="relative z-10 transform transition-transform group-hover:translate-x-1" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success-state"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden text-center py-12 px-8 md:py-16"
                        >
                            <div className="relative w-20 h-20 mx-auto mb-8">
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                    className="w-full h-full rounded-full bg-green-100 flex items-center justify-center text-green-600"
                                >
                                    <CheckCircle size={44} />
                                </motion.div>
                                <motion.div 
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute inset-0 rounded-full border-4 border-green-500/20"
                                />
                            </div>
                            
                            <motion.h2 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-2xl md:text-3xl font-extrabold text-[#0b1021] mb-4"
                            >
                                Application Submitted Successfully!
                            </motion.h2>
                            
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-slate-500 text-base md:text-lg max-w-lg mx-auto mb-8 leading-relaxed"
                            >
                                Thank you for applying to Amyntor Tech Solutions. Our HR department is reviewing your profile and will contact you via email shortly.
                            </motion.p>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                            >
                                <Link 
                                    to="/careers"
                                    className="inline-flex items-center gap-3 px-8 py-3 text-[#0b1021] font-bold tracking-wide transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    <ArrowLeft size={20} />
                                    Return to Careers
                                </Link>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {!isSubmitted && <Footer />}
        </div>
    );
};

export default JobApplication;
