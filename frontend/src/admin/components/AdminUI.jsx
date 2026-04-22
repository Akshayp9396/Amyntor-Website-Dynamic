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

export const FormInput = ({ label, className = "", ...props }) => (
    <div className={`space-y-1.5 ${className}`}>
        <label className="text-[14px] font-bold text-slate-500 ml-1">{label}</label>
        <input
            {...props}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[15px] focus:border-slate-400 focus:bg-white transition-all outline-none font-medium placeholder:text-slate-400"
        />
    </div>
);

export const FormTextarea = ({ label, rows = 3, ...props }) => (
    <div className="space-y-1.5">
        <label className="text-[14px] font-bold text-slate-500 ml-1">{label}</label>
        <textarea
            rows={rows}
            {...props}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-[15px] focus:border-slate-400 focus:bg-white transition-all outline-none font-medium leading-relaxed resize-none placeholder:text-slate-400"
        />
    </div>
);
export const FormSelect = ({ label, options = [], ...props }) => (
    <div className="space-y-1.5">
        <label className="text-[14px] font-bold text-slate-500 ml-1">{label}</label>
        <select
            {...props}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[15px] focus:border-slate-400 focus:bg-white transition-all outline-none font-medium text-slate-700 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C/polyline%3E%3C/svg%3E')] bg-[length:20px] bg-[right_1.25rem_center] bg-no-repeat"
        >
            <option value="" disabled>Select {label}</option>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    </div>
);
