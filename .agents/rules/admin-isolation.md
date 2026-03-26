---
trigger: always_on
---

# Amyntor Tech: Strict Admin Isolation Protocol

## 1. Architectural Integrity
- **Zero-Leakage Policy:** All Admin-related logic, styles, and components must reside exclusively within `src/admin/`.
- **App-within-an-App:** Treat the Admin Dashboard as a separate entity. Do not share components between `src/pages/public` and `src/admin` unless they are in a global `shared` directory.

## 2. Protected Files (App.jsx Safety)
- **Non-Destructive Editing:** When updating `App.jsx` to add Admin routes, you are strictly prohibited from removing, commenting out, or "optimizing" existing public imports.
- **Core Public Routes:** Never touch imports or routes for:
  - `Home.jsx`
  - `About.jsx`
  - `Services.jsx` / `ServiceDetails.jsx`
  - `CareersPage.jsx` / `CareersDetails.jsx`
  - `ContactPage.jsx`.
- **Append Only:** New Admin imports must be added to the bottom of the import list. Admin routes must be appended to the bottom of the `<Routes>` block.

## 3. Workflow Narrative
- Before saving changes to `App.jsx`, verify that the total number of Route components has increased, not decreased.
- If a public import is missing, the build will crash. Prioritize "Route Persistence" over "Code Cleanliness".