import React, { useState } from 'react';
import { User, Mail, Phone, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

const ContactForm = () => {
    const { contactPageData } = useContent();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
    });

    const [status, setStatus] = useState('idle');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.phone || !formData.message) {
            alert("Please fill in your name, phone number, and message.");
            return;
        }

        setStatus('submitting');

        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', service: '', message: '' });
        }, 1500);
    };

    if (status === 'success') {
        return (
            <div className="bg-white rounded-[2rem] p-10 md:p-14 shadow-[0_10px_40px_rgba(0,0,0,0.04)] h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 text-green-500">
                    <CheckCircle2 size={40} strokeWidth={1.5} />
                </div>
                <h3 className="text-3xl font-bold text-[#0b1021] mb-4">Message Sent Successfully!</h3>
                <p className="text-slate-500 text-lg mb-8 max-w-sm">
                    Thank you for connecting with us. Our team will review your inquiry and reach out shortly.
                </p>
                <button
                    onClick={() => setStatus('idle')}
                    className="px-8 py-3.5 bg-brand-primary hover:bg-brand-dark text-white rounded-full font-semibold transition-all inline-flex items-center gap-2"
                >
                    Send Another Message <ArrowRight size={18} />
                </button>
            </div>
        );
    }

    const googleMapsUrl = contactPageData?.info?.googleMapsUrl || "https://maps.google.com/maps?q=Amyntor%20Tech%20Solutions%20Pvt%20Ltd.,%20Trivandrum&t=&z=14&ie=UTF8&iwloc=&output=embed";

    return (
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.03)] h-full">
            <h3 className="text-3xl font-bold text-[#0b1021] mb-10">Let's Connect with us</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <User size={18} className="text-[#0b1021]/60" strokeWidth={1.5} />
                        </div>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your Name *"
                            required
                            className="w-full bg-white border border-slate-200 text-slate-700 rounded-full pl-12 pr-6 py-4 focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-all placeholder:text-slate-400"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Mail size={18} className="text-[#0b1021]/60" strokeWidth={1.5} />
                        </div>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email Address (Optional)"
                            className="w-full bg-white border border-slate-200 text-slate-700 rounded-full pl-12 pr-6 py-4 focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Phone size={18} className="text-[#0b1021]/60" strokeWidth={1.5} />
                        </div>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone No. *"
                            required
                            className="w-full bg-white border border-slate-200 text-slate-700 rounded-full pl-12 pr-6 py-4 focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-all placeholder:text-slate-400"
                        />
                    </div>

                    <div className="relative">
                        <select
                            name="service"
                            value={formData.service}
                            onChange={handleChange}
                            className="w-full bg-white border border-slate-200 text-slate-600 rounded-full px-6 py-4 focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-all appearance-none"
                        >
                            <option value="">Select Service</option>
                            <option value="cyber-security">Cyber Security</option>
                            <option value="it-infrastructure">IT Infrastructure</option>
                            <option value="cloud-devops">Cloud & DevOps</option>
                            <option value="managed-services">Managed Services</option>
                            <option value="distribution">Distribution</option>
                            <option value="dpdp">DPDP Act</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Write Message *"
                        required
                        rows="5"
                        className="w-full bg-white border border-slate-200 text-slate-700 rounded-3xl px-6 py-5 focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-all placeholder:text-slate-400 resize-none"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="mt-6 px-10 py-4 bg-white border border-slate-200 text-[#0b1021] rounded-full font-bold transition-all duration-300 inline-flex items-center gap-4 disabled:opacity-70 disabled:cursor-not-allowed group hover:shadow-md focus:outline-none"
                >
                    {status === 'submitting' ? (
                        <>
                            <Loader2 size={18} className="animate-spin text-brand-primary" />
                            <span className="text-slate-400 font-semibold">Submitting...</span>
                        </>
                    ) : (
                        <>
                            <span className="relative z-10 transition-all duration-300 group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-brand-dark group-hover:to-brand-primary">
                                Submit Now
                            </span>
                            <div className="relative z-10">
                                {/* Premium Gradient Icon */}
                                <svg className="w-6 h-6 transition-all duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient id="submit-grad-final" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#2563eb" />
                                            <stop offset="100%" stopColor="#02a1fd" />
                                        </linearGradient>
                                    </defs>
                                    <path 
                                        d="M5 12H19M19 12L12 5M19 12L12 19" 
                                        className="stroke-[#0b1021]/60 group-hover:stroke-[url(#submit-grad-final)]" 
                                        strokeWidth="2.5" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                    />
                                </svg>
                            </div>
                        </>
                    )}
                </button>
            </form>

            {/* Location Map */}
            <div className="mt-10 overflow-hidden rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] h-[250px] relative">
                <iframe
                    src={googleMapsUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Amyntor Tech Solutions Location"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 saturate-[1.2] opacity-90 transition-opacity hover:opacity-100"
                ></iframe>
            </div>
        </div>
    );
};

export default ContactForm;
