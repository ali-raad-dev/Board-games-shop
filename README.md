# Board Game E-Commerce Website

A full-stack e-commerce website for selling board games as a fourth-year Computer Engineering project.

## Technology Stack

- Frontend: React
- Backend: Node.js + Express
- Database: MySQL
- Authentication: JWT + bcrypt
- Payment: Stripe test mode
- Deployment: Vercel, Render, and a MySQL cloud provider
- Version control: Git and GitHub

## Project Status

The project is currently in Phase 5: Database.

## Documentation

- [Phase 1: Requirements and Planning](docs/phase-1-requirements.md)
- [Phase 2: System Design Package](docs/phase-2-system-design.md)
- [Phase 4: Back-End Application](docs/phase-4-backend.md)
- [Phase 5: Database](docs/phase-5-database.md)

## Phase File Map

- Phase 1 requirements and planning: `docs/phase-1-requirements.md`
- Phase 2 system design: `docs/phase-2-system-design.md`
- Phase 3 frontend application: `frontend/`
- Phase 4 backend application: `backend/`
- Phase 5 database: `database/` and `backend/src/config/database.js`
- Phase 6 payment and order workflow: not started
- Phase 7 admin dashboard: not started
- Phase 8 testing: not started
- Phase 9 deployment: not started
- Phase 10 final package: not started

## Updates

- 2026-09-05: Created the initial project documentation and Phase 1 planning document.
- 2026-09-05: Added the Phase 2 architecture, normalized database design, REST API specification, and UI wireframes.
- 2026-09-05: Created the React/Vite frontend foundation with responsive storefront UI, mock catalog data, category filters, and a local cart interaction.
- 2026-09-05: Expanded the frontend with separate Home, Shop, product detail, cart, account, and checkout views; added local search, category filtering, sorting, product navigation, quantity controls, and frontend-ready placeholders.
- 2026-09-08: Started Phase 4 with a runnable Express REST API, JWT/bcrypt authentication, public catalog routes, protected cart routes, and a documented backend file map using temporary in-memory data.
- 2026-09-08: Completed the Phase 4 role-authorization slice with customer/admin JWT roles, `/api/auth/me`, and an admin-only verification route.
- 2026-09-08: Prepared Phase 5 with a normalized MySQL schema, 32 seeded products, categories, users, carts, sample orders, order snapshots, payments, and a MySQL connection pool.
- 2026-09-08: Added a standalone `/story` frontend page for Our Story with responsive feature content and navigation from the header.
