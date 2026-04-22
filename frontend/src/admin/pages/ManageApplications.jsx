/**
 * Code Walkthrough: ManageApplications.jsx (V2 - Modern Talent Pipeline)
 * 
 * Purpose: A high-density recruitment management system.
 * MISSION: Exact visual alignment with ManageServices.jsx list-style UI.
 * DESIGN: Neutral, professional interaction with sophisticated filtering.
 * FEATURES: 
 *  1. Dynamic Sorting (Job ID, Name, Date Applied)
 *  2. Multi-State Filtering (Tabs: All, Shortlisted, Rejected, Hired)
 *  3. Integrated Resume Viewer (Modal System)
 *  4. Instant Status Transitions
 *  5. Date Range Scoping
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Download,
    Eye,
    Mail,
    Phone,
    X,
    Filter,
    Inbox,
    Calendar,
    ChevronUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsUpDown,
    FileText,
    ArrowUpRight,
    Loader2
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { AdminCard } from '../components/AdminUI';
import ContentService from '../../services/contentService';

const ManageApplications = () => {
    const { showNotification } = useNotification();

    // Application States
    const [searchTerm, setSearchTerm] = useState('');
    const [activeStatusTab, setActiveStatusTab] = useState('all');
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [viewingResume, setViewingResume] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // 📊 PAGINATION ENGINE
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 50;

    // 🛡️ LIVE DATABASE: Load applicants from MySQL on mount
    const [applicants, setApplicants] = useState([]);

    useEffect(() => {
        const fetchApplicants = async () => {
            setIsLoading(true);
            try {
                const result = await ContentService.getApplications();
                if (result.success) {
                    // Normalize real DB columns to what the UI expects
                    const normalized = result.data.map(app => ({
                        ...app,
                        name: `${app.first_name || ''} ${app.last_name || ''}`.trim() || app.name || 'Unknown',
                        date: app.created_at ? app.created_at.split('T')[0] : (app.applied_date ? app.applied_date.split('T')[0] : ''),
                        jobCode: app.jobCode || `JOB-${app.job_id || '??'}`,
                        role: app.jobTitle || `Position #${app.job_id || '?'}`,
                        resume_url: app.resume_url ? (app.resume_url.startsWith('http') ? app.resume_url : `http://localhost:5050${app.resume_url}`) : null,
                        originalName: app.original_resume_name || 'Resume.pdf',
                        status: {
                            'New': 'applied',
                            'Reviewing': 'applied',
                            'Shortlisted': 'shortlisted',
                            'Rejected': 'rejected'
                        }[app.status] || 'applied'
                    }));
                    setApplicants(normalized);
                }
            } catch (err) {
                console.error('❌ Pipeline Fetch Error:', err);
                showNotification('Failed to load applications from server.', 'error');
            } finally {
                setIsLoading(false);
            }
        };
        fetchApplicants();
    }, []);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, activeStatusTab, dateRange]);

    // 🛡️ DATE VALIDATION PROTOCOL
    useEffect(() => {
        if (dateRange.from && dateRange.to) {
            if (new Date(dateRange.from) > new Date(dateRange.to)) {
                showNotification("Invalid Date Range! 'From' date cannot be greater than 'To' date.", "error");
            }
        }
    }, [dateRange.from, dateRange.to]);

    // 🏎️ SORTING ENGINE
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <ChevronsUpDown size={12} className="text-slate-300" />;
        return sortConfig.direction === 'asc' ? <ChevronUp size={12} className="text-slate-900" /> : <ChevronDown size={12} className="text-slate-900" />;
    };

    const getSortStyles = (key) => {
        return "text-slate-500";
    };

    // 🎣 FILTERING LOGIC
    const processedApplicants = useMemo(() => {
        // Date range validation check
        const fromDate = dateRange.from ? new Date(dateRange.from) : null;
        const toDate = dateRange.to ? new Date(dateRange.to) : null;
        const isDateRangeInvalid = fromDate && toDate && fromDate > toDate;

        if (isDateRangeInvalid) return [];

        return applicants
            .filter(app => {
                const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    app.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    app.jobCode.toLowerCase().includes(searchTerm.toLowerCase());

                const matchesStatus = activeStatusTab === 'all' || app.status === activeStatusTab;

                const appDate = new Date(app.date);

                // Only filter if BOTH From and To dates are provided
                const isRangeComplete = fromDate && toDate;
                const matchesDate = isRangeComplete 
                    ? (appDate >= fromDate && appDate <= toDate) 
                    : true;

                return matchesSearch && matchesStatus && matchesDate;
            })
            .sort((a, b) => {
                if (!sortConfig.key) return 0;
                if (sortConfig.key === 'date') {
                    return sortConfig.direction === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
                }
                if (sortConfig.key === 'name' || sortConfig.key === 'jobCode') {
                    const valA = String(a[sortConfig.key] || '');
                    const valB = String(b[sortConfig.key] || '');
                    return sortConfig.direction === 'asc'
                        ? valA.localeCompare(valB)
                        : valB.localeCompare(valA);
                }
                return 0;
            });
    }, [applicants, searchTerm, activeStatusTab, dateRange, sortConfig]);

    // Derived chunk for current page
    const paginatedApplicants = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return processedApplicants.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [processedApplicants, currentPage]);

    const totalPages = Math.ceil(processedApplicants.length / ITEMS_PER_PAGE);

    // 🛡️ AUTO-SAVE: Status change is immediately persisted to MySQL
    const handleStatusChange = async (id, newStatus) => {
        // Optimistically update UI first for instant feedback
        setApplicants(prev => prev.map(app =>
            app.id === id ? { ...app, status: newStatus } : app
        ));
        try {
            const result = await ContentService.updateApplicationStatus(id, newStatus);
            if (result.success) {
                showNotification('Status updated successfully!', 'success');
            } else {
                showNotification('ERROR: Failed to update status.', 'error');
            }
        } catch (err) {
            console.error('❌ Status Update Error:', err);
            showNotification('ERROR: Failed to update status.', 'error');
        }
    };

    const statusTabs = [
        { id: 'all', label: 'All Applications' },

        { id: 'shortlisted', label: 'Shortlisted' },
        { id: 'hired', label: 'Hired' },
        { id: 'rejected', label: 'Rejected' },
    ];

    // 🛡️ MISSION: Professional Auto-Download Protocol
    const handleDownload = async (url, originalName) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = originalName || 'Resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            showNotification('Download started!', 'success');
        } catch (err) {
            console.error('❌ Download Failure:', err);
            showNotification('ERROR: Could not download file.', 'error');
        }
    };

    // 🛡️ LOADING STATE: Show spinner while fetching from MySQL
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={40} className="text-brand-primary animate-spin" />
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Pipeline Data...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-full space-y-6 pb-20 font-sans">

            {/* 🔍 TOP CONTROL BAR: Status (Left) & Date (Right) */}
            <div className="sticky top-0 z-30 bg-slate-50/80 backdrop-blur-md py-4 -mx-1 px-1 border-b border-slate-200/60 mb-2">
                <div className="flex items-center justify-between w-full">
                    {/* Status Navigation Tabs (Flat ManageCareers Style) */}
                    <div className="flex items-center p-1.5 bg-slate-100/80 border border-slate-200 rounded-full w-fit">
                        {statusTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveStatusTab(tab.id)}
                                className={`
                                    px-8 py-2.5 rounded-full text-[12px] transition-all whitespace-nowrap
                                    ${activeStatusTab === tab.id
                                        ? 'bg-white text-slate-900 font-extrabold shadow-sm'
                                        : 'text-slate-500 font-bold hover:text-slate-800'
                                    }
                                `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Date Scoping (Enhanced Identification) */}
                    <div className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-2.5 rounded-full shadow-sm mr-2">
                        <div className="flex items-center gap-2 border-r border-slate-200 pr-3">
                            <span className="text-[10px] font-semibold text-slate-400">From:</span>

                            <input
                                type="date"
                                value={dateRange.from}
                                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                                className="text-[10px] font-semibold text-slate-400 outline-none bg-transparent"
                            />
                        </div>
                        <div className="flex items-center gap-2 pl-2">
                            <span className="text-[10px] font-semibold text-slate-400">To:</span>

                            <input
                                type="date"
                                value={dateRange.to}
                                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                                className="text-[10px] font-semibold text-slate-400 outline-none bg-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 📜 PIPELINE TABLE */}
            <div className="mt-2 min-h-[600px]">
                <AdminCard 
                    title={`${activeStatusTab.charAt(0).toUpperCase() + activeStatusTab.slice(1)} Applications`}
                    actions={
                        <div className="relative group/search">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-slate-900 transition-colors" size={14} />
                            <input
                                type="text"
                                placeholder="Search by Job ID, Title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-11 pr-6 py-2.5 bg-slate-50/50 border border-slate-200 rounded-full text-[12px] font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-100 outline-none transition-all w-64"
                            />
                        </div>
                    }
                >
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mt-4 shadow-sm">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50/80 border-b border-slate-200">
                                <tr>
                                    <th
                                        onClick={() => handleSort('jobCode')}
                                        className={`px-6 py-4 font-black uppercase tracking-widest text-[10px] cursor-pointer transition-colors group ${getSortStyles('jobCode')}`}
                                    >
                                        <div className="flex items-center gap-1">
                                            Job ID {getSortIcon('jobCode')}
                                        </div>
                                    </th>
                                    <th
                                        onClick={() => handleSort('date')}
                                        className={`px-6 py-4 font-black uppercase tracking-widest text-[10px] cursor-pointer transition-colors group ${getSortStyles('date')}`}
                                    >
                                        <div className="flex items-center gap-1">
                                            Date Applied {getSortIcon('date')}
                                        </div>
                                    </th>
                                    <th
                                        onClick={() => handleSort('name')}
                                        className={`px-6 py-4 font-black uppercase tracking-widest text-[10px] cursor-pointer transition-colors group ${getSortStyles('name')}`}
                                    >
                                        <div className="flex items-center gap-1">
                                            Full Name {getSortIcon('name')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 font-black text-slate-500 uppercase tracking-widest text-[10px]">Job Title</th>
                                    <th className="px-6 py-4 font-black text-slate-500 uppercase tracking-widest text-[10px]">Email Address</th>
                                    <th className="px-6 py-4 font-black text-slate-500 uppercase tracking-widest text-[10px]">Contact No</th>
                                    <th className="px-6 py-4 font-black text-slate-500 uppercase tracking-widest text-[10px] text-center">Resume</th>
                                    <th className="px-6 py-4 font-black text-slate-500 uppercase tracking-widest text-[10px] text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {paginatedApplicants.length > 0 ? (
                                    paginatedApplicants.map((app) => (
                                    <tr key={app.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-[13px] font-medium text-slate-800">{app.jobCode}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[13px] font-medium text-slate-800">
                                                {(() => {
                                                    const d = new Date(app.date);
                                                    const day = d.getDate().toString().padStart(2, '0');
                                                    const month = (d.getMonth() + 1).toString().padStart(2, '0');
                                                    const year = d.getFullYear();
                                                    return `${day}-${month}-${year}`;
                                                })()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-slate-800 text-[13px]">{app.name}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[13px] font-medium text-slate-800">{app.role}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[13px] font-medium text-slate-800">{app.email}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[13px] font-medium text-slate-800">{app.phone}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => setViewingResume(app)}
                                                    className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all"
                                                    title="View Resume"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                {app.resume_url && (
                                                    <button
                                                        onClick={() => handleDownload(app.resume_url, app.originalName)}
                                                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                                        title="Download Resume"
                                                    >
                                                        <Download size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center">
                                                <div className={`
                                                    relative flex items-center px-1.5 py-1 rounded-full border transition-all group/status cursor-pointer w-fit
                                                    ${app.status === 'applied' ? 'bg-sky-50/50 border-sky-100' : ''}
                                                    ${app.status === 'shortlisted' ? 'bg-orange-50/50 border-orange-100' : ''}
                                                    ${app.status === 'hired' ? 'bg-emerald-50/50 border-emerald-100' : ''}
                                                    ${app.status === 'rejected' ? 'bg-rose-50/50 border-rose-100' : ''}
                                                    hover:shadow-sm
                                                `}>
                                                    <select
                                                        value={app.status}
                                                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                                        className={`
                                                            appearance-none bg-transparent text-[10px] font-black uppercase outline-none cursor-pointer pr-4 pl-1.5
                                                            ${app.status === 'applied' ? 'text-sky-600' : ''}
                                                            ${app.status === 'shortlisted' ? 'text-orange-600' : ''}
                                                            ${app.status === 'hired' ? 'text-emerald-600' : ''}
                                                            ${app.status === 'rejected' ? 'text-rose-600' : ''}
                                                        `}
                                                    >
                                                        <option value="applied">Applied</option>
                                                        <option value="shortlisted">Shorlisted</option>
                                                        <option value="hired">Hired</option>
                                                        <option value="rejected">Reject</option>
                                                    </select>
                                                    <div className="absolute right-2 pointer-events-none">
                                                        <ChevronDown size={10} className={`
                                                            ${app.status === 'applied' ? 'text-sky-500' : ''}
                                                            ${app.status === 'shortlisted' ? 'text-orange-500' : ''}
                                                            ${app.status === 'hired' ? 'text-emerald-500' : ''}
                                                            ${app.status === 'rejected' ? 'text-rose-500' : ''}
                                                        `} />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                                ) : (
                                    processedApplicants.length === 0 && (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-28 text-center bg-slate-50/10">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-300 shadow-inner">
                                                        <Inbox size={28} />
                                                    </div>
                                                    <div className="max-w-md mx-auto">
                                                        <p className="text-sm font-black text-slate-800 uppercase tracking-widest">
                                                            No Talents Found
                                                        </p>
                                                        <p className="text-[11px] text-slate-400 font-bold mt-2 uppercase tracking-tight leading-relaxed">
                                                            No applications match your current status, date range, or search criteria.
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* 📊 PAGINATION CONTROLS */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-8 py-5 bg-slate-50/50 border-t border-slate-100 rounded-b-2xl">
                            <div className="flex items-center gap-3">
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <span className="text-[10px] text-slate-300 font-bold px-3 py-1 bg-white border border-slate-200 rounded-full">
                                    {processedApplicants.length} Total Talents
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className={`p-2 rounded-xl border transition-all ${
                                        currentPage === 1 
                                        ? 'bg-slate-50 border-slate-100 text-slate-300' 
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400 hover:shadow-md'
                                    }`}
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                
                                <div className="flex items-center gap-1">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-8 h-8 rounded-lg text-[11px] font-black transition-all ${
                                                currentPage === i + 1
                                                ? 'bg-slate-900 text-white shadow-lg'
                                                : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300'
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className={`p-2 rounded-xl border transition-all ${
                                        currentPage === totalPages
                                        ? 'bg-slate-50 border-slate-100 text-slate-300' 
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400 hover:shadow-md'
                                    }`}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </AdminCard>

                {/* 🛡️ MISSION: Footer Buffer */}
                <div className="h-10" />
            </div>

            {/* 📄 RESUME MODAL VIEWER */}
            <AnimatePresence>
                {viewingResume && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-5xl h-[85vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest">{viewingResume.name} - Resume</h4>
                                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-tight">{viewingResume.jobCode} • {viewingResume.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setViewingResume(null)}
                                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content - Smart Resume Viewer */}
                            <div className="flex-1 bg-white flex flex-col items-center justify-center overflow-hidden">
                                {viewingResume.resume_url ? (
                                    (() => {
                                        const isPdf = viewingResume.resume_url.toLowerCase().endsWith('.pdf');
                                        const isDoc = viewingResume.resume_url.toLowerCase().endsWith('.doc') || viewingResume.resume_url.toLowerCase().endsWith('.docx');

                                        if (isPdf) {
                                            return (
                                                <iframe 
                                                    src={`${viewingResume.resume_url}#toolbar=0`} 
                                                    className="w-full h-full border-none shadow-inner"
                                                    title="Resume Viewer"
                                                />
                                            );
                                        } else if (isDoc) {
                                            return (
                                                <div className="text-center p-20 bg-white w-full h-full flex flex-col items-center justify-center">
                                                    <div className="text-brand-primary flex items-center justify-center mb-4">
                                                        <FileText size={32} />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest mb-2">Word Document Detected</h3>
                                                    <p className="text-slate-500 text-[10px] font-medium max-w-sm mx-auto mb-8 leading-relaxed uppercase tracking-widest">
                                                        Browsers cannot preview Word files (.docx) directly. Please download the file to view the candidate's profile.
                                                    </p>
                                                    <button 
                                                        onClick={() => handleDownload(viewingResume.resume_url, viewingResume.originalName)}
                                                        className="px-8 py-4 bg-gradient-to-r from-brand-dark to-brand-primary text-white rounded-2xl text-[10px] font-semibold uppercase tracking-[0.2em] shadow-lg hover:shadow-brand-primary/20 transition-all active:scale-95 flex items-center gap-3"
                                                    >
                                                        <Download size={14} />
                                                        Download Resume
                                                    </button>
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div className="text-center p-20">
                                                    <Eye size={48} className="mx-auto mb-4 text-slate-200" />
                                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                                                        Previewing this file type is not supported.<br/>Please use the download button.
                                                    </p>
                                                </div>
                                            );
                                        }
                                    })()
                                ) : (
                                    <div className="text-center p-20">
                                        <Inbox size={48} className="mx-auto mb-4 text-slate-200" />
                                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No Resume Data Found</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ManageApplications;
