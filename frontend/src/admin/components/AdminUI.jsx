/**
 * Code Walkthrough: AdminUI.jsx
 * 
 * Purpose: A collection of shared, premium "White Glass" UI components 
 * used across the Admin Dashboard.
 */
import React from 'react';

export const AdminCard = ({ title, icon: Icon, children, actions }) => (
    <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden mb-8 transition-all hover:shadow-md">
        <div className="px-8 py-5 border-b border-slate-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/30">
            <div className="flex items-center gap-3">
                {Icon && <div className="p-2.5 bg-brand-primary/10 rounded-xl text-brand-primary shadow-sm"><Icon size={20} strokeWidth={2.5} /></div>}
                <h3 className="text-xl font-black text-slate-800 tracking-tight">{title}</h3>
            </div>
            {actions && <div className="flex gap-2 w-full sm:w-auto">{actions}</div>}
        </div>
        <div className="p-8">
            {children}
        </div>
    </div>
);

export const FormInput = ({ label, type = "text", value, onChange, placeholder, className = "" }) => (
    <div className={`space-y-1.5 ${className}`}>
        <label className="text-[14px] font-bold text-slate-500 ml-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[15px] focus:border-slate-400 focus:bg-white transition-all outline-none font-medium placeholder:text-slate-400"
        />
    </div>
);

export const FormTextarea = ({ label, value, onChange, placeholder, rows = 3 }) => (
    <div className="space-y-1.5">
        <label className="text-[14px] font-bold text-slate-500 ml-1">{label}</label>
        <textarea
            rows={rows}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-[15px] focus:border-slate-400 focus:bg-white transition-all outline-none font-medium leading-relaxed resize-none placeholder:text-slate-400"
        />
    </div>
);
