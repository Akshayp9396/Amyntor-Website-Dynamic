/**
 * Code Walkthrough: AdminDashboard.jsx (V3 - Glass Command Center)
 * 
 * Purpose: The high-level analytical hub for the Amyntor Tech Admin Panel.
 * 
 * MISSION:
 * 1. Recruitment HQ: Track jobs and applicants through the funnel.
 * 2. Lead Intelligence: Monitor inbound business inquiries.
 * 3. Glass-Morphism Design: Premium UI with backdrop-blur and vibrant gradients.
 */

import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Briefcase,
    Users,
    UserCheck,
    UserPlus,
    UserMinus,
    MessageSquare,
    Clock,
    ArrowUpRight,
    BarChart3
} from 'lucide-react';
import ContentService from '../../services/contentService';

const GlassCard = ({ title, value, icon: Icon, gradient, delay, subLabel, onClick }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
        onClick={onClick}
        className="relative group p-[1px] rounded-[2.5rem] overflow-hidden cursor-pointer"
    >
        {/* Fixed High-Impact Border Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-100`} />

        {/* Frosted Glass Body */}
        <div className="bg-white/90 backdrop-blur-3xl rounded-[2.5rem] p-8 h-full relative z-10 border border-white/40 shadow-2xl shadow-slate-200/40 transition-all duration-500 flex flex-col justify-between">
            <div className="flex items-start justify-between mb-8">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-lg shadow-black/10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                    <Icon size={24} strokeWidth={2} className="group-hover:-translate-y-0.5 transition-transform duration-500" />
                </div>
                <div className="p-2 bg-slate-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                    <ArrowUpRight size={14} className="text-slate-400" />
                </div>
            </div>

            <div className="space-y-1">
                <h3 className="text-4xl font-bold text-slate-800 tracking-tighter">
                    {value}
                </h3>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-1">
                    {title}
                </p>
                {subLabel && <p className="text-[9px] font-semibold text-slate-300 uppercase mt-2">{subLabel}</p>}
            </div>
        </div>
    </motion.div>
);

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({ jobs: [], applicants: [], inquiries: [] });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllStats = async () => {
            try {
                const [careers, apps, leads] = await Promise.all([
                    ContentService.getCareersFull(),
                    ContentService.getApplications(),
                    ContentService.getSubmissions()
                ]);

                setData({
                    jobs: careers?.openRoles || [],
                    applicants: apps?.data || [],
                    inquiries: leads?.data || []
                });
            } catch (err) {
                console.error('❌ Data Hydration Error:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllStats();
    }, []);

    const recruitmentStats = useMemo(() => {
        const active = data.jobs.filter(r => r.is_active !== false).length;
        const total = data.applicants.length;
        
        // Normalize status check to be case-insensitive for robust DB mapping
        const getCount = (status) => data.applicants.filter(a => a.status?.toLowerCase() === status.toLowerCase()).length;

        const shortlisted = getCount('shortlisted');
        const hired = getCount('hired');
        const rejected = getCount('rejected');

        return [
            { 
                title: "Posted Jobs", 
                value: active, 
                icon: Briefcase, 
                gradient: "from-blue-600 to-indigo-700", 
                delay: 0.1,
                onClick: () => navigate('/admin/careers', { state: { activeTab: 'list', addOpening: false } })
            },
            { 
                title: "Total Applied", 
                value: total, 
                icon: UserPlus, 
                gradient: "from-sky-500 to-blue-600", 
                delay: 0.2,
                onClick: () => navigate('/admin/applications', { state: { activeTab: 'all' } })
            },
            { 
                title: "Shortlisted", 
                value: shortlisted, 
                icon: UserCheck, 
                gradient: "from-amber-400 to-orange-600", 
                delay: 0.3,
                onClick: () => navigate('/admin/applications', { state: { activeTab: 'shortlisted' } })
            },
            { 
                title: "Hired", 
                value: hired, 
                icon: Users, 
                gradient: "from-emerald-500 to-teal-600", 
                delay: 0.4,
                onClick: () => navigate('/admin/applications', { state: { activeTab: 'hired' } })
            },
            { 
                title: "Rejected", 
                value: rejected, 
                icon: UserMinus, 
                gradient: "from-rose-500 to-pink-600", 
                delay: 0.5,
                onClick: () => navigate('/admin/applications', { state: { activeTab: 'rejected' } })
            }
        ];
    }, [data.jobs, data.applicants, navigate]);

    return (
        <div className="space-y-12 pb-20 relative">
            {/* Tactical Welcome Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="space-y-2">
                    <h2 className="text-4xl font-bold text-slate-800 tracking-tighter">Dashboard</h2>
                </div>

                <div className="flex items-center gap-2 px-6 py-3 bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl shadow-sm">
                    <Clock size={16} className="text-slate-300" />
                    <span className="text-[11px] font-semibold text-slate-800 uppercase tracking-widest">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </header>

            {/* ── RECRUITMENT FUNNEL SECTION ────────────────────────────── */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 ml-2">
                    <BarChart3 size={18} className="text-slate-400" />
                    <h3 className="text-[13px] font-semibold text-slate-800 uppercase tracking-widest">Job Applications</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                    {recruitmentStats.map((stat, idx) => (
                        <GlassCard key={idx} {...stat} />
                    ))}
                </div>
            </section>

            {/* ── LEAD INTELLIGENCE SECTION ────────────────────────────── */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 ml-2">
                    <MessageSquare size={18} className="text-slate-400" />
                    <h3 className="text-[13px] font-semibold text-slate-800 uppercase tracking-widest">Lead Inquiries</h3>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="relative p-[1px] rounded-[3rem] overflow-hidden"
                    >
                        {/* Vibrant Strategic Violet Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-700 opacity-20" />

                        <div className="bg-white/95 backdrop-blur-3xl rounded-[3rem] p-6 lg:p-10 relative z-10 border border-white/40 shadow-2xl flex flex-col md:flex-row items-center gap-10">
                            <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-violet-600 to-indigo-800 text-white flex items-center justify-center shadow-2xl shadow-violet-500/20 flex-shrink-0">
                                <MessageSquare size={44} strokeWidth={1.5} />
                            </div>
                            <div className="space-y-4 text-center md:text-left flex-1">
                                <div className="space-y-1">
                                    <h4 className="text-7xl font-bold text-slate-800 tracking-tighter leading-none">
                                        {data.inquiries.length}
                                    </h4>
                                    <p className="text-[14px] font-semibold text-violet-600/70 uppercase tracking-[0.4em] mt-2">Total Inquiries</p>
                                </div>
                                
                            </div>
                            <div className="flex items-center gap-6 px-12 py-8 bg-slate-50/50 rounded-[3rem] border border-slate-100 shadow-inner">
                                <div className="text-center space-y-1">
                                    <p className="text-3xl font-bold text-emerald-500 tracking-tight">
                                        {data.inquiries.filter(i => i.status?.toLowerCase() === 'responded').length}
                                    </p>
                                    <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest">Responded</p>
                                </div>
                                <div className="w-px h-12 bg-slate-200" />
                                <div className="text-center space-y-1">
                                    <p className="text-3xl font-bold text-amber-500 tracking-tight">
                                        {data.inquiries.filter(i => i.is_read === 0).length}
                                    </p>
                                    <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-widest">To Read</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;
