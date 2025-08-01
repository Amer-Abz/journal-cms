# CMS Development Roadmap

This document outlines the planned stages and features for the Next.js, Prisma, and PostgreSQL based CMS.

## Phase 1: Core CMS Setup (In Progress)

1.  **Project Initialization & Setup:**
    *   [x] Create `ROADMAP.md` to track project phases. (Recreated)
    *   [x] Create `LOG.md` for detailed progress tracking. (To be recreated)
    *   [x] Initialize Next.js project (latest version, with TypeScript, ESLint, TailwindCSS, src/ dir, App Router).
    *   [x] Set up Internationalization (i18n) - English (default) & Arabic.
    *   [x] Install and configure Prisma.
    *   [x] Set up PostgreSQL database connection.
2.  **Basic Content Management (Posts):**
    *   [x] Define `Post` schema (title, content, slug, published status, author, language).
    *   [x] Implement CRUD API endpoints for Posts.
    *   [x] Create basic UI for listing, creating, editing, and deleting Posts (supporting EN/AR).
3.  **User Authentication:**
    *   [x] Define `User` schema (email, password, name, role).
    *   [x] Implement user registration and login functionality.
    *   [x] Protect CMS routes/actions based on authentication.

## Phase 2: Enhancements & Features

1.  **Categories & Tags:**
    *   [x] Define `Category` and `Tag` schemas (with i18n for names).
    *   [x] Associate Posts with Categories and Tags.
    *   [x] Implement UI for managing Categories and Tags.
    *   [x] Filter posts by Category/Tag.
2.  **Media Library:**
    *   [x] Basic image upload functionality.
    *   [x] Associate images with Posts.
    *   [x] Simple media browsing interface.
3.  **User Roles & Permissions:**
    *   [x] Differentiate between Admin, Editor, Author roles.
    *   [x] Implement basic role-based access control (RBAC).
4.  **Settings Management:**
    *   [x] Basic site settings (e.g., site title, description - with i18n).
    *   [x] UI for managing settings.

## Phase 3: Advanced Features & Polish

1.  **Custom Post Types:**
    *   [x] Allow creation and management of custom content types beyond "Posts" (with i18n).
2.  **Advanced Editor:**
    *   [x] Integrate a rich text editor (e.g., TipTap, Editor.js) with i18n support (RTL for Arabic).
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
