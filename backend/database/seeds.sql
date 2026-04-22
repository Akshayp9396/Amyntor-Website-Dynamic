/**
 * AMYNTOR TECH: MASTER SEED DATA (The Digital Water)
 * ───────────────────────────────────────────────
 * Use this file AFTER running schema.sql to instantly
 * populate every dynamic section of your website.
 */

-- ==========================================
-- 1. HOME PAGE SEEDS
-- ==========================================

-- Hero Slides
INSERT INTO hero_slides (tag, title, subtitle, image_url, button_text)
VALUES 
('CYBERSECURITY EXCELLENCE', 'Ensuring IT Excellence and Cybersecurity', 'Securing your digital future with IT excellence and cybersecurity expertise.', '/uploads/shield-demo.jpg', 'Start A Project'),
('CLOUD TRANSFORMATION', 'Unleashing the Potential of Cloud Technology', 'Secure your transition to the cloud with zero-trust architectures.', '/uploads/datacenter-demo.jpg', 'Start A Project');

-- Stats Counters
INSERT INTO stats_counters (title, subtitle, value, icon_name)
VALUES 
('Happy', 'Clients', '352', 'Users'),
('Government', 'Projects', '127', 'Briefcase'),
('Expert', 'Workforce', '57', 'Award');

-- Testimonials
INSERT INTO testimonials (name, designation, quote, feedback, avatar_url)
VALUES 
('Maisha Jakulin', 'UI/UX Designer', 'Amazing Services!', 'Technically sound expertise that simplified our marketplace technology.', '/uploads/avatar-demo-1.png'),
('Jobaer Khanom', 'App Developer', 'Amazing Services!', 'Reliable done and targeted audience interoperable vortals.', '/uploads/avatar-demo-2.png');

-- Testimonial Header (Stat Card)
INSERT INTO testimonial_header (id, tag, title, stat_value, stat_text, side_image_url)
VALUES (1, 'Testimonial', 'What Our Customers Are Saying', '97% Customers', 'Satisfaction Rate', '/uploads/testimonial-hero-demo.png')
ON DUPLICATE KEY UPDATE id=1;

-- Partners
INSERT INTO partners (name, logo_url)
VALUES 
('Google Cloud', 'https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg'),
('Cisco', 'https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg');

-- About Section (On Home Page)
INSERT INTO about_section (id, tag, title, description, left_card_value, left_card_text, left_card_description, cta_text, cta_link, main_image, top_image)
VALUES (1, 'Get to Know Us', 'Transforming Businesses Through Technology', 'Amyntor Tech Solutions provides a rich tapestry of cybersecurity and cloud skills.', '300+', 'Projects Completed', 'We serve businesses of all sizes internationally', 'Learn More', '/about', '/uploads/about-1-demo.jpg', '/uploads/about-2-demo.jpg')
ON DUPLICATE KEY UPDATE id=1;


-- ==========================================
-- 2. ABOUT PAGE (FULL) SEEDS
-- ==========================================

-- About Hero
INSERT INTO about_page_hero (id, tag, title, tagline, background_image)
VALUES (1, 'ABOUT AMYNTOR TECH', 'Leading the Way in Cybersecurity', 'We provide world-class digital resilience and IT infrastructure solutions for global enterprises.', '/uploads/about-hero-demo.jpg')
ON DUPLICATE KEY UPDATE id=1;

-- About Company Overview
INSERT INTO about_page_company (id, tag, heading, description)
VALUES (1, 'WHO WE ARE', 'Our Journey of Innovation', 'Amyntor Tech Solutions is a team of young and seasoned professionals dedicated to securing the digital future of businesses globally.')
ON DUPLICATE KEY UPDATE id=1;

-- Company Cards (Mission / Vision / Values)
INSERT INTO about_page_cards (title, description, icon)
VALUES 
('Our Mission', 'To provide unparalleled cybersecurity and IT infrastructure quality.', 'Target'),
('Our Vision', 'To become the global gold-standard for proactive digital defense.', 'Eye'),
('Our Values', 'Excellence, Integrity, and Continuous Innovation.', 'Diamond');

-- Team Header
INSERT INTO about_page_team_header (id, tag, heading) 
VALUES (1, 'OUR EXPERTS', 'Meet the Visionaries Behind Your Security')
ON DUPLICATE KEY UPDATE id=1;

-- Team Members
INSERT INTO team_members (name, role, image_url)
VALUES 
('Abhilash R', 'Chief Executive Officer', '/uploads/team-demo-1.jpg'),
('Cyber Lead', 'Cybersecurity Specialist', '/uploads/team-demo-2.jpg');
