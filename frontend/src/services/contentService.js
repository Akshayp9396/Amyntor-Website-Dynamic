/**
 * Amyntor Tech: Content Service Layer 🛡️ 🚀 🚥 
 * 
 * MISSION: To serve as the 'Dedicated Courier' for all Public Content missions.
 * WHY: Separation of Concerns (Communication vs. State). 
 * This file is the ONLY place that talks to the Backend API for public data.
 */

import axios from 'axios';

export const API_BASE_URL = 'http://localhost:5050/api/public';

// 🕵️ HELPER: Resolve real computer photo paths from the backend (Port 5050)
const fixUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('/uploads/')) {
        return `http://localhost:5050${path}`;
    }
    return path;
};

const ContentService = {
    // 🕵️ SHARED: Central Media Gateway (Uploads to /api/public/upload)
    uploadImage: async (formData) => {
        const res = await axios.post(`${API_BASE_URL}/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    },

    // 🛡️ MISSION 1: Fetch Home Hero Slides
    getHeroSlides: async () => {
        const res = await axios.get(`${API_BASE_URL}/hero`);
        if (res.data.success) {
            return res.data.data.map(slide => ({
                id: slide.id,
                tag: slide.tag,
                title: slide.title,
                subtitle: slide.subtitle,
                image: fixUrl(slide.image_url),
                buttonText: slide.button_text
            }));
        }
        return [];
    },

    // 🛡️ MISSION 2: Fetch Performance Stats
    getStats: async () => {
        const res = await axios.get(`${API_BASE_URL}/stats`);
        if (res.data.success) {
            return res.data.data.map(st => ({
                id: st.id,
                title: st.title,
                subtitle: st.subtitle,
                value: st.value,
                icon: fixUrl(st.icon_name)
            }));
        }
        return [];
    },

    // 🛡️ MISSION 3: Fetch About Summary (Home)
    getAboutSection: async () => {
        const res = await axios.get(`${API_BASE_URL}/about`);
        if (res.data.success && res.data.data) {
            const d = res.data.data;
            return {
                tag: d.tag, title: d.title, description: d.description,
                leftCardValue: d.left_card_value, leftCardText: d.left_card_text, leftCardDescription: d.left_card_description,
                ctaText: d.cta_text, ctaLink: d.cta_link,
                mainImage: fixUrl(d.main_image), topImage: fixUrl(d.top_image)
            };
        }
        return null;
    },

    // 🛡️ MISSION 4: Fetch Testimonials
    getTestimonials: async () => {
        const headerRes = await axios.get(`${API_BASE_URL}/testimonial-header`);
        const listRes = await axios.get(`${API_BASE_URL}/testimonials`);

        let header = null;
        if (headerRes.data.success && headerRes.data.data) {
            const d = headerRes.data.data;
            header = {
                tag: d.tag, title: d.title, sideImage: fixUrl(d.side_image_url),
                statValue: d.stat_value, statText: d.stat_text
            };
        }

        let list = [];
        if (listRes.data.success) {
            list = listRes.data.data.map(t => ({
                id: t.id, name: t.name, designation: t.designation,
                quote: t.quote, feedback: t.feedback, avatar: fixUrl(t.avatar_url)
            }));
        }

        return { header, list };
    },

    // 🛡️ MISSION 5: Fetch Strategic Partners
    getPartners: async () => {
        const res = await axios.get(`${API_BASE_URL}/partners`);
        if (res.data.success) {
            return res.data.data.map(p => ({
                id: p.id, name: p.name, description: p.description, logo: fixUrl(p.logo_url)
            }));
        }
        return [];
    },

    // 🛡️ MISSION 6: Fetch Full About Page
    getAboutPageFull: async () => {
        const res = await axios.get(`${API_BASE_URL}/about/full`);
        if (res.data.success) {
            const d = res.data.data;
            return {
                hero: {
                    tag: d.hero?.tag || "",
                    title: d.hero?.title || "",
                    tagline: d.hero?.tagline || "",
                    backgroundImage: fixUrl(d.hero?.background_image),
                    breadcrumbs: [
                        { label: 'Home', link: '/' },
                        { label: 'About Us', link: '/about' }
                    ]
                },
                aboutCompany: {
                    tag: d.aboutCompany?.tag || "",
                    heading: d.aboutCompany?.heading || "",
                    description1: d.aboutCompany?.description || "",
                    description2: d.aboutCompany?.description2 || "",
                    mainImage: fixUrl(d.aboutCompany?.main_image),
                    experienceYears: d.aboutCompany?.experience_years || "",
                    experienceText: d.aboutCompany?.experience_text || "",
                    cards: d.cards || []
                },
                teamSection: {
                    tag: d.teamSection?.tag || "",
                    heading: d.teamSection?.heading || "",
                    description: d.teamSection?.description || "",
                    members: (d.teamSection?.members || []).map(m => ({
                        ...m,
                        image: fixUrl(m.image_url)
                    }))
                }
            };
        }
        return null;
    },

    // 🛡️ MISSION 7: Fetch All Services (Cards & Dashboard)
    getServices: async () => {
        const res = await axios.get(`${API_BASE_URL}/services`);
        if (res.data.success) {
            return res.data.data.map(s => ({
                id: s.id,
                title: s.title,
                slug: s.slug,
                description: s.description,
                icon: fixUrl(s.icon),
                image: fixUrl(s.image_url)
            }));
        }
        return [];
    },

    // 🛡️ MISSION 8: Get Service by Slug (Detail Pages)
    getServiceBySlug: async (slug) => {
        const res = await axios.get(`${API_BASE_URL}/services/${slug}`);
        if (res.data.success) {
            const s = res.data.data;
            return {
                ...s,
                icon: fixUrl(s.icon),
                image: fixUrl(s.image_url)
            };
        }
        return null;
    },

    // 🛡️ MISSION 9: Admin Upsert (Add/Update) Service
    upsertService: async (serviceData) => {
        const url = serviceData.id
            ? `${API_BASE_URL}/services/${serviceData.id}`
            : `${API_BASE_URL}/services`;
        const method = serviceData.id ? 'put' : 'post';

        const res = await axios[method](url, serviceData);
        return res.data;
    },

    // 🛡️ MISSION 10: Admin Delete Service
    deleteService: async (id) => {
        const res = await axios.delete(`${API_BASE_URL}/services/${id}`);
        return res.data;
    },

    // 🛡️ MISSION 11: Fetch Full Services Page (Hydration)
    getServicesPageFull: async () => {
        const res = await axios.get(`${API_BASE_URL}/services/full`);
        if (res.data.success) {
            const d = res.data.data;
            return {
                hero: {
                    tag: d.hero?.tag || "Our Expertise",
                    title: d.hero?.title || "Our Services",
                    tagline: d.hero?.tagline || "Empowering your business with cutting-edge IT infrastructure, cloud solutions, and robust cybersecurity services.",
                    backgroundImage: fixUrl(d.hero?.background_image),
                    breadcrumbs: d.hero?.breadcrumbs || [
                        { label: 'Home', link: '/' },
                        { label: 'Services', link: '/services' }
                    ]
                },
                serviceIntro: {
                    tag: d.serviceIntro?.tag || "Our Solutions",
                    heading: d.serviceIntro?.heading || "One place for all solutions.",
                    description: d.serviceIntro?.description || "Embark on a transformative journey as you enter our realm of unparalleled technological solutions...",
                    features: d.serviceIntro?.features || []
                },
                servicesList: {
                    items: (d.servicesList?.items || []).map(s => ({
                        ...s,
                        icon: fixUrl(s.icon),
                        image: fixUrl(s.image_url)
                    }))
                }
            };
        }
        return null;
    },

    // 🛡️ MISSION 12: Admin Update Service Content (Hero & Intro)
    updateServicesContent: async (contentData) => {
        const res = await axios.put(`${API_BASE_URL}/services/content/bulk`, contentData);
        return res.data;
    },

    // 🛡️ MISSION 13: Fetch Full Case Studies Page (Hydration)
    getCaseStudiesFull: async () => {
        const res = await axios.get(`${API_BASE_URL}/case-studies/full`);
        if (res.data.success) {
            const d = res.data.data;
            return {
                hero: {
                    tag: d.hero?.tag || "Success Stories",
                    title: d.hero?.title || "Real Impact, Real Results",
                    tagline: d.hero?.tagline || "Explore how we empower businesses with our elite cybersecurity and technology solutions.",
                    backgroundImage: fixUrl(d.hero?.background_image),
                    breadcrumbs: [
                        { label: 'Home', link: '/' },
                        { label: 'Case Studies', link: '/case-studies' }
                    ]
                },
                caseStudies: (d.caseStudies || []).map(s => ({
                    ...s,
                    image: fixUrl(s.image),
                    tags: typeof s.tags === 'string' ? JSON.parse(s.tags) : s.tags,
                    scopeOfWork: typeof s.scope_of_work === 'string' ? JSON.parse(s.scope_of_work) : s.scope_of_work,
                    siteActions: typeof s.site_actions === 'string' ? JSON.parse(s.site_actions) : s.site_actions,
                    resultsAndBenefits: typeof s.results_and_benefits === 'string' ? JSON.parse(s.results_and_benefits) : s.results_and_benefits,
                    siteActionsIntro: s.site_actions_intro
                }))
            };
        }
        return null;
    },

    // 🛡️ MISSION 14: Admin Update Case Study Hero
    updateCaseStudyHero: async (heroData) => {
        const res = await axios.put(`${API_BASE_URL}/case-studies/hero`, heroData);
        return res.data;
    },

    // 🛡️ MISSION 15: Admin Upsert (Add/Update) Case Study
    upsertCaseStudy: async (studyData) => {
        const url = studyData.id
            ? `${API_BASE_URL}/case-studies/${studyData.id}`
            : `${API_BASE_URL}/case-studies`;
        const method = studyData.id ? 'put' : 'post';

        const res = await axios[method](url, studyData);
        return res.data;
    },

    // 🛡️ MISSION 16: Admin Delete Case Study
    deleteCaseStudy: async (id) => {
        const res = await axios.delete(`${API_BASE_URL}/case-studies/${id}`);
        return res.data;
    },

    // 🛡️ MISSION 17: BLOG AUTHORITY (Retailing the intellectual narrative)
    getBlogsFull: async () => {
        const res = await axios.get(`${API_BASE_URL}/blogs/full`);
        return res.data;
    },
    updateBlogHero: async (heroData) => {
        const res = await axios.post(`${API_BASE_URL}/blogs/hero`, heroData);
        return res.data;
    },
    upsertBlog: async (blogData) => {
        const res = await axios.post(`${API_BASE_URL}/blogs`, blogData);
        return res.data;
    },
    deleteBlog: async (id) => {
        const res = await axios.delete(`${API_BASE_URL}/blogs/${id}`);
        return res.data;
    },

    // 🛡️ MISSION 18: GALLERY AUTHORITY (Dynamic Folders)
    getGalleryFull: async () => {
        const res = await axios.get(`http://localhost:5050/api/gallery/public`);
        if (res.data.success) {
            return {
                events: res.data.events.map(event => ({
                    ...event,
                    previewImage: fixUrl(event.previewImage),
                    images: event.images.map(img => ({ ...img, url: fixUrl(img.url) }))
                }))
            };
        }
        return null;
    },

    upsertAlbum: async (albumData, token) => {
        // We'll pass token manually if interceptor doesn't exist, though usually it does.
        const method = albumData.id ? 'put' : 'post';
        const url = albumData.id ? `http://localhost:5050/api/gallery/albums/${albumData.id}` : `http://localhost:5050/api/gallery/albums`;
        const res = await axios[method](url, albumData, { headers: { Authorization: `Bearer ${token}` } });
        return res.data;
    },
    deleteAlbum: async (id, token) => {
        const res = await axios.delete(`http://localhost:5050/api/gallery/albums/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        return res.data;
    },
    addImageToAlbum: async (imageData, token) => {
        const res = await axios.post(`http://localhost:5050/api/gallery/images`, imageData, { headers: { Authorization: `Bearer ${token}` } });
        return res.data;
    },
    deleteImage: async (id, token) => {
        const res = await axios.delete(`http://localhost:5050/api/gallery/images/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        return res.data;
    },

    // 🛡️ MISSION 19: PARTNERS PAGE HERO (Architectural Identity)
    getPartnersPageHero: async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/partners/hero`);
            if (res.data.success && res.data.data) {
                const d = res.data.data;
                return {
                    tag: d.tag,
                    title: d.title,
                    tagline: d.tagline,
                    backgroundImage: fixUrl(d.background_image)
                };
            }
        } catch (err) {
            console.error("❌ ContentService: Partners Hero Mission Failed", err);
        }
        return null;
    },

    // 🛡️ MISSION 20: GALLERY PAGE HERO (Visual Identity)
    getGalleryPageHero: async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/gallery/hero`);
            if (res.data.success && res.data.data) {
                const d = res.data.data;
                return {
                    tag: d.tag,
                    title: d.title,
                    tagline: d.tagline,
                    backgroundImage: fixUrl(d.background_image)
                };
            }
        } catch (err) {
            console.error("❌ ContentService: Gallery Hero Mission Failed", err);
        }
        return null;
    },

    updateGalleryPageHero: async (heroData) => {
        const res = await axios.put(`${API_BASE_URL}/gallery/hero`, heroData);
        return res.data;
    },

    // ─── MISSION 21: CAREER & TALENT PIPELINE ───────────────────────────────
    // 🕵️ Full hydration: hero, intro, and all open roles from MySQL
    getCareersFull: async () => {
        const res = await axios.get('http://localhost:5050/api/careers/full');
        if (res.data.success) {
            const d = res.data.data;
            return {
                hero: { ...d.hero, backgroundImage: fixUrl(d.hero?.backgroundImage) },
                intro: { ...d.intro, image: fixUrl(d.intro?.image) },
                openRoles: d.openRoles || []
            };
        }
        return null;
    },

    // 🛡️ Save hero & intro sections to careers_content table
    updateCareersContent: async (contentData) => {
        const res = await axios.put('http://localhost:5050/api/careers/content', contentData);
        return res.data;
    },

    // 🛡️ Add or edit a job in the open_roles table
    upsertRole: async (roleData) => {
        const res = await axios.post('http://localhost:5050/api/careers/role', roleData);
        return res.data;
    },

    // 🛡️ Permanently delete a role from the open_roles table
    deleteRole: async (id) => {
        const res = await axios.delete(`http://localhost:5050/api/careers/role/${id}`);
        return res.data;
    },

    // 🕵️ Public: Candidate submits a job application (Multi-Part FormData)
    submitApplication: async (formData) => {
        const res = await axios.post('http://localhost:5050/api/careers/apply', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    },

    // 🛡️ Admin: Fetch all applications from job_applications table
    getApplications: async () => {
        const res = await axios.get('http://localhost:5050/api/careers/applications');
        return res.data;
    },

    // 🛡️ Admin: Auto-save status change (Applied → Shortlisted → Hired etc.)
    updateApplicationStatus: async (id, status) => {
        const res = await axios.put('http://localhost:5050/api/careers/application/status', { id, status });
        return res.data;
    },

    // ─── MISSION 22: CONTACT AUTHORITY ──────────────────────────────────────────
    // 🕵️ Full hydration for Contact Page: Hero, Info, Emails, Socials, Branches
    getContactFull: async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/contact/full`);
            if (res.data.success) {
                const d = res.data.data;
                return {
                    hero: {
                        tag: d.hero?.tag || "",
                        title: d.hero?.title || "",
                        tagline: d.hero?.tagline || "",
                        backgroundImage: fixUrl(d.hero?.background_image)
                    },
                    info: {
                        tag: d.info?.tag || "",
                        title: d.info?.title || "",
                        description: d.info?.description || "",
                        emails: d.info?.emails || [],
                        socials: d.info?.socials || [],
                        phone: {
                            number: d.info?.phone_number || "",
                            hours: d.info?.phone_hours || ""
                        },
                        whatsapp: {
                            number: d.info?.whatsapp_number || "",
                            label: d.info?.whatsapp_label || ""
                        },
                        googleMapsUrl: d.info?.google_maps_url || ""
                    },
                    branches: {
                        tag: d.branches?.tag || "",
                        title: d.branches?.title || "",
                        description: d.branches?.description || "",
                        cards: (d.branches?.cards || []).map(c => ({
                            ...c,
                            address: c.address || "",
                            city: c.city || "",
                            type: c.type || "",
                            phone: c.phone || "",
                            email: c.email || "",
                            image: fixUrl(c.image_url)
                        }))
                    }
                };
            }
        } catch (err) {
            console.error("❌ ContentService: Contact Mission Failed", err);
        }
        return null;
    },

    updateContactContent: async (contactData) => {
        const res = await axios.put(`${API_BASE_URL}/contact/content`, contactData);
        return res.data;
    },
    updateContactEmails: async (emails) => {
        const res = await axios.put(`${API_BASE_URL}/contact/emails`, { emails });
        return res.data;
    },
    updateContactSocials: async (socials) => {
        const res = await axios.put(`${API_BASE_URL}/contact/socials`, { socials });
        return res.data;
    },
    updateContactBranches: async (branchData) => {
        const res = await axios.put(`${API_BASE_URL}/contact/branches`, branchData);
        return res.data;
    },

    // 🛡️ MISSION 23: INQUIRY INTELLIGENCE (Form Submissions)
    submitContactInquiry: async (formData) => {
        const res = await axios.post(`${API_BASE_URL}/contact/submit`, formData);
        return res.data;
    },

    getSubmissions: async () => {
        const res = await axios.get(`${API_BASE_URL}/contact/submissions`);
        return res.data;
    },
    
    updateInquiryStatus: async (id, status) => {
        const res = await axios.put(`${API_BASE_URL}/contact/submissions/${id}/status`, { status });
        return res.data;
    }
};

export default ContentService;
