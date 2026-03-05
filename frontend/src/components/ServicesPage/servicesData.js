import heroBg from '../../assets/images/about-hero.jpg'; // We can reuse the same abstract tech bg or a dark one for now

export const mockServicesPageData = {
    hero: {
        tag: "Our Expertise",
        title: "Our Services",
        tagline: "Empowering your business with cutting-edge IT infrastructure, cloud solutions, and robust cybersecurity services.",
        backgroundImage: heroBg,
        breadcrumbs: [
            { label: "Home", link: "/" },
            { label: "Services", link: "/services" }
        ]
    },
    serviceIntro: {
        tag: "Our Solutions",
        heading: "One place for all solutions.",
        description: `Embark on a transformative journey as you enter our realm of unparalleled technological solutions. At Amyntor Tech Solutions, we present a singular haven where all your technology aspirations find their rightful place. With a vast array of offerings, ranging from cutting-edge Cybersecurity Services to complete IT and Cloud Infrastructure solutions, and meticulously curated managed services, we orchestrate a symphony of seamless integration across your digital landscape.

Safeguarding your invaluable assets against dynamic threats, optimizing your IT infrastructure with unrivalled precision, and harnessing the boundless potential of cloud computing are just a glimpse of our unwavering commitment to excellence.

Entrust us with your technology needs and unlock the power of simplified operations, enabling you to focus on your core business objectives.Immerse yourself in the convenience, efficiency, and tailored expertise of our all encompassing solutions, crafted with utmost dedication and bolstered by our resolute pledge to your resounding success.`,
        features: [

        ]
    },
    servicesList: {
        tag: "Services",
        heading: "Delivering End-to-End IT, Cloud, and Cybersecurity Solutions",
        items: [
            {
                id: 1,
                title: "Cyber Security",
                slug: "cyber-security",
                description: "Amyntor specializes in providing a range of comprehensive cybersecurity services. Our offerings include Red Teaming to simulate cyber attacks, vulnerability assessments and penetration testing to identify weaknesses, security compliance and auditing for regulatory requirements, operational technology security for critical infrastructure, SOC services for real-time monitoring and response, cybersecurity consulting for strategic planning, and security awareness and training to empower employees. With our expertise, we help organizations strengthen their security defenses and protect against evolving threats.",
                icon: "Fingerprint"
            },
            {
                id: 2,
                title: "IT Infrastructure",
                slug: "it-infrastructure",
                description: "Amyntor specializes in providing comprehensive IT infrastructure services tailored to meet the specific needs of organizations. We offer a wide range of solutions to optimize your network infrastructure, deploy server and storage environments, set up data centers, ensure data protection and business continuity, implement virtualization technologies, enhance collaboration and communication, and provide expert project management and consultation. With our expertise and dedicated team, we assist organizations in achieving reliable, secure, and efficient IT infrastructure that supports their business objectives.",
                icon: "ServerCog"
            },
            {
                id: 3,
                title: "Cloud and DevOps",
                slug: "cloud-and-devops",
                description: "At Amyntor, we specialize in helping organizations harness the power of the cloud and adopt DevOps practices for streamlined and efficient operations. Our services encompass cloud strategy and planning, cloud infrastructure setup and management, application and data migration, monitoring and support, DevOps strategy and planning, toolchain selection and automation, and workflow optimization and collaboration. With our expertise, organizations can leverage the cloud to enhance scalability, performance, and security while implementing DevOps practices to accelerate software development and improve collaboration.",
                icon: "CloudCog"
            },
            {
                id: 4,
                title: "Managed Services",
                slug: "managed-services",
                description: "Welcome to Amyntor, your trusted partner for Managed IT Services (MSP) and Managed Security Services (MSSP). We handle the setup, management, and optimization of your IT infrastructure, ensuring security, reliability, and performance. Our services include network monitoring, proactive maintenance, help desk support, data backup and recovery, robust security measures, efficient cloud services management, and disaster recovery planning. As an MSSP, we specialize in 24/7 threat monitoring and detection, rapid incident response and management, vulnerability assessments, SOC as a Service, compliance support, security awareness training, and strategic security consulting. Choose Amyntor for comprehensive MSP and MSSP solutions, empowering your business with robust IT infrastructure management and cutting-edge security services.",
                icon: "Headset"
            },
            {
                id: 5,
                title: "Distribution",
                slug: "distribution",
                description: "Amyntor is a trusted distributor of IT products and services. We offer a comprehensive range of networking products, enterprise-grade laptops and desktops, and servers to meet the diverse needs of businesses. With our partnerships with Azure, AWS, and GCP, we provide cloud reseller services and solutions, enabling businesses to scale, collaborate, and innovate. Our security solutions include cutting-edge technologies like EDR, XDR, MDR, DLP, CASB, SASE, and more, ensuring robust protection against cybersecurity threats. Additionally, as a distributor of Microsoft products, we help businesses implement and manage Microsoft 365 subscriptions, providing them with productivity tools and cloud-based services. Choose Amyntor as your trusted partner for all your IT distribution needs.",
                icon: "Boxes"
            },
            {
                id: 6,
                title: "Digital Personal Data Protection",
                slug: "dpdp",
                description: "The Digital Personal Data Protection Act, 2023 (DPDP Act) ushers in a new paradigm of data privacy, and our bespoke IT security services are designed to ensure your seamless transition into this era. Our comprehensive suite of services addresses every aspect of the act, providing you with the confidence that your business operations are fully compliant and secure.",
                icon: "FileKey"
            }
        ]
    }
};
