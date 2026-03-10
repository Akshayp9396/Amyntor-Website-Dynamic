import React from 'react';
import { Mail, Phone, ExternalLink } from 'lucide-react';

import branch1 from '../../assets/images/branch1.jpg';
import branch2 from '../../assets/images/branch2.jpg';
import branch3 from '../../assets/images/branch3.jpg';

const branches = [
    {
        id: 1,
        city: "Technopark, Trivandrum",
        type: "HEAD QUARTERS",
        address: "Amyntor Tech Solutions Pvt Ltd, T-TBI, G3B, Ground Floor, Thejaswini Building, Technopark Campus, Kariyavattom, Trivandrum",
        phone: "+91 471 208 0478",
        email: "info@amyntortech.com",
        image: branch1
    },
    {
        id: 2,
        city: "Monvila",
        type: "BRANCH OFFICE",
        address: "Amyntor Tech Solutions Pvt, TC.97/603, SPRA-157, Opp: Don Bosco Road Monvila, Thiruvananthapuram PIN:695581",
        phone: "+91 471 208 0478",
        email: "info@amyntortech.com",
        image: branch2
    },
    {
        id: 3,
        city: "Cochin",
        type: "BRANCH OFFICE",
        address: "1st Floor, Joemars, Behind Community Hall, Girinagar, Kadavantra, Cochin, Kerala, 682020",
        phone: "+91 471 208 0478",
        email: "info@amyntortech.com",
        image: branch3
    }
];

const ContactBranches = () => {
    return (
        <section className="py-20 bg-slate-50 border-t border-slate-100">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 text-center">

                {/* Header Sequence */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-white mb-6 shadow-sm">
                    <span className="w-4 h-4 rounded-full bg-[#0066FF] flex items-center justify-center">
                        <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    </span>
                    <span className="text-[#0066FF] text-sm font-semibold">Our Branches</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-[#0b1021] mb-6 tracking-tight">
                    Visit another branch Office
                </h2>

                <p className="text-slate-500 max-w-2xl mx-auto mb-16 text-lg leading-relaxed">
                    Collaboratively supply functional metrics for maintainable users. We reinvent unique value perfectly tailored for just in time consultation practices.
                </p>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {branches.map((branch) => (
                        <div key={branch.id} className="bg-white rounded-[2.5rem] p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-300">

                            {/* Circular Image with Dotted Border */}
                            <div className="mx-auto w-48 h-48 rounded-full border-[1.5px] border-dashed border-[#0066FF] p-2 mb-8">
                                <div className="w-full h-full rounded-full overflow-hidden">
                                    <img src={branch.image} alt={branch.city} className="w-full h-full object-cover grayscale-[20%] transition-transform duration-500 hover:scale-110" />
                                </div>
                            </div>

                            {/* Info */}
                            <h3 className="text-2xl font-bold text-[#0b1021] mb-3">{branch.city}</h3>
                            <h4 className="text-[11px] font-bold text-[#0066FF] tracking-widest uppercase mb-6 flex flex-col items-center">
                                {branch.type}
                                <span className="w-8 h-[2px] bg-blue-100 mt-3 block"></span>
                            </h4>

                            <p className="text-slate-500 text-[15px] leading-relaxed mb-6 min-h-[4.5rem]">
                                {branch.address}
                            </p>

                            <div className="flex flex-col items-center gap-2 text-slate-500 text-[15px]">
                                <span>{branch.phone}</span>
                                <span>{branch.email}</span>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default ContactBranches;
