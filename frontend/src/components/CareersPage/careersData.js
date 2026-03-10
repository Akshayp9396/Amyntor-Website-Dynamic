import heroBg from '../../assets/images/service-hero.jpg';
import introImage from '../../assets/images/about-us1.jpg'; // Placeholder for the intro section right side

export const careersPageData = {
    hero: {
        tag: "Join Our Team",
        title: "Careers",
        tagline: "Build the future of cybersecurity and digital innovation with us. We are always looking for passionate people to join our mission.",
        backgroundImage: heroBg,
        breadcrumbs: [
            { label: "Home", link: "/" },
            { label: "Company", link: "#" },
            { label: "Careers", link: "/careers" }
        ]
    },
    intro: {
        heading: "Shape the Future of Technology",
        description: "At Amyntor Tech Solutions, we believe that our greatest asset is our people. We foster a culture of continuous learning, innovation, and collaboration. Whether you are a seasoned expert or a passionate fresher, we provide the platform for you to excel and make a real impact.",
        image: introImage
    },
    openRoles: [
        {
            id: 1,
            title: "Senior Cybersecurity Analyst",
            experience: "5+ Years",
            openings: 2,
            postedDate: "2026-03-01",
            category: "Security",
            slug: "senior-cybersecurity-analyst",
            roleOverview: "We are seeking a highly skilled Senior Cybersecurity Analyst to join our elite security team. You will be responsible for protecting our clients' digital assets, detecting and responding to advanced threats, and leading proactive security assessments. This role requires deep technical expertise and strong leadership capabilities.",
            responsibilities: [
                "Monitor security infrastructure and respond to advanced cyber threats in real-time.",
                "Conduct vulnerability assessments, penetration testing, and risk analyses.",
                "Design and implement robust security architectures and incident response playbooks.",
                "Mentor junior analysts and lead security awareness training.",
                "Collaborate with IT and engineering teams to ensure secure by design principles."
            ],
            qualifications: [
                "Bachelor's degree in Computer Science, Information Security, or related field.",
                "5+ years of demonstrable experience in cybersecurity or SOC environments.",
                "Industry certifications such as CISSP, CISM, CEH, or OSCP are highly preferred.",
                "Strong understanding of network protocols, operating systems, and cloud security."
            ],
            skills: ["Threat Hunting", "Incident Response", "SIEM (Splunk/QRadar)", "Vulnerability Management", "Network Security"]
        },
        {
            id: 2,
            title: "Frontend Developer (React)",
            experience: "2-4 Years",
            openings: 3,
            postedDate: "2026-03-05",
            category: "Engineering",
            slug: "frontend-developer-react",
            roleOverview: "We are looking for a passionate Frontend Developer to build dynamic, responsive, and secure web applications. You will work closely with our designers and backend engineers to implement pixel-perfect UIs and ensure exceptional user experiences across all devices.",
            responsibilities: [
                "Develop features and user interfaces using React.js and modern JavaScript.",
                "Translate UI/UX design wireframes to actual code that will produce visual elements.",
                "Optimize applications for maximum speed and scalability.",
                "Collaborate with back-end developers and web designers to improve usability.",
                "Write clean, testable, and maintainable code."
            ],
            qualifications: [
                "Bachelor's degree in Computer Science or a related technical field.",
                "2-4 years of experience delivering high-quality frontend web applications.",
                "Proven experience with React.js and its core principles.",
                "Familiarity with RESTful APIs and modern frontend build pipelines."
            ],
            skills: ["React.js", "JavaScript (ES6+)", "Tailwind CSS", "HTML5 & Vanilla CSS", "Framer Motion", "Git"]
        },
        {
            id: 3,
            title: "Junior Quality Assurance Tester",
            experience: "Fresher / 0-1 Year",
            openings: 5,
            postedDate: "2026-03-08",
            category: "QA",
            slug: "junior-qa-tester",
            roleOverview: "Start your career in tech with Amyntor! We are seeking detail-oriented Junior QA Testers to ensure the quality and reliability of our software products. You will learn industry-standard testing methodologies and work alongside experienced QA engineers.",
            responsibilities: [
                "Execute manual test cases and analyze results.",
                "Report bugs and errors to development teams using tracking tools like Jira.",
                "Help troubleshoot issues and verify bug fixes.",
                "Collaborate with QA Engineers to develop effective strategies and test plans.",
                "Conduct post-release and post-implementation testing."
            ],
            qualifications: [
                "Bachelor's degree in Computer Science, IT, or a related field (Recent graduates encouraged).",
                "Basic understanding of software development life cycle (SDLC) and QA methodologies.",
                "Strong analytical and problem-solving skills.",
                "Excellent attention to detail and communication skills."
            ],
            skills: ["Manual Testing", "Bug Tracking (Jira)", "Test Case Design", "Attention to Detail", "Basic SQL / API Testing"]
        },
        {
            id: 4,
            title: "Cloud Infrastructure Architect",
            experience: "7+ Years",
            openings: 1,
            postedDate: "2026-02-20",
            category: "Cloud",
            slug: "cloud-infrastructure-architect",
            roleOverview: "As a Cloud Infrastructure Architect, you will spearhead the design and implementation of highly scalable, secure, and resilient cloud solutions. You will be a key technology leader, advising clients on cloud strategy and guiding engineering teams through complex migrations.",
            responsibilities: [
                "Design and deploy scalable, highly available, and fault-tolerant cloud environments (AWS/Azure).",
                "Develop and execute cloud migration strategies for enterprise clients.",
                "Implement robust security and compliance measures within cloud infrastructures.",
                "Create infrastructure as code (IaC) templates and automate deployments.",
                "Provide technical leadership and mentorship to engineering teams."
            ],
            qualifications: [
                "Bachelor's or Master's degree in Computer Science or Engineering.",
                "7+ years of IT experience, with at least 3+ years in a Cloud Architect role.",
                "Advanced certifications (e.g., AWS Certified Solutions Architect - Professional, Azure Solutions Architect Expert).",
                "Deep expertise in networking, computing, storage, and database services in the cloud."
            ],
            skills: ["AWS / Azure Core Services", "Infrastructure as Code (Terraform/CloudFormation)", "Kubernetes / Docker", "CI/CD Pipelines", "Cloud Security Architecture"]
        }
    ]
};
