/**
 * Code Walkthrough
 * This file contains the default content for the Contact page.
 * It serves as the initial state for the dynamic content management system.
 */
import heroBg from '../../assets/images/contact-bg.png'; // Corrected extension
import br1 from '../../assets/images/branch1.jpg';
import br2 from '../../assets/images/branch2.jpg';
import br3 from '../../assets/images/branch3.jpg';

export const contactPageData = {
    hero: {
        tag: "Get In Touch",
        title: "Contact Us",
        tagline: "At Amyntor, we believe technology should empower businesses to grow, adapt, and thrive in an ever-changing digital landscape. Let's connect and discuss your requirements.",
        backgroundImage: heroBg
    },
    info: {
        tag: "Contact Us",
        title: "Get in Touch with Amyntor Contact Information",
        description: "We're always ready to help your business. Let's talk with us.",
        emails: [
            { id: 1, label: "Email (Consultation)", value: "Info@amyntortech.com" },
            { id: 2, label: "Email (Sales)", value: "Sales@amyntortech.com" },
            { id: 3, label: "Email (Cloud)", value: "CSP@amyntortech.com" },
            { id: 4, label: "Email (Cybersecurity)", value: "Infosec@amyntortech.com" }
        ],
        phone: {
            number: "+91 471 208 0478",
            hours: "(Monday- Saturday)\n(10 am-6 pm)"
        },
        whatsapp: {
            number: "+917510550478",
            label: "Technical Support"
        },
        socials: [
            { id: 1, platform: "Facebook", link: "#" },
            { id: 2, platform: "Twitter/X", link: "#" },
            { id: 3, platform: "LinkedIn", link: "#" },
            { id: 4, platform: "Instagram", link: "#" }
        ],
        googleMapsUrl: "https://maps.google.com/maps?q=Amyntor%20Tech%20Solutions%20Pvt%20Ltd.,%20Trivandrum&t=&z=14&ie=UTF8&iwloc=&output=embed"
    },
    branches: {
        tag: "Our Branches",
        title: "Visit another branch Office",
        description: "Collaboratively supply functional metrics for maintainable users. We reinvent unique value perfectly tailored for just in time consultation practices.",
        cards: [
            {
                id: 1,
                city: "Technopark, Trivandrum",
                type: "HEAD QUARTERS",
                address: "Amyntor Tech Solutions Pvt Ltd, T-TBI, G3B, Ground Floor, Thejaswini Building, Technopark Campus, Kariyavattom, Trivandrum",
                phone: "+91 471 208 0478",
                email: "info@amyntortech.com",
                image: br1
            },
            {
                id: 2,
                city: "Monvila",
                type: "BRANCH OFFICE",
                address: "Amyntor Tech Solutions Pvt, TC.97/603, SPRA-157, Opp: Don Bosco Road Monvila, Thiruvananthapuram PIN:695581",
                phone: "+91 471 208 0478",
                email: "info@amyntortech.com",
                image: br2
            },
            {
                id: 3,
                city: "Cochin",
                type: "BRANCH OFFICE",
                address: "1st Floor, Joemars, Behind Community Hall, Girinagar, Kadavantra, Cochin, Kerala, 682020",
                phone: "+91 471 208 0478",
                email: "info@amyntortech.com",
                image: br3
            }
        ]
    }
};
