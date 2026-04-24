/**
 * Code Walkthrough: ManageInquiries.jsx (V2 - Modern Lead Intelligence)
 * 
 * Purpose: A high-density administrative suite for monitoring and managing inbound contact leads.
 * MISSION: Exact visual alignment with ManageApplications.jsx high-fidelity UI.
 * DESIGN: Neutral, professional interaction with sophisticated filtering and glass-morphic elements.
 * FEATURES:
 *  1. Dynamic Filtering (Tabs: All, New, Read, Responded)
 *  2. Date Range Scoping (Strategic lead tracking over time)
 *  3. Integrated Lead Brief (Modal System)
 *  4. Instant Status Transitions preserved in MySQL
 *  5. Real-time Lead Identification Search
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Mail,
    Phone,
    X,
    MessageSquare,
    Calendar,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    ArrowUpRight,
    Loader2,
    Inbox,
    MessageCircle,
    User,
    Clock,
    SearchX,
    Filter,
    ChevronsUpDown
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { AdminCard } from '../components/AdminUI';
import ContentService from '../../services/contentService';

const ManageInquiries = () => {
    const { showNotification } = useNotification();

    // Lead Intelligence States
    const [searchTerm, setSearchTerm] = useState('');
    const [activeStatusTab, setActiveStatusTab] = useState('all');
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // ── MISSION: Date Range Validation Protocol ──────────────────────────────
    useEffect(() => {
        if (dateRange.from && dateRange.to) {
            const from = new Date(dateRange.from);
            const to = new Date(dateRange.to);
            if (from > to) {
                showNotification('ERROR: "From" date cannot be after "To" date.', 'error');
                setDateRange(prev => ({ ...prev, to: '' }));
            }
        }
    }, [dateRange.from, dateRange.to]);

    // ── MISSION: Fetch all inquiries from MySQL on mount ─────────────────────
    const [inquiries, setInquiries] = useState([]);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        setIsLoading(true);
        try {
            const result = await ContentService.getSubmissions();
            if (result.success) {
                // Normalize DB data to UI expected format
                const normalized = result.data.map(lead => ({
                    ...lead,
                    dateFormatted: lead.created_at ? lead.created_at.split('T')[0] : '',
                    status: (lead.status || 'NEW').toLowerCase()
                }));
                setInquiries(normalized);
            }
        } catch (err) {
            console.error('❌ Lead Retrieval Error:', err);
            showNotification('Failed to load inquiries from server.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // 🏎️ SORTING ENGINE
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <ChevronsUpDown size={12} className="text-slate-300 ml-1" />;
        return sortConfig.direction === 'asc' 
            ? <ChevronUp size={12} className="text-slate-900 ml-1" /> 
            : <ChevronDown size={12} className="text-slate-900 ml-1" />;
    };

    const getSortStyles = (key) => {
        return "text-slate-500";
    };

    // 🎣 FILTERING LOGIC (With Dynamic Sorting)
    const filteredInquiries = useMemo(() => {
        const fromDate = dateRange.from ? new Date(dateRange.from) : null;
        const toDate = dateRange.to ? new Date(dateRange.to) : null;

        return inquiries.filter(lead => {
            const matchesSearch = 
                lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.service?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = activeStatusTab === 'all' || lead.status === activeStatusTab;

            const leadDate = new Date(lead.created_at);
            const isRangeComplete = fromDate && toDate;
            const matchesDate = isRangeComplete 
                ? (leadDate >= fromDate && leadDate <= toDate) 
                : true;

            return matchesSearch && matchesStatus && matchesDate;
        }).sort((a, b) => {
            const { key, direction } = sortConfig;
            if (key === 'date') {
                return direction === 'asc' 
                    ? new Date(a.created_at) - new Date(b.created_at) 
                    : new Date(b.created_at) - new Date(a.created_at);
            }
            if (key === 'id') {
                return direction === 'asc' ? a.id - b.id : b.id - a.id;
            }
            return 0;
        });
    }, [inquiries, searchTerm, activeStatusTab, dateRange, sortConfig]);

    // 🛡️ STATUS UPDATER: Persistence Layer
    const handleStatusChange = async (id, newStatus) => {
        // Optimistically update UI
        setInquiries(prev => prev.map(lead =>
            lead.id === id ? { ...lead, status: newStatus } : lead
        ));
        
        try {
            // SILENT PERSIST: Auto-save without success protocol
            await ContentService.updateInquiryStatus(id, newStatus.toUpperCase());
        } catch (err) {
            console.error('❌ Status Sync Error:', err);
            showNotification('ERROR: Failed to save status change.', 'error');
        }
    };

    const statusTabs = [
        { id: 'all', label: 'All Inquiries' },
        { id: 'responded', label: 'Responded' },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4 text-slate-400">
                    <Loader2 size={40} className="text-brand-primary animate-spin" />
                    <p className="text-[11px] font-black uppercase tracking-widest">Hydrating Lead Intelligence...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-full space-y-6 pb-20 font-sans">
            
            {/* 🔍 TOP CONTROL BAR (Reference UI Match) */}
            <div className="sticky top-0 z-30 bg-slate-50/80 backdrop-blur-md py-4 -mx-1 px-1 border-b border-slate-200/60 mb-2">
                <div className="flex items-center justify-between w-full">
                    {/* Status Navigation Tabs */}
                    <div className="flex items-center p-1.5 bg-slate-100/80 border border-slate-200 rounded-full w-fit shadow-inner">
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

                    {/* Date Scoping (Strategic Filters) */}
                    <div className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-2.5 rounded-full shadow-sm mr-2">
                        <div className="flex items-center gap-2 border-r border-slate-200 pr-3">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">From:</span>
                            <input
                                type="date"
                                value={dateRange.from}
                                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                                className="text-[10px] font-bold text-slate-600 outline-none bg-transparent"
                            />
                        </div>
                        <div className="flex items-center gap-2 pl-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">To:</span>
                            <input
                                type="date"
                                value={dateRange.to}
                                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                                className="text-[10px] font-bold text-slate-600 outline-none bg-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 📜 INTELLIGENCE TABLE */}
            <div className="mt-2 min-h-[600px]">
                <AdminCard 
                    title={`${activeStatusTab.charAt(0).toUpperCase() + activeStatusTab.slice(1)} Inquiries`}
                    actions={
                        <div className="relative group/search">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-slate-900 transition-colors" size={14} />
                            <input
                                type="text"
                                placeholder="Search by name, service..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-11 pr-6 py-2.5 bg-slate-50/50 border border-slate-200 rounded-full text-[12px] font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-100 outline-none transition-all w-64"
                            />
                        </div>
                    }
                >
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto mt-4 shadow-sm pb-2">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50/80 border-b border-slate-200">
                                <tr>
                                    <th 
                                        onClick={() => handleSort('id')}
                                        className={`px-6 py-4 font-black uppercase tracking-widest text-[10px] cursor-pointer transition-colors group ${getSortStyles('id')}`}
                                    >
                                        <div className="flex items-center">
                                            ID {getSortIcon('id')}
                                        </div>
                                    </th>
                                    <th 
                                        onClick={() => handleSort('date')}
                                        className={`px-6 py-4 font-black uppercase tracking-widest text-[10px] cursor-pointer transition-colors group ${getSortStyles('date')}`}
                                    >
                                        <div className="flex items-center">
                                            Date {getSortIcon('date')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-slate-500">Full Name</th>
                                    <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-slate-500">Email Address</th>
                                    <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-slate-500">Contact No</th>
                                    <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-slate-500">Service</th>
                                    <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-slate-500 text-center">Message</th>
                                    <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-slate-500 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredInquiries.length > 0 ? (
                                    filteredInquiries.map((lead) => (
                                    <tr key={lead.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 relative">
                                            {lead.is_read === 0 && (
                                                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse" title="Unread Inquiry" />
                                            )}
                                            <span className="text-[13px] font-medium text-slate-800">AMY-LQ-{lead.id.toString().padStart(4, '0')}</span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-800 font-medium text-[13px]">
                                            {new Date(lead.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-slate-800 text-[13px]">{lead.name}</span>
                                        </td>
                                        <td className="px-6 py-4 text-[13px] text-slate-800 font-medium">{lead.email}</td>
                                        <td className="px-6 py-4 text-[13px] text-slate-800 font-medium">{lead.phone}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-[13px] font-medium text-slate-800">
                                                {lead.service || "General"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={async () => {
                                                    setSelectedInquiry(lead);
                                                    if (lead.is_read === 0) {
                                                        try {
                                                            await ContentService.markInquiryAsRead(lead.id);
                                                            setInquiries(prev => prev.map(item => 
                                                                item.id === lead.id ? { ...item, is_read: 1 } : item
                                                            ));
                                                        } catch (err) {
                                                            console.error('❌ Mark as read error:', err);
                                                        }
                                                    }
                                                }}
                                                className="p-2.5 text-slate-800 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all"
                                            >
                                                <MessageCircle size={18} />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center">
                                                <div className={`
                                                    relative flex items-center px-1.5 py-1 rounded-full border transition-all group/status cursor-pointer w-fit
                                                    ${lead.status === 'responded' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50/50 border-slate-100'}
                                                    hover:shadow-sm
                                                `}>
                                                    <select
                                                        value={lead.status}
                                                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                                        className={`
                                                             appearance-none bg-transparent text-[10px] font-black uppercase outline-none cursor-pointer pr-4 pl-1.5
                                                            ${lead.status === 'responded' ? 'text-emerald-600' : 'text-slate-400'}
                                                        `}
                                                    >
                                                        <option value="new">Inquiry</option>
                                                        <option value="responded">Responded</option>
                                                    </select>
                                                    <div className="absolute right-2 pointer-events-none">
                                                        <ChevronDown size={10} className={`
                                                            ${lead.status === 'responded' ? 'text-emerald-500' : 'text-slate-400'}
                                                        `} />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-28 text-center bg-slate-50/10">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-300 shadow-inner">
                                                    <SearchX size={28} />
                                                </div>
                                                <div className="max-w-md mx-auto">
                                                    <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">No Inquiries Found</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </AdminCard>
            </div>

            {/* 📄 INQUIRY BRIEF MODAL (High-Fidelity Match) */}
            <AnimatePresence>
                {selectedInquiry && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
                        >
                            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-brand-primary">
                                        <MessageCircle size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Lead Briefing</h4>
                                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-tight">AMY-LQ-{selectedInquiry.id}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedInquiry(null)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 space-y-8 max-h-[65vh] custom-scrollbar">
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1"> Name</p>
                                        <p className="text-[16px] font-medium text-slate-800">{selectedInquiry.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Service</p>
                                        <p className="text-[14px] font-medium text-slate-800 uppercase">{selectedInquiry.service || "General"}</p>
                                    </div>
                                </div>

                                <div className="bg-slate-50/80 border border-slate-100 rounded-3xl p-6 grid grid-cols-2 gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm"><Mail size={14} className="text-slate-400" /></div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase">Email</p>
                                            <p className="text-[12px] font-medium text-slate-800">{selectedInquiry.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm"><Phone size={14} className="text-slate-400" /></div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase">Phone</p>
                                            <p className="text-[12px] font-medium text-slate-800">{selectedInquiry.phone}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 pb-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</p>
                                    <div className="bg-slate-50/50 border border-slate-100 rounded-[2rem] p-8 text-slate-700 relative group min-h-[150px]">
                                        <div className="absolute top-0 right-0 p-6 opacity-10">
                                            <MessageCircle size={100} className="text-slate-200" />
                                        </div>
                                        <p className="relative z-10 text-[14px] leading-[1.8] font-medium text-slate-700 break-words whitespace-pre-wrap">
                                            {selectedInquiry.message}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                                <button 
                                    onClick={() => window.open(`mailto:${selectedInquiry.email}`)}
                                    className="px-10 py-3.5 bg-gradient-to-r from-[#009669] to-[#006D5B] hover:shadow-lg hover:shadow-emerald-900/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
                                >
                                    Respond via Mail <ArrowUpRight size={14} />
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ManageInquiries;
