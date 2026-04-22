/**
 * AMYNTOR TECH - Master Content Schema
 * Version: 1.0 (Lean Edition)
 * Description: One-click creation of all content tables. 
 * Note: Navbar and Footer are hardcoded as per client request.
 */

-- 1. AUTHENTICATION (Master Login)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin'
);

-- 2. HOMEPAGE DYNAMIC SECTIONS
CREATE TABLE IF NOT EXISTS hero_slides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tag VARCHAR(100),
    title VARCHAR(255),
    subtitle TEXT,
    image_url LONGTEXT,
    button_text VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS stats_counters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50),
    subtitle VARCHAR(50),
    value VARCHAR(20),
    icon_name VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    designation VARCHAR(100),
    quote TEXT,
    feedback TEXT,
    avatar_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS partners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    logo_url VARCHAR(255)
);

-- 3. ABOUT PAGE (Team)
CREATE TABLE IF NOT EXISTS team_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    role VARCHAR(100),
    image_url VARCHAR(255),
    order_index INT DEFAULT 0
);

-- 4. SERVICES & SUB-FEATURE CARDS
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    icon LONGTEXT,
    image_url LONGTEXT,
    conclusion LONGTEXT
);

CREATE TABLE IF NOT EXISTS service_features (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id INT,
    title VARCHAR(255),
    description TEXT,
    icon LONGTEXT,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- 5. CASE STUDIES (Dynamic Projects)
CREATE TABLE IF NOT EXISTS case_studies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    slug VARCHAR(255) UNIQUE,
    thumbnail_image LONGTEXT,
    category VARCHAR(100),
    description TEXT
);

-- 6. BLOG POSTS (Relational content)
CREATE TABLE IF NOT EXISTS blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    slug VARCHAR(255) UNIQUE,
    date_published VARCHAR(50),
    category VARCHAR(50),
    image_url LONGTEXT,
    overview TEXT,
    content TEXT -- Stores structured HTML/JSON for details
);

-- 7. CAREERS (Job Listings)
CREATE TABLE IF NOT EXISTS job_listings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    department VARCHAR(100),
    job_type VARCHAR(50),
    location VARCHAR(100),
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. GALLERY (Photo management)
CREATE TABLE IF NOT EXISTS gallery_albums (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    event_date VARCHAR(50),
    preview_image LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    album_id INT,
    title VARCHAR(150),
    image_url LONGTEXT,
    FOREIGN KEY (album_id) REFERENCES gallery_albums(id) ON DELETE CASCADE
);

-- 9. CONTACT FORM INBOX
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100),
    email VARCHAR(100),
    subject VARCHAR(200),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 10. ABOUT PAGE: HERO SECTION
CREATE TABLE IF NOT EXISTS about_page_hero (
    id INT PRIMARY KEY DEFAULT 1,
    tag VARCHAR(100),
    title VARCHAR(255),
    tagline TEXT,
    background_image LONGTEXT
);

-- 11. ABOUT PAGE: COMPANY OVERVIEW
CREATE TABLE IF NOT EXISTS about_page_company (
    id INT PRIMARY KEY DEFAULT 1,
    tag VARCHAR(100),
    heading VARCHAR(255),
    description TEXT
);

-- 12. ABOUT PAGE: COMPANY CARDS (Mission, Vision, Values)
CREATE TABLE IF NOT EXISTS about_page_cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    icon TEXT
);

-- 13. ABOUT PAGE: TEAM SECTION HEADER
CREATE TABLE IF NOT EXISTS about_page_team_header (
    id INT PRIMARY KEY DEFAULT 1,
    tag VARCHAR(100),
    heading VARCHAR(255)
);

-- 14. HOME PAGE: ABOUT SECTION HEADER (Who We Are)
CREATE TABLE IF NOT EXISTS about_section (
    id INT PRIMARY KEY DEFAULT 1,
    tag VARCHAR(100),
    title VARCHAR(255),
    description TEXT,
    left_card_value VARCHAR(50),
    left_card_text VARCHAR(100),
    left_card_description TEXT,
    cta_text VARCHAR(100),
    cta_link VARCHAR(255),
    main_image LONGTEXT,
    top_image LONGTEXT
);

-- 15. HOME PAGE: TESTIMONIAL HEADER
CREATE TABLE IF NOT EXISTS testimonial_header (
    id INT PRIMARY KEY DEFAULT 1,
    tag VARCHAR(100),
    title VARCHAR(255),
    stat_value VARCHAR(100),
    stat_text VARCHAR(100),
    side_image_url LONGTEXT
);

-- 16. SERVICES PAGE: HERO SECTION
CREATE TABLE IF NOT EXISTS services_page_hero (
    id INT PRIMARY KEY DEFAULT 1,
    tag VARCHAR(100),
    title VARCHAR(255),
    tagline TEXT,
    background_image LONGTEXT
);

-- 17. SERVICES PAGE: INTRODUCTION SECTION
CREATE TABLE IF NOT EXISTS services_page_intro (
    id INT PRIMARY KEY DEFAULT 1,
    tag VARCHAR(100),
    heading VARCHAR(255),
    description TEXT
);
