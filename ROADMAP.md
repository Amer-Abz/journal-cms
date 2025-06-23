# CMS Development Roadmap

This document outlines the planned stages and features for the Next.js, Prisma, and PostgreSQL based CMS.

## Phase 1: Core CMS Setup (In Progress)

1.  **Project Initialization & Setup:**
    *   [x] Create `ROADMAP.md` to track project phases. (Recreated)
    *   [x] Create `LOG.md` for detailed progress tracking. (To be recreated)
    *   [x] Initialize Next.js project (latest version, with TypeScript, ESLint, TailwindCSS, src/ dir, App Router).
    *   [ ] Set up Internationalization (i18n) - English (default) & Arabic.
    *   [ ] Install and configure Prisma.
    *   [ ] Set up PostgreSQL database connection.
2.  **Basic Content Management (Posts):**
    *   [ ] Define `Post` schema (title, content, slug, published status, author, language).
    *   [ ] Implement CRUD API endpoints for Posts.
    *   [ ] Create basic UI for listing, creating, editing, and deleting Posts (supporting EN/AR).
3.  **User Authentication:**
    *   [ ] Define `User` schema (email, password, name, role).
    *   [ ] Implement user registration and login functionality.
    *   [ ] Protect CMS routes/actions based on authentication.

## Phase 2: Enhancements & Features

1.  **Categories & Tags:**
    *   [ ] Define `Category` and `Tag` schemas (with i18n for names).
    *   [ ] Associate Posts with Categories and Tags.
    *   [ ] Implement UI for managing Categories and Tags.
    *   [ ] Filter posts by Category/Tag.
2.  **Media Library:**
    *   [ ] Basic image upload functionality.
    *   [ ] Associate images with Posts.
    *   [ ] Simple media browsing interface.
3.  **User Roles & Permissions:**
    *   [ ] Differentiate between Admin, Editor, Author roles.
    *   [ ] Implement basic role-based access control (RBAC).
4.  **Settings Management:**
    *   [ ] Basic site settings (e.g., site title, description - with i18n).
    *   [ ] UI for managing settings.

## Phase 3: Advanced Features & Polish

1.  **Custom Post Types:**
    *   [ ] Allow creation and management of custom content types beyond "Posts" (with i18n).
2.  **Advanced Editor:**
    *   [ ] Integrate a rich text editor (e.g., TipTap, Editor.js) with i18n support (RTL for Arabic).
3.  **SEO Features:**
    *   [ ] Meta tags management for posts/pages (i18n).
    *   [ ] Sitemap generation (multi-lingual).
4.  **Themeing/Customization:**
    *   [ ] Basic theming capabilities or customization options.
5.  **API for Frontend Consumption:**
    *   [ ] Public API endpoints for fetching content to be displayed on a separate frontend (supporting language parameter).

## Phase 4: Deployment & Maintenance

1.  **Deployment:**
    *   [ ] Prepare for deployment (e.g., Vercel, Docker).
    *   [ ] Set up production database.
2.  **Testing:**
    *   [ ] Implement unit and integration tests, including i18n aspects.
3.  **Documentation:**
    *   [ ] User and developer documentation.

This roadmap is a living document and may be updated as the project progresses.
