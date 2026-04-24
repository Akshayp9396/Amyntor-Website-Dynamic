import React from 'react';
import { CheckCircle2 } from 'lucide-react';

/**
 * Code Walkthrough
 * Renders the extremely clean, text-heavy layout based directly on the provided screenshots.
 * Discards the traditional grid/boxes in favor of a readable document/report format.
 * Features custom 'blue outline' checkmarks for lists, maintaining brand consistency.
 */
const CaseStudyDetailsContent = ({ project }) => {

    // Helper for rendering custom blue checkmark lists
    const CheckmarkItem = ({ children }) => (
        <li className="flex items-start gap-3 mb-3">
            {/* Custom SVG reflecting the sleek blue outlined checkmark in screenshot */}
            <svg className="w-5 h-5 text-brand-primary shrink-0 mt-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div className="text-slate-700 leading-relaxed font-normal">{children}</div>
        </li>
    );

    return (
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col font-sans">

            {/* 1. Introduction */}
            <section className="mb-10">
                <h2 className="text-[22px] font-bold text-[#0b1021] mb-5">Introduction</h2>
                <p className="text-slate-700 leading-relaxed text-[15px] text-justify">
                    {project?.introduction || 'No introduction provided.'}
                </p>
            </section>

            {/* 2. Scope of Work */}
            <section className="mb-10">
                <h2 className="text-[22px] font-bold text-[#0b1021] mb-5">Scope of Work</h2>
                <p className="text-slate-700 leading-relaxed text-[15px] mb-4 text-justify">
                    {project?.scopeOfWork?.intro || ''}
                </p>
                <ul className="pl-1">
                    {(project?.scopeOfWork?.points || []).map((point, idx) => (
                        <CheckmarkItem key={idx}>{point}</CheckmarkItem>
                    ))}
                </ul>
            </section>

            {/* 3. Site Actions Taken */}
            <section className="mb-10">
                <h2 className="text-[22px] font-bold text-[#0b1021] mb-5">Site Actions Taken</h2>
                <p className="text-slate-700 leading-relaxed text-[15px] mb-6 text-justify">
                    {project?.siteActionsIntro || ''}
                </p>
                <div className="flex flex-col gap-6">
                    {(project?.siteActions || []).map((action, idx) => (
                        <div key={idx}>
                            <h3 className="text-[16px] font-bold text-[#0b1021] mb-2">{action.title}</h3>
                            <p className="text-slate-700 leading-relaxed text-[15px] text-justify">{action.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. Results and Benefits */}
            <section className="mb-10">
                <h2 className="text-[22px] font-bold text-[#0b1021] mb-5">Results and Benefits</h2>
                <p className="text-slate-700 leading-relaxed text-[15px] mb-5 text-justify">
                    {project?.resultsAndBenefits?.intro || ''}
                </p>
                <ul className="pl-1 space-y-4">
                    {(project?.resultsAndBenefits?.points || []).map((res, idx) => (
                        <CheckmarkItem key={idx}>
                            <span className="font-semibold text-[#0b1021]">{res.title}: </span>
                            {res.description}
                        </CheckmarkItem>
                    ))}
                </ul>
            </section>

            {/* 5. Conclusion */}
            <section>
                <h2 className="text-[22px] font-bold text-[#0b1021] mb-5">Conclusion</h2>
                <p className="text-slate-700 leading-relaxed text-[15px] text-justify">
                    {project?.conclusion || ''}
                </p>
            </section>

        </div>
    );
};

export default CaseStudyDetailsContent;
