/**
 * Code Walkthrough: blogData.js
 * ─────────────────────────────
 * This file provides the mock data for the Blog section. Each blog item contains:
 * - List-level fields (title, date, image, category, slug) used by BlogList cards.
 * - Detail-level fields (overview, sections[], conclusion) used by BlogDetails page.
 *
 * The `sections` array is fully dynamic — each blog can have a different number of
 * sections, each with its own heading, paragraph, and optional tick-mark points.
 * This structure is designed to map 1:1 to a future MySQL schema.
 */

import heroBg from '../../assets/images/blog-bg.jpg';

export const mockBlogPageData = {
    hero: {
        tag: "Latest Insights",
        title: "Our Blog",
        tagline: "Stay ahead with the latest news, expert insights, and cybersecurity trends from Amyntor Tech Solutions.",
        backgroundImage: heroBg,
        breadcrumbs: [
            { label: "Home", link: "/" },
            { label: "Resources", link: "#" },
            { label: "Blog", link: "/blogs" }
        ]
    },
    blogList: {
        tag: "Read Our Articles",
        heading: "Discover our expert analysis, company updates, and technical deep-dives.",
        items: [
            {
                id: 1,
                title: "Installation Sales Navigator Extension on Chrome",
                date: "February 22, 2026",
                image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
                category: "Tutorial",
                slug: "installation-sales-navigator",
                overview: "In an effort to reinforce the digital privacy landscape, the Indian government has enacted the Digital Personal Data Protection Act, 2023. This groundbreaking legislation delineates a comprehensive framework for the protection of personal data in the digital sphere, reflecting the changing realities of data privacy and security in the 21st century. This act brings a set of obligations, rights, and a regulatory body in place to ensure that personal data is processed responsibly.",
                sections: [
                    {
                        heading: "Overview of the Act",
                        paragraph: "The act is categorized into various chapters, each detailing a different aspect of data protection:",
                        points: [
                            "Chapter I lays the foundation, defining key terminologies and the applicability of the act, emphasizing its reach within Indian territory and in certain instances beyond.",
                            "Chapter II binds Data Fiduciaries to specific obligations, emphasizing lawful processing of data with informed consent from Data Principals.",
                            "Chapter III empowers Data Principals with the ability to manage and control their data effectively.",
                            "Chapter IV includes special provisions, outlining stringent restrictions on international data transfers and delineating conditions for data processing under certain circumstances.",
                            "Chapter V and VI establish and explicate the role and powers of the Data Protection Board of India, a new regulatory authority.",
                            "Chapter VII introduces an appeal process and the potential for alternative dispute resolution.",
                            "Chapter VIII outlines the penalties for non-compliance, stressing financial repercussions.",
                            "Chapter IX addresses miscellaneous provisions, including overriding powers and the ability to issue directives."
                        ]
                    },
                    {
                        heading: "Impact on IT Companies and Businesses",
                        paragraph: "The Digital Personal Data Protection Act, 2023, represents a significant shift in the regulatory landscape for IT companies and businesses operating in India. Here are some of the key impacts:",
                        points: [
                            "Increased Compliance Obligations: IT companies must now ensure that they have lawful grounds for processing personal data and that they obtain explicit consent from Data Principals. They are also required to inform Data Principals about data collection and processing activities, adhere to data accuracy and security norms, and promptly report data breaches.",
                            "Enhanced Data Principal Rights: IT businesses must be equipped to handle requests from Data Principals seeking to access, correct, update, or erase their data. Companies must also implement systems for grievance redressal and management of data after a principal's incapacitation or death.",
                            "International Data Transfer Restrictions: Companies involved in international data transactions will need to navigate new restrictions and ensure compliance with the act when transferring data across borders.",
                            "Startup Considerations: While there are certain exemptions carved out for startups and smaller entities, these businesses must still be cognizant of the broader implications of the act on their operations and growth.",
                            "Regulatory Oversight: The establishment of the Data Protection Board of India means that IT businesses will be subject to scrutiny and regulation by this new authority, which holds powers similar to a civil court.",
                            "Penalties and Dispute Resolution: The act prescribes substantial penalties for significant breaches, with factors considered for penalty determination. IT companies are encouraged to resolve disputes through mediation and can appeal decisions through an Appellate Tribunal.",
                            "Priority over Conflicting Laws: IT companies must now ensure that their data protection practices are aligned with this act, as it takes precedence over other conflicting laws."
                        ]
                    }
                ],
                conclusion: "The enactment of the Digital Personal Data Protection Act, 2023, marks a pivotal development in the protection of personal data within India's digital ecosystem. IT companies and businesses must carefully assess and revamp their data handling practices to ensure compliance with this new regulation. While the act imposes certain burdens in terms of compliance and operational adjustments, it also brings an opportunity for businesses to enhance their reputation for data stewardship and potentially gain a competitive advantage.\n\nUltimately, this act is expected to bolster consumer confidence in digital services by providing a more secure and transparent data processing environment. It's a significant step towards aligning India's data protection standards with global best practices, which is especially pertinent as the digital economy continues to surge."
            },
            {
                id: 2,
                title: "Business Growing Tips for Sales Globally",
                date: "February 22, 2026",
                image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=800",
                category: "Strategy",
                slug: "business-growing-tips",
                overview: "",
                sections: [],
                conclusion: ""
            },
            {
                id: 3,
                title: "How to Install Droip into Local WP Server?",
                date: "February 22, 2026",
                image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
                category: "Development",
                slug: "install-droip-local-wp",
                overview: "",
                sections: [],
                conclusion: ""
            },
            {
                id: 4,
                title: "Future of Cloud Security and AI Integration",
                date: "March 01, 2026",
                image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
                category: "AI & Data",
                slug: "future-cloud-security-ai",
                overview: "",
                sections: [],
                conclusion: ""
            }
        ]
    }
};
