import heroBg from '../../assets/images/gallery-bg.jpg';

import Img1 from '../../assets/images/about-us1.jpg';
import Img2 from '../../assets/images/about-us2.jpg';
import Img3 from '../../assets/images/branch1.jpg';
import Img4 from '../../assets/images/case1.jpg';
import Img5 from '../../assets/images/case2.jpg';
import Img6 from '../../assets/images/cybersecurity-shield.jpg';
import Img7 from '../../assets/images/data-center.jpg';
import Img8 from '../../assets/images/resilience.jpg';

/**
 * Code Walkthrough: galleryData.js (Event Folder Edition)
 * 
 * Purpose: A high-end data schema that organizes visuals into professional "Event Folders."
 * Structure: 
 * - events[]: An array of milestone folders.
 * - previewImage: The "cover" visual for the folder card.
 * - images[]: The specific high-impact gallery inside that event.
 */
export const galleryPageData = {
    hero: {
        tag: "Our Visuals",
        title: "Photo Gallery",
        tagline: "Explore our prestigious company milestones, culture, and technological innovations through a folder-based lens.",
        backgroundImage: heroBg,
        breadcrumbs: [
            { label: "Home", link: "/" },
            { label: "Resources", link: "#" },
            { label: "Gallery", link: "/gallery" }
        ]
    },
    // 🧭 EVENT FOLDERS: Organized by strategic milestone
    events: [
        {
            id: 1,
            title: "Cybersecurity Workshop 2026",
            date: "March 08, 2026",
            previewImage: Img6,
            description: "Advanced zero-trust architecture training and simulation for enterprise teams.",
            images: [
                { id: 601, url: Img6, title: "Shielding Simulation" },
                { id: 602, url: Img4, title: "System Stress Test" },
                { id: 603, url: Img7, title: "Server Infrastructure Analysis" }
            ]
        },
        {
            id: 2,
            title: "Executive Strategic Retreat",
            date: "February 15, 2026",
            previewImage: Img1,
            description: "Q1 strategic planning sessions focusing on global digital transformation goals.",
            images: [
                { id: 101, url: Img1, title: "Corporate Alignment Seminar" },
                { id: 102, url: Img8, title: "Business Resilience Session" },
                { id: 103, url: Img2, title: "Collaborative Workshop" }
            ]
        },
        {
            id: 3,
            title: "Digital Infrastructure Expansion",
            date: "January 10, 2026",
            previewImage: Img7,
            description: "Successful scaling of our Tier-4 data center facilities across the APAC region.",
            images: [
                { id: 701, url: Img7, title: "High-Density Server Tier" },
                { id: 702, url: Img4, title: "Interpreting Real-Time Metrics" },
                { id: 703, url: Img6, title: "Shield Enforcement Modules" }
            ]
        },
        {
            id: 4,
            title: "New Operations Hub Launch",
            date: "November 20, 2025",
            previewImage: Img3,
            description: "Grand unveiling of our state-of-the-art regional operations center in Thiruvananthapuram.",
            images: [
                { id: 301, url: Img3, title: "Main Lobby Architecture" },
                { id: 302, url: Img2, title: "Agile Workspace Layout" },
                { id: 303, url: Img5, title: "Client Briefing Suite" }
            ]
        }
    ]
};
