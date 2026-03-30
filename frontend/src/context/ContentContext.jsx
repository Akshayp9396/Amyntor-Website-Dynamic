import React, { createContext, useContext, useState } from 'react';
import { Users, Briefcase, Award } from 'lucide-react';
import ShieldImage from '../assets/images/cybersecurity-shield.jpg';
import DataCenterImage from '../assets/images/data-center.jpg';
import ResilienceImage from '../assets/images/resilience.jpg';
import AboutUs1 from '../assets/images/about-us1.jpg';
import AboutUs2 from '../assets/images/about-us2.jpg';
import { mockAboutPageData } from '../components/AboutPage/aboutData';
import { mockServicesPageData } from '../components/ServicesPage/servicesData';
import { galleryPageData as mockGalleryData } from '../components/GalleryPage/galleryData';
import { mockCaseStudyPageData } from '../components/CaseStudyPage/caseStudyData';
import { careersPageData as mockCareersData } from '../components/CareersPage/careersData';
import { contactPageData as mockContactData } from '../components/ContactPage/contactData';
import { mockBlogPageData } from '../components/BlogPage/blogData';

import Testimonial1 from '../assets/images/testimonial1.png';

const ContentContext = createContext();

export const useContent = () => useContext(ContentContext);

export const ContentProvider = ({ children }) => {
    // ==== DEMO INITIAL STATE MAPPED FROM PUBLIC SITE ====

    // 1. Hero Slides
    const [heroSlides, setHeroSlides] = useState([
        {
            id: 1,
            tag: "CYBERSECURITY EXCELLENCE",
            title: "Ensuring IT Excellence and Cybersecurity",
            subtitle: "Securing your digital future with IT excellence and cybersecurity expertise.",
            image: ShieldImage,
            buttonText: "Start A Project"
        },
        {
            id: 2,
            tag: "CLOUD TRANSFORMATION",
            title: "Unleashing the Potential of Cloud Technology",
            subtitle: "Secure your transition to the cloud. We design zero-trust architectures to ensure continuous compliance and data integrity.",
            image: DataCenterImage,
            buttonText: "Start A Project"
        },
        {
            id: 3,
            tag: "FUTURE-PROOF INFRASTRUCTURE",
            title: "Enabling Digital Resilience, Today and Tomorrow",
            subtitle: "Building digital resilience for a secure and adaptable future.",
            image: ResilienceImage,
            buttonText: "Start A Project"
        }
    ]);

    // 2. About Section
    const [aboutData, setAboutData] = useState({
        tag: "Get to Know Us",
        title: "Transforming Businesses Through Technology",
        description: "Amyntor Tech Solutions, helmed by a diverse team of young and seasoned professionals, encompasses a rich tapestry of skills. With our headquarters nestled in Thiruvananthapuram, we extend our presence across the vast expanse of India. As proud sentinels of Cybersecurity Services, complete IT and Cloud Infrastructure solutions, and managed services prowess, we invite you to embark on a remarkable journey with us. Our unwavering dedication has garnered resounding endorsements from customers spanning the globe, attesting to our sterling reputation. Placing paramount importance on exceptional customer service, we fervently prioritize the unique needs and requirements of our esteemed clientele. Our unwavering mission is to deliver services of unparalleled quality, complemented by an unwavering commitment to exceptional after-sales support.",
        leftCardValue: "300+",
        leftCardText: "Projects Completed",
        leftCardDescription: "We serve businesses of all sizes around the world",
        ctaText: "Learn More",
        ctaLink: "/about",
        mainImage: AboutUs1,
        topImage: AboutUs2,
    });

    // 3. Stats Row
    const [statsData, setStatsData] = useState([
        {
            id: 1,
            title: "Happy",
            subtitle: "Clients",
            value: "352",
            icon: "Users" // String to allow dynamic mapping later
        },
        {
            id: 2,
            title: "Government",
            subtitle: "Projects",
            value: "127",
            icon: "Briefcase"
        },
        {
            id: 3,
            title: "Expert",
            subtitle: "Workforce",
            value: "57",
            icon: "Award"
        }
    ]);

    // 4. Testimonials
    const [testimonialHeader, setTestimonialHeader] = useState({
        tag: "Testimonial",
        title: "What Our Customers\nAre Saying",
        sideImage: Testimonial1,
        statValue: "97% Customers",
        statText: "Satisfaction Rate"
    });

    const [testimonials, setTestimonials] = useState([
        {
            id: 1,
            name: "Maisha Jakulin",
            designation: "UI/UX Designer",
            quote: "Amazing Services!",
            feedback: "Technically sound chains main business and paids marketplace technology that's targeted audience simplify interoperable vortals via reliable done",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
        },
        {
            id: 2,
            name: "Jobaer Khanom",
            designation: "App Developer",
            quote: "Amazing Services!",
            feedback: "Technically sound chains main business and paids marketplace technology that's targeted audience simplify interoperable vortals via reliable done",
            avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150"
        }
    ]);

    // 5. Partners
    const [partners, setPartners] = useState([
        { id: 1, name: "Google Cloud", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg", width: 90 },
        { id: 2, name: "Cisco", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg", width: 70 },
        { id: 3, name: "TP-Link", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e4/TP-Link_logo_2016.svg", width: 100 },
        { id: 4, name: "Aruba", logo: "https://upload.wikimedia.org/wikipedia/commons/2/23/Aruba_Networks_logo.svg", width: 70 },
        { id: 5, name: "Hewlett Packard Enterprise", logo: "https://upload.wikimedia.org/wikipedia/commons/4/46/Hewlett_Packard_Enterprise_logo.svg", width: 90 },
        { id: 6, name: "Dell", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2ebe/Dell_logo_2016.svg", width: 50 },
        { id: 7, name: "Check Point", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Check_Point_logo.svg", width: 100 },
        { id: 8, name: "Sophos", logo: "https://upload.wikimedia.org/wikipedia/commons/4/41/Sophos_logo.svg", width: 80 }
    ]);

    // 6. About Page Specific Content
    const [aboutPageData, setAboutPageData] = useState(mockAboutPageData);

    // 7. Services Page Specific Content
    const [servicesPageData, setServicesPageData] = useState(mockServicesPageData);

    // 8. Gallery Page Specific Content
    const [galleryPageData, setGalleryPageData] = useState(mockGalleryData);
    const [caseStudyPageData, setCaseStudyPageData] = useState(mockCaseStudyPageData);
    const [careersPageData, setCareersPageData] = useState(mockCareersData);
    const [contactPageData, setContactPageData] = useState(mockContactData);
    const [blogPageData, setBlogPageData] = useState(mockBlogPageData);

    const value = {
        heroSlides, setHeroSlides,
        aboutData, setAboutData,
        statsData, setStatsData,
        testimonials, setTestimonials,
        testimonialHeader, setTestimonialHeader,
        partners, setPartners,
        aboutPageData, setAboutPageData,
        servicesPageData, setServicesPageData,
        galleryPageData,
        setGalleryPageData,
        caseStudyPageData,
        setCaseStudyPageData,
        careersPageData,
        setCareersPageData,
        contactPageData,
        setContactPageData,
        blogPageData,
        setBlogPageData
    };

    return (
        <ContentContext.Provider value={value}>
            {children}
        </ContentContext.Provider>
    );
};
