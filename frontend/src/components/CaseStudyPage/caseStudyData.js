import case1 from '../../assets/images/case1.jpg';
import case2 from '../../assets/images/case2.jpg';
import case3 from '../../assets/images/case3.jpg';
import case4 from '../../assets/images/case4.jpg';
import heroBg from '../../assets/images/casestudy-herobg.jpg';

export const mockCaseStudyPageData = {
    hero: {
        tag: "Success Stories",
        title: "Case Studies",
        breadcrumbs: [
            { label: "Home", link: "/" },
            { label: "Resources", link: "#" }, 
            { label: "Case Studies", link: "/case-study" }
        ],
        tagline: "Explore how we have empowered businesses with cutting-edge cybersecurity, IT infrastructure, and robust networking solutions.",
        backgroundImage: heroBg
    },
    caseStudies: [
        {
            id: 1,
            title: "Implementation of Campus-wide Wi-Fi and Networking Infrastructure for PMS Dental College",
            tags: ["Networking"],
            image: case1,
            introduction: "PMS Dental College aimed to enhance its technological infrastructure by implementing a comprehensive campus wide Wi-Fi and networking solution. This case study outlines the actions taken to establish a robust network infrastructure, including cabling, fiber connectivity, access points, VLAN configuration, firewall implementation, and internet management. The successful deployment resulted in improved connectivity and enhanced user experience for students, staff, and office personnel.",
            scopeOfWork: {
                intro: "The project's scope involved the following key areas:",
                points: [
                    "Campus-wide Wi-Fi connection for students",
                    "LAN network for the Hospital Management System (HMS)",
                    "Office Wi-Fi connection with networking"
                ]
            },
            siteActionsIntro: "To achieve the project objectives, the following actions were taken on-site:",
            siteActions: [
                { title: "Cabling and Conduiting", description: "A total of 5,795 meters of CAT 6 cabling was installed for networking purposes. This involved laying cables and conduits throughout the campus to provide connectivity to various buildings and areas." },
                { title: "Fiber Connectivity", description: "Buildings were connected via fiber cables to ensure high-speed and reliable connectivity. Over 1,000 meters of fiber cables were deployed, enabling seamless communication between different locations within the campus." },
                { title: "Wi-Fi Access Points", description: "More than 100 access points were strategically installed across the campus to ensure comprehensive coverage and reliable Wi-Fi connectivity for students and staff. These access points provided seamless internet access in classrooms, libraries, common areas, and hostels." },
                { title: "Internet Management Solution", description: "An internet management solution was implemented to manage more than 1,000 student connections. The solution included AAA (Authentication, Authorization, and Accounting) authentication, ensuring secure access for authorized users. Additionally, HTTPS logs were maintained to monitor and analyze user activity." },
                { title: "Switching Infrastructure", description: "To support the network connectivity, a combination of layer 2+ switches and layer 2 switches were deployed. Two layer 2+ switches and seven layer 2 switches were installed to facilitate efficient data transmission and manage network traffic effectively." },
                { title: "VLAN Configuration", description: "Three VLANs (Virtual Local Area Networks) were implemented to segregate and manage the different connectivity requirements. This configuration allowed for separate networks for students, HMS, and office staff, ensuring enhanced security and network performance." },
                { title: "Firewall Implementation", description: "A firewall was deployed to secure the internal network infrastructure. This safeguarded the network against unauthorized access and potential threats, providing an additional layer of protection to sensitive data and systems." }
            ],
            resultsAndBenefits: {
                intro: "The implementation of the campus-wide Wi-Fi and networking infrastructure yielded several positive outcomes, including:",
                points: [
                    { title: "Comprehensive Wi-Fi coverage", description: "The deployment of over 100 access points enabled students and staff to access the internet seamlessly throughout the campus." },
                    { title: "Enhanced connectivity", description: "The upgraded network infrastructure facilitated fast and reliable connectivity, supporting various activities such as online research, e-learning, and communication" },
                    { title: "Improved network management", description: "VLAN configuration and internet management solutions ensured efficient network management, enabling prioritization of network resources and enhancing overall performance." },
                    { title: "Secure network environment", description: "The firewall implementation bolstered network security, protecting against unauthorized access and potential cyber threats." },
                    { title: "Case study creation", description: "The project provided a valuable case study for industrial standard networking, showcasing the successful implementation of a complex network infrastructure for an educational institution." }
                ]
            },
            conclusion: "The successful implementation of a campus-wide Wi-Fi and networking solution at PMS Dental College significantly improved the connectivity and network performance for students, staff, and office personnel. The robust infrastructure, comprising cabling, fiber connectivity, access points, VLANs, and firewall, resulted in enhanced productivity, security, and user experience within the college campus. This case study serves as a testament to the effectiveness and importance of a well planned networking solution in educational institutions."
        },
        {
            id: 2,
            title: "Implementation of Networking Infrastructure for FIOW Mart Supermarket",
            tags: ["Networking"],
            image: case2,
            introduction: "FIOW Mart needed a resilient, high-speed point-of-sale network to process thousands of transactions daily while supporting inventory management systems and IP security cameras across a sprawling retail floor.",
            scopeOfWork: {
                intro: "The project's scope involved the following key areas:",
                points: [
                    "High-availability Point of Sale (POS) networking",
                    "Separation of IP surveillance from corporate data",
                    "Comprehensive wireless coverage for inventory tablets"
                ]
            },
            siteActionsIntro: "To achieve the project objectives, the following actions were taken on-site:",
            siteActions: [
                { title: "Dual-WAN Deployment", description: "Installed Edge routers with dual WAN links to ensure automatic failover and zero transaction downtime." },
                { title: "VLAN Segmentation", description: "Strictly isolated the POS subnet from the guest Wi-Fi and IP camera systems to maintain PCI compliance." }
            ],
            resultsAndBenefits: {
                intro: "The infrastructure overhaul yielded the following benefits:",
                points: [
                    { title: "Zero Downtime", description: "Automated failover successfully prevented transaction failure during ISP outages." },
                    { title: "PCI DSS Compliance", description: "Achieved full compliance via air-gapped data segregation." }
                ]
            },
            conclusion: "By restructuring their physical and logical network topography, FIOW Mart secured their revenue pipeline against network failures while protecting sensitive customer hardware from internal vulnerabilities."
        },
        // Fill remaining with generic fallbacks so the app doesn't crash
        ...[3, 4, 5, 6, 7].map(id => ({
            id,
            title: "Additional IT Infrastructure Modernization and Deployment Case Study",
            tags: ["Server Configuration"],
            image: case3,
            introduction: "This organization required an ultra-secure, compartmentalized environment to handle their internal data, demanding strict adherence to modern security practices.",
            scopeOfWork: {
                intro: "The project's scope involved the following key areas:",
                points: ["Enterprise infrastructure refresh", "High-Availability deployment", "Security auditing"]
            },
            siteActionsIntro: "To achieve the project objectives, the following actions were taken on-site:",
            siteActions: [
                { title: "Hardware Deployment", description: "Deployed bare metal servers and high-throughput switches." },
                { title: "Configuration", description: "Configured Layer-3 routing and deeply segmented VLAN architectures." }
            ],
            resultsAndBenefits: {
                intro: "The deployment yielded several positive outcomes:",
                points: [
                    { title: "Enhanced Security", description: "Zero-trust principles strictly enforced at edge nodes." },
                    { title: "Massive Throughput", description: "Eliminated operational bottlenecks permanently." }
                ]
            },
            conclusion: "The successful modernization resulted in enhanced productivity and zero operational friction for the enterprise."
        }))
    ],
    sidebar: {
        cta: {
            title: "Need a Similar Solution?",
            description: "Our engineering team is ready to architect a custom, secure, and scalable infrastructure tailored exactly to your operational needs.",
            buttonText: "Start Your Project",
            buttonLink: "/contact"
        },
        contact: {
            phone: "+91 471 2080 478",
            phoneRaw: "+914712080478",
            email: "Info@amyntortech.com"
        }
    }
};
