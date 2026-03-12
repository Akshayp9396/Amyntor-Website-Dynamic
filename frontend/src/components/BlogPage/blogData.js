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
                slug: "installation-sales-navigator"
            },
            {
                id: 2,
                title: "Business Growing Tips for Sales Globally",
                date: "February 22, 2026",
                image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=800",
                category: "Strategy",
                slug: "business-growing-tips"
            },
            {
                id: 3,
                title: "How to Install Droip into Local WP Server?",
                date: "February 22, 2026",
                image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
                category: "Development",
                slug: "install-droip-local-wp"
            },
            {
                id: 4,
                title: "Future of Cloud Security and AI Integration",
                date: "March 01, 2026",
                image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
                category: "AI & Data",
                slug: "future-cloud-security-ai"
            }
        ]
    }
};
