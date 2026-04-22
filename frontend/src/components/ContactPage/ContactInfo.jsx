import React from 'react';
import { Mail, Phone, MessageSquare } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

const ContactInfo = () => {
    const { contactPageData } = useContent();

    if (!contactPageData) return null;

    const { info } = contactPageData;

    return (
        <div className="h-full flex flex-col justify-start pt-4 w-full">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 mb-6 w-fit">
                <span className="w-3 h-3 rounded-full bg-gradient-to-br from-brand-dark to-brand-primary"></span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-dark to-brand-primary text-sm font-bold uppercase tracking-wider">{info.tag}</span>
            </div>

            {/* Headers */}
            <h2 className="text-4xl md:text-[2.75rem] font-bold text-[#0b1021] mb-6 leading-[1.15] tracking-tight">
                {info.title}
            </h2>
            <p className="text-slate-500 mb-12 text-lg">
                {info.description}
            </p>

            {/* Contact List */}
            <div className="space-y-8 flex-grow">

                {/* Dynamic Emails */}
                {(info?.emails || []).map((email) => (
                    <div key={email.id} className="flex items-center gap-5 group">
                        <div className="w-[3.25rem] h-[3.25rem] rounded-xl bg-gradient-to-br from-brand-dark to-brand-primary flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105">
                            <Mail size={22} className="text-white" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h4 className="text-[17px] font-medium text-[#0b1021] mb-0.5">{email.label}</h4>
                            <a href={`mailto:${email.value}`} className="text-slate-500 hover:text-brand-primary transition-colors text-[15px]">
                                {email.value}
                            </a>
                        </div>
                    </div>
                ))}

                {/* Phone Number */}
                {info?.phone?.number && (
                    <div className="flex items-start gap-5 group pt-2">
                        <div className="w-[3.25rem] h-[3.25rem] rounded-xl bg-gradient-to-br from-brand-dark to-brand-primary flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105 mt-1">
                            <Phone size={22} className="text-white" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h4 className="text-[17px] font-medium text-[#0b1021] mb-1">Phone Number</h4>
                            <a href={`tel:${(info?.phone?.number || "").replace(/ /g, '')}`} className="text-slate-500 hover:text-brand-primary transition-colors text-[15px] block mb-0.5">
                                {info?.phone?.number}
                            </a>
                            {info?.phone?.hours && <p className="text-slate-500 text-[14px] leading-tight opacity-80 whitespace-pre-line">{info.phone.hours}</p>}
                        </div>
                    </div>
                )}

                {/* Whatsapp */}
                {info?.whatsapp?.number && (
                    <div className="flex items-start gap-5 group pt-2">
                        <div className="w-[3.25rem] h-[3.25rem] rounded-xl bg-gradient-to-br from-brand-dark to-brand-primary flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                <path d="M16 14.5c-.3.8-1 .8-1.5.8-.8 0-2.3-.6-3.7-2-1.4-1.4-2-2.9-2-3.8 0-.5 0-1.2.8-1.5.2-.1.4-.2.6-.2.4 0 .5.3.7.8.2.5.5 1.2.5 1.3 0 .2-.1.3-.2.5-.1.1-.2.3-.4.4-.1.1-.3.2-.1.6.2.4.6 1 1 1.5s1.2.8 1.6 1c.3.2.5 0 .6-.1.2-.2.3-.4.4-.5.1-.2.3-.2.5-.1.2-.1.9.3 1.3.5.2.1.3.3.3.5z"></path>
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-[17px] font-medium text-[#0b1021] mb-1">Whatsapp</h4>
                            <a href={`https://wa.me/${(info?.whatsapp?.number || "").replace('+', '').replace(/ /g, '')}`} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-brand-primary transition-colors text-[15px] block mb-0.5">
                                {info?.whatsapp?.number} {info?.whatsapp?.label ? `(${info.whatsapp.label})` : ""}
                            </a>
                        </div>
                    </div>
                )}

            </div>

            {/* Social Links */}
            {(info?.socials?.length > 0) && (
                <div className="mt-16 flex items-center gap-6 text-sm font-semibold text-[#0b1021]">
                    {info.socials.map((social) => (
                        <a
                            key={social.id}
                            href={social.link}
                            className="hover:text-brand-primary transition-colors"
                        >
                            {social.platform}
                        </a>
                    ))}
                </div>
            )}

        </div>
    );
};

export default ContactInfo;
