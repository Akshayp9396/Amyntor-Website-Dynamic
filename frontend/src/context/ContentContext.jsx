import React, { createContext, useContext, useState } from 'react';
import ContentService from '../services/contentService';

// All components should now rely exclusively on live hydration from ContentService.
// No mock imports allowed in dynamic production environment.

const ContentContext = createContext();

export const useContent = () => useContext(ContentContext);

export const ContentProvider = ({ children }) => {
    // ==== 🛡️ REFINED INDUSTRY-STANDARD STATE (CLEAN START) ====

    // 1. Hero Slides
    const [heroSlides, setHeroSlides] = useState([]);

    // 2. About Section (Home)
    const [aboutData, setAboutData] = useState({
        tag: "", title: "", description: "",
        leftCardValue: "", leftCardText: "", leftCardDescription: "",
        ctaText: "", ctaLink: "",
        mainImage: null, topImage: null
    });

    // 3. Stats Row
    const [statsData, setStatsData] = useState([]);

    // 4. Testimonials (Header & Feed)
    const [testimonialHeader, setTestimonialHeader] = useState({
        tag: "", title: "", sideImage: null, statValue: "", statText: ""
    });
    const [testimonials, setTestimonials] = useState([]);

    // 5. Partners Hub
    const [partners, setPartners] = useState([]);
    const [partnersPageHero, setPartnersPageHero] = useState({
        tag: "",
        title: "",
        tagline: "",
        backgroundImage: null
    });

    // 6. Detailed Page Missions (About & Services)
    const [aboutPageData, setAboutPageData] = useState({
        hero: { tag: "", title: "", tagline: "", backgroundImage: null, breadcrumbs: [] },
        aboutCompany: { tag: "", heading: "", description1: "", description2: "", mainImage: null, experienceYears: "", experienceText: "", cards: [] },
        teamSection: { tag: "", heading: "", description: "", members: [] }
    });
    const [servicesPageData, setServicesPageData] = useState({
        hero: {
            tag: "",
            title: "",
            tagline: "",
            backgroundImage: "",
            breadcrumbs: []
        },
        serviceIntro: {
            tag: "",
            heading: "",
            description: "",
            features: []
        },
        servicesList: { items: [] }
    });
    const [galleryPageData, setGalleryPageData] = useState({ events: [] });
    const [galleryPageHero, setGalleryPageHero] = useState({
        tag: "",
        title: "",
        tagline: "",
        backgroundImage: null
    });
    const [caseStudyPageData, setCaseStudyPageData] = useState({ 
        hero: { tag: "", title: "", tagline: "", backgroundImage: null, breadcrumbs: [] },
        items: [] 
    });
    const [careersPageData, setCareersPageData] = useState({
        hero: { tag: "", title: "", tagline: "", backgroundImage: null, breadcrumbs: [] },
        intro: { heading: "", description: "", image: null },
        openRoles: [] 
    });
    const [applicants, setApplicants] = useState([]);
    const [contactPageData, setContactPageData] = useState({ 
        hero: { tag: "", title: "", tagline: "", backgroundImage: null, breadcrumbs: [] }, 
        info: { 
            emails: [], socials: [], 
            phone: { number: "", hours: "" }, 
            whatsapp: { number: "", label: "" } 
        }, 
        branches: { tag: "", title: "", description: "", cards: [] } 
    });
    const [blogPageData, setBlogPageData] = useState(null);

    // 🕵️ CLOUD CONNECTION ENGINE (The Master Sync)
    const [loading, setLoading] = useState(true);

    const refreshContent = React.useCallback(async () => {
        try {
            setLoading(true);

            // 🛡️ MISSION 1: Load Hero Data
            const heroData = await ContentService.getHeroSlides();
            setHeroSlides(heroData);

            // 🛡️ MISSION 2: Load Stats Row
            const stData = await ContentService.getStats();
            setStatsData(stData);

            // 🛡️ MISSION 3: Load Home About Summary
            const homeAbout = await ContentService.getAboutSection();
            if (homeAbout) setAboutData(homeAbout);

            // 🛡️ MISSION 4: Load Testimonials (Combined)
            const testimonialData = await ContentService.getTestimonials();
            if (testimonialData.header) setTestimonialHeader(testimonialData.header);
            setTestimonials(testimonialData.list);

            // 🛡️ MISSION 5: Load Partners
            const partnerData = await ContentService.getPartners();
            setPartners(partnerData);

            // 🛡️ MISSION 6: Load Full About Page
            const aboutPageFull = await ContentService.getAboutPageFull();
            if (aboutPageFull) setAboutPageData(aboutPageFull);

            // 🛡️ MISSION 7: Load Full Services Page
            const servicesPageFull = await ContentService.getServicesPageFull();
            if (servicesPageFull) setServicesPageData(servicesPageFull);

            // 🛡️ MISSION 8: Load Full Case Studies Page
            const caseStudyFull = await ContentService.getCaseStudiesFull();
            if (caseStudyFull) setCaseStudyPageData(caseStudyFull);

            // 🛡️ MISSION 9: Load Full Blog Page
            const blogRes = await ContentService.getBlogsFull();
            if (blogRes && blogRes.success) {
                setBlogPageData(blogRes);
            }

            // 🛡️ MISSION 10: Load Full Gallery
            const galleryRes = await ContentService.getGalleryFull();
            if (galleryRes && galleryRes.events) {
                setGalleryPageData(prev => ({
                    ...prev,
                    events: galleryRes.events
                }));
            }

            // 🛡️ MISSION 11: Load Partners Page Hero
            const pPageHero = await ContentService.getPartnersPageHero();
            if (pPageHero) setPartnersPageHero(pPageHero);

            // 🛡️ MISSION 12: Load Gallery Page Hero
            const gPageHero = await ContentService.getGalleryPageHero();
            if (gPageHero) setGalleryPageHero(gPageHero);

            // 🛡️ MISSION 13: Load Full Careers Page from MySQL
            // IMPORTANT: We deep-merge API data into the existing mock structure.
            // This preserves required fields like 'breadcrumbs' that the public components
            // need but the API does not return.
            try {
                const careersRes = await ContentService.getCareersFull();
                if (careersRes) {
                    setCareersPageData(prev => ({
                        ...prev,
                        // Deep merge hero: keep all mock fields, only overwrite what API provides
                        hero: {
                            ...prev.hero,
                            ...(careersRes.hero?.tag ? { tag: careersRes.hero.tag } : {}),
                            ...(careersRes.hero?.title ? { title: careersRes.hero.title } : {}),
                            ...(careersRes.hero?.tagline ? { tagline: careersRes.hero.tagline } : {}),
                            ...(careersRes.hero?.backgroundImage ? { backgroundImage: careersRes.hero.backgroundImage } : {})
                        },
                        // Deep merge intro similarly
                        intro: {
                            ...prev.intro,
                            ...(careersRes.intro?.heading ? { heading: careersRes.intro.heading } : {}),
                            ...(careersRes.intro?.description ? { description: careersRes.intro.description } : {}),
                            ...(careersRes.intro?.image ? { image: careersRes.intro.image } : {})
                        },
                        // Replace openRoles with DB content. If DB is empty, show empty list.
                        openRoles: Array.isArray(careersRes.openRoles) ? careersRes.openRoles : (prev.openRoles || [])
                    }));
                }
            } catch (careersErr) {
                console.warn('Careers API unavailable, using mock data:', careersErr.message);
            }

        } catch (error) {
            console.error("Critical Content Failure:", error);
        } finally {
            // 11. Contact Page Infrastructure
            const contactData = await ContentService.getContactFull();
            if (contactData) {
                setContactPageData(contactData);
            }

            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        refreshContent();
    }, [refreshContent]);

    return (
        <ContentContext.Provider value={{
            heroSlides, setHeroSlides,
            aboutData, setAboutData,
            statsData, setStatsData,
            testimonialHeader, setTestimonialHeader,
            testimonials, setTestimonials,
            partners, setPartners,
            partnersPageHero, setPartnersPageHero,
            aboutPageData, setAboutPageData,
            servicesPageData, setServicesPageData,
            galleryPageHero, setGalleryPageHero,
            galleryPageData, setGalleryPageData,
            caseStudyPageData, setCaseStudyPageData,
            careersPageData, setCareersPageData,
            applicants, setApplicants,
            contactPageData, setContactPageData,
            blogPageData, setBlogPageData,
            loading,
            refreshContent
        }}>
            {children}
        </ContentContext.Provider>
    );
};
