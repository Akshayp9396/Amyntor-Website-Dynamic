# Amyntor Tech: Frontend Architectural Documentation

## Overview
This document provides a comprehensive overview of the frontend architecture for the Amyntor Tech Website rebuild. The application is built using React, structured as a single-page application (SPA) with React Router for navigation, and utilizes Framer Motion for premium animations.

The architecture strictly adheres to a "100% Dynamic" philosophy where UI components are decoupled from content data.

---

## 1. Directory Tree Architecture

The `/frontend/src` directory is strictly divided into reusable components and assembler pages according to "Senior Architect" standards:

```text
/frontend/src/
├── App.jsx                     # Root React Router configuration
├── main.jsx                    # React bootstrap entry point
├── assets/                     # Static media (images, global icons)
├── pages/public/               # "Assembler" Pages (Controllers)
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Services.jsx
│   ├── ServiceDetails.jsx      # Dynamic detail template route
│   ├── CaseStudy.jsx
│   ├── CaseStudyDetails.jsx    # Dynamic detail template route
│   ├── BlogPage.jsx
│   ├── CareersPage.jsx
│   ├── CareersDetails.jsx      # Dynamic detail template route
│   └── Contact.jsx
└── components/                 # Reusable UI Blocks (Organized by feature context)
    ├── Navbar.jsx              # Global Header
    ├── Footer.jsx              # Global Footer
    ├── AboutPage/              # Specific components for About
    │   ├── AboutSection.jsx
    │   └── aboutData.js        # Decoupled mock data store
    ├── ServicesPage/
    │   ├── ServiceHero.jsx
    │   ├── ServiceList.jsx
    │   ├── ServiceAbout.jsx
    │   └── servicesData.js
    ├── CaseStudyPage/
    │   ├── CaseStudyHero.jsx
    │   ├── CaseStudySection.jsx
    │   └── caseStudyData.js
    ├── CareersPage/
    │   └── careersData.js
    ├── ContactPage/
    ├── GalleryPage/
    ├── BlogPage/
    └── [Shared Sections...]     # E.g., PartnersSection, TestimonialsSection
```

**Philosophy:** `pages/public` files act as lightweight containers that fetch data via routing and stitch together heavy UI blocks stored in `components/`.

---

## 2. Component Registry

The following table categorizes the major frontend components, outlining their exact purpose and how they consume data.

| Component Name | Category | Purpose | Props / Data Source |
| :--- | :--- | :--- | :--- |
| **`Navbar`** | Global UI | Global navigation with transparent-to-solid scroll behavior. | Internal static state (`navigationState`) |
| **`Footer`** | Global UI | Multi-column global footer with integrated CTA. | Internal `mockFooterData` |
| **`Home` / `About` / etc.** | Page Assemblers | Highest-level view layers representing full pages. | None (Imports child components) |
| **`ServiceDetails`** | Dynamic Page | A master template that renders a specific Service page based on the URL parameter. | Extracts `:serviceId` via `useParams()`. Imports `mockServicesPageData`. |
| **`CaseStudyDetails`**| Dynamic Page | A master template that renders specific case studies based on URL parameters. | Extracts `:projectId` via `useParams()`. Imports `mockCaseStudyPageData`. |
| **`ServiceHero`** | Section UI | Renders the hero banner for the master Services List page. | Reads `mockServicesPageData.hero` |
| **`ServiceList`** | Section UI | Renders the large grid of interactive service cards using glassmorphism. | Reads `mockServicesPageData.servicesList` |
| **`ServiceAbout`** | Section UI | Introductory text block using an asymmetrical grid. | Reads `mockServicesPageData.serviceIntro` |

*Note: All page sections strictly pull text, images, tags, and icons from their respective `*Data.js` files, guaranteeing 0% hardcoded JSX content.*

---

## 3. Routing Architecture

Routing is handled entirely client-side via `react-router-dom` inside `App.jsx`. The application utilizes two primary routing patterns:

### Static Routes
Standard mappings for high-level pages:
- `/` renders `<Home />`
- `/about` renders `<About />`
- `/services` renders `<Services />`
- `/contact` renders `<Contact />`

### Dynamic Routes
Template routes that parse the URL to determine which data to inject:
- `/services/:serviceId` renders `<ServiceDetails />`
- `/case-study/:projectId` renders `<CaseStudyDetails />`
- `/careers/:jobSlug` renders `<CareersDetails />`

**Route Resolution Flow (`ServiceDetails.jsx` example):**
1. User navigates to `/services/cyber-security`.
2. Router mounts `<ServiceDetails />`.
3. `useParams()` hook extracts `{ serviceId: 'cyber-security' }`.
4. Component searches `mockServicesPageData` for an object where `slug === 'cyber-security'`.
5. If found, the template populates with the matching data. If not found, a 404 "Service Not Found" view is returned.

---

## 4. State & Animation Management

The platform utilizes advanced, modern animation patterns to achieve a high-end "cybersecurity vibe" and relies on local React state for interaction metrics.

### Framer Motion (Animations)
`framer-motion` is applied globally to almost all view entrances.
- **`initial` / `whileInView`:** Used extensively on text blocks and hero sections to trigger slide-up/fade-in animations only when the user scrolls them into the viewport.
- **Variants:** Complex staggered animations (e.g., in `ServiceList.jsx` and `AboutSection.jsx`) use predefined `containerVariants` to stagger children elements by `0.15s` intervals.
- **Viewport Constraints:** `{ once: true, margin: "0px" }` is commonly used so animations do not endlessly replay if the user scrolls up and down rapidly.

### React State (`useState`)
Local React state is primarily used to handle complex hover interactions that CSS alone cannot easily support.
- **Expandable Cards:** In components like `ServiceList.jsx`, `const [activeCard, setActiveCard] = useState(null)` is used to track which glassmorphic card the user's mouse is currently over, triggering layout shifts (expanding height from `90px` to `260px`) and revealing hidden description text dynamically.

---

## 5. Workflow Analysis: Data-to-UI Flow

Because the architecture strictly decouples data from layout, updating the website requires modifying exactly zero JSX syntax.

**How to Update a Service (Example):**

1. **The Modification:** The administrator (or backend API soon) modifies `/frontend/src/components/ServicesPage/servicesData.js`. For example, they might add a new object to `items` with:
   - `id: 7`
   - `title: "AI Automation"`
   - `slug: "ai-automation"`
   - `icon: "ServerCog"`

2. **The List Update:** The `<ServiceList />` component maps over `mockServicesPageData.servicesList.items`. Upon save, the grid instantly updates to render a 7th card for "AI Automation".

3. **The Detail Template Generation:** Because `slug: "ai-automation"` exists, the route `/services/ai-automation` is now automatically valid. If a user clicks the new card, the `<ServiceDetails />` template catches the slug, filters the data for ID 7, and renders the deep-dive page with the hero text, breadcrumbs, and internal features without requiring an engineer to build a new page.

**Backend Readiness:**
Currently, this flow works via static `*.js` mock files. In the upcoming phase (Unified Backend), these static files will be replaced with `useEffect()` fetch calls to the `/backend` Node.js API, allowing the Admin Dashboard to push content directly into the DB and flow naturally into this established UI architecture.
