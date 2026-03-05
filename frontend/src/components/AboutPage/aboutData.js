/**
 * Code Walkthrough
 * Centralized mock data for the About Us page components.
 * This object (mockAboutPageData) stores text, images, and other content
 * to keep the UI components strictly visual and dynamic, adhering to Phase 2 standards.
 */
import heroBg from '../../assets/images/about-hero.jpg';
import imgAbhilash from '../../assets/images/AbhilashR.jpg';
import imgKavitha from '../../assets/images/kavitha.jpg';
import imgSandeep from '../../assets/images/sandeep.jpg';
import imgJishnu from '../../assets/images/jishnu.jpg';
import imgJoson from '../../assets/images/joson.jpg';
import imgRadhakrishnan from '../../assets/images/radhakrishan.jpg';

export const mockAboutPageData = {
    hero: {
        tag: "Amyntor",
        title: "About Us",
        breadcrumbs: [
            { label: "Home", link: "/" },
            { label: "About Us", link: "/about" }
        ],
        tagline: "At Amyntor, we believe technology should empower businesses to grow, adapt, and thrive in an ever-changing digital landscape. With a team of passionate IT experts.",
        backgroundImage: heroBg,
    },
    aboutCompany: {
        tag: "• ABOUT OUR COMPANY •",
        heading: "Empower Your Business with Agile Solutions",
        description1: "Encompasses a rich tapestry of skills. With our headquarters nestled in Thiruvananthapuram, we extend our presence across the vast expanse of India. As proud sentinels of Cybersecurity Services, complete IT and Cloud Infrastructure solutions, and managed services prowess, we invite you to embark on a remarkable journey with us. Our unwavering dedication has garnered resounding endorsements from customers spanning the globe, attesting to our sterling reputation. Placing paramount importance on exceptional customer service, we fervently prioritize the unique needs and requirements of our esteemed clientele. Our unwavering mission is to deliver services of unparalleled quality, complemented by an unwavering commitment to exceptional after-sales support.",
        // description2: "Committed to the delivering exceptional in the value through our strategic inset, innovative approaches empower.",
        cards: [
            {
                id: 1,
                title: "Our Mission",
                description: "At Amyntor Tech Solutions, we are driven by a singular mission - to cultivate a dynamic and diverse portfolio in the realm of Cybersecurity Services, complete IT and Cloud Infrastructure solutions, IT product distributions, and managed services. Guided by our unwavering commitment to excellence, we strive to empower organizations with innovative and comprehensive solutions that safeguard their digital assets, optimize their technology infrastructure, and propel their business growth",
                icon: "Target"
            },
            {
                id: 2,
                title: "Our Vision",
                description: "Empowering Cybersecurity Awareness and Protection through Quality Service, Innovation, and Leading-edge Technologies. Together, we forge a resilient digital landscape, equipping our clients with the knowledge, tools, and solutions to safeguard their digital assets in an ever-evolving cybersecurity landscape. With unwavering commitment, we strive to be the trusted partner organizations turn to for cutting-edge defense strategies.",
                icon: "Eye"
            },
            {
                id: 3,
                title: "Our Values",
                description: "Empowering Success through Authenticity, Expertise, and Timely Solutions. We are dedicated to meeting and exceeding our customers' expectations by delivering services and expertise that are authentic, aligned with functional requirements, and executed within the defined turnaround time. With a focus on excellence, we strive to build lasting relationships based on trust and deliver tangible value to our customers' business objectives.",
                icon: "Diamond"
            }
        ]
    },
    aboutTeam: {
        tag: "Our Team",
        heading: "Meet the Expert Team Powering \nOur Goals and Ambitions",
        members: [
            {
                id: 1,
                name: "Abhilash R",
                role: "CEO",
                image: imgAbhilash
            },
            {
                id: 2,
                name: "Kavitha MD",
                role: "Director",
                image: imgKavitha
            },
            {
                id: 3,
                name: "Sandeep Ramachandran",
                role: "CEO",
                image: imgSandeep
            },
            {
                id: 4,
                name: "Jishnu Raj",
                role: "CTO",
                image: imgJishnu
            },
            {
                id: 5,
                name: "Joson Jose",
                role: "COO",
                image: imgJoson
            },
            {
                id: 6,
                name: "Radha Krishnan VS",
                role: "CFO",
                image: imgRadhakrishnan
            }
        ]
    }
    // Future sections (Timeline) will be appended here
};
