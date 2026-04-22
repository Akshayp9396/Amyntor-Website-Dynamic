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
import { motion } from 'framer-motion';
import { 
    Briefcase, 
    Users, 
    UserCheck, 
    UserPlus, 
    UserMinus,
    MessageSquare,
    TrendingUp,
    Shield,
    Clock,
    Zap,
    ArrowUpRight,
    BarChart3
} from 'lucide-react';
import ContentService from '../../services/contentService';

const GlassCard = ({ title, value, icon: Icon, gradient, delay, subLabel }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
        className="relative group p-[1px] rounded-[2.5rem] overflow-hidden"
    >
        {/* Animated Border Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 group-hover:opacity-100 transition-opacity duration-500`} />
        
        {/* Frosted Glass Body */}
        <div className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] p-8 h-full relative z-10 border border-white/40 shadow-xl shadow-slate-200/20 group-hover:shadow-2xl group-hover:shadow-slate-200/40 transition-all duration-500 flex flex-col justify-between">
            <div className="flex items-start justify-between mb-8">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-lg shadow-black/10 group-hover:rotate-6 transition-all duration-500`}>
                    <Icon size={24} strokeWidth={2} />
                </div>
                <div className="p-2 bg-slate-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                    <ArrowUpRight size={14} className="text-slate-400" />
                </div>
            </div>
            
            <div className="space-y-1">
                <h3 className="text-4xl font-black text-slate-800 tracking-tighter">
                    {value}
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    {title}
                </p>
                {subLabel && <p className="text-[9px] font-bold text-slate-300 uppercase mt-2">{subLabel}</p>}
            </div>
        </div>
    </motion.div>
);

const AdminDashboard = () => {
    const [data, setData] = useState({ jobs: [], applicants: [], inquiries: [] });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllStats = async () => {
            try {
                const [careers, apps, leads] = await Promise.all([
                    ContentService.getCareersFull(),
                    ContentService.getApplicants(),
                    ContentService.getSubmissions()
                ]);
                setData({
                    jobs: careers?.openRoles || [],
                    applicants: apps || [],
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
        const shortlisted = data.applicants.filter(a => a.status === 'shortlisted').length;
        const hired = data.applicants.filter(a => a.status === 'hired').length;
        const rejected = data.applicants.filter(a => a.status === 'rejected').length;

        return [
            { title: "Posted Jobs", value: active, icon: Briefcase, gradient: "from-blue-600 to-indigo-700", delay: 0.1 },
            { title: "Total Applied", value: total, icon: UserPlus, gradient: "from-sky-500 to-blue-600", delay: 0.2 },
            { title: "Shortlisted", value: shortlisted, icon: UserCheck, gradient: "from-amber-400 to-orange-600", delay: 0.3 },
            { title: "Hired", value: hired, icon: Users, gradient: "from-emerald-500 to-teal-600", delay: 0.4 },
            { title: "Rejected", value: rejected, icon: UserMinus, gradient: "from-rose-500 to-pink-600", delay: 0.5 }
        ];
    }, [data.jobs, data.applicants]);

    return (
        <div className="space-y-12 pb-20 relative">
            {/* Tactical Welcome Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="space-y-2">
                    <h2 className="text-4xl font-black text-slate-800 tracking-tighter">Dashboard</h2>
                </div>

                <div className="flex items-center gap-2 px-6 py-3 bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl shadow-sm">
                    <Clock size={16} className="text-slate-300" />
                    <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </header>

            {/* ── RECRUITMENT FUNNEL SECTION ────────────────────────────── */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 ml-2">
                    <BarChart3 size={18} className="text-slate-400" />
                    <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-widest">Job Applications</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
                    {recruitmentStats.map((stat, idx) => (
                        <GlassCard key={idx} {...stat} />
                    ))}
                </div>
            </section>

            {/* ── LEAD INTELLIGENCE SECTION ────────────────────────────── */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 ml-2">
                    <MessageSquare size={18} className="text-slate-400" />
                    <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-widest">Lead Inquiries</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="p-[1px] rounded-[3rem] overflow-hidden bg-slate-100"
                    >
                        <div className="bg-white/80 backdrop-blur-3xl rounded-[3rem] p-10 relative z-10 border border-white/40 shadow-xl flex flex-col md:flex-row items-center gap-10">
                            <div className="w-24 h-24 rounded-[2rem] bg-slate-50 text-slate-800 border border-slate-100 flex items-center justify-center shadow-lg flex-shrink-0">
                                <MessageSquare size={44} strokeWidth={1.5} />
                            </div>
                            <div className="space-y-4 text-center md:text-left flex-1">
                                <div className="space-y-1">
                                    <h4 className="text-6xl font-black text-slate-800 tracking-tighter leading-none">
                                        {data.inquiries.length}
                                    </h4>
                                    <p className="text-[14px] font-black text-slate-400 uppercase tracking-[0.4em]">Total Lead Enquiries</p>
                                </div>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xl">
                                    Inbound business inquiries are being handled by the strategic triage system. 
                                    Review these leads in the <span className="text-emerald-600 font-bold underline">Lead Inquiries</span> section.
                                </p>
                            </div>
                            <div className="hidden xl:flex items-center gap-6 px-10 py-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100">
                                <div className="text-center">
                                    <p className="text-2xl font-black text-slate-800">{data.inquiries.filter(i => i.status === 'RESPONDED').length}</p>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Responded</p>
                                </div>
                                <div className="w-px h-10 bg-slate-200" />
                                <div className="text-center">
                                    <p className="text-2xl font-black text-slate-800">{data.inquiries.filter(i => i.status !== 'RESPONDED').length}</p>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Awaiting</p>
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
