import heroBg from '../../assets/images/service-hero.jpg';

import Img1 from '../../assets/images/about-us1.jpg';
import Img2 from '../../assets/images/about-us2.jpg';
import Img3 from '../../assets/images/branch1.jpg';
import Img4 from '../../assets/images/case1.jpg';
import Img5 from '../../assets/images/case2.jpg';
import Img6 from '../../assets/images/cybersecurity-shield.jpg';
import Img7 from '../../assets/images/data-center.jpg';
import Img8 from '../../assets/images/resilience.jpg';

export const galleryPageData = {
    hero: {
        tag: "Our Visuals",
        title: "Photo Gallery",
        tagline: "Explore a dynamic collection of our company culture, milestones, and technological innovations.",
        backgroundImage: heroBg,
        breadcrumbs: [
            { label: "Home", link: "/" },
            { label: "Resources", link: "#" },
            { label: "Gallery", link: "/gallery" }
        ]
    },
    // The images array contains items with varying aspect ratios.
    // They are sorted in the UI component by date, ensuring latest uploads appear first.
    images: [
        {
            id: 1,
            url: Img1,
            title: "Corporate Seminar",
            category: "Events",
            date: "2026-02-15"
        },
        {
            id: 2,
            url: Img2,
            title: "Team Building Retreat",
            category: "Culture",
            date: "2026-03-01" // Newer
        },
        {
            id: 3,
            url: Img3,
            title: "New Office Layout",
            category: "Facilities",
            date: "2025-11-20"
        },
        {
            id: 4,
            url: Img4,
            title: "Data Center Expansion",
            category: "Tech",
            date: "2026-01-10"
        },
        {
            id: 5,
            url: Img5,
            title: "Client Presentation",
            category: "Clients",
            date: "2025-09-05"
        },
        {
            id: 6,
            url: Img6,
            title: "Cybersecurity Workshop",
            category: "Events",
            date: "2026-03-08" // Newest!
        },
        {
            id: 7,
            url: Img7,
            title: "Server Deployment",
            category: "Tech",
            date: "2025-12-12"
        },
        {
            id: 8,
            url: Img8,
            title: "Sales Meeting Break",
            category: "Culture",
            date: "2026-02-05"
        }
    ]
};
