# Phase 7: Admin Dashboard

## Status

**Phase 7 administration is implemented and verified.** The API uses the temporary in-memory repository until the Phase 5 MySQL tables are connected. The React dashboard is available at `/admin` for authenticated admin users.

## File Locations

- Admin API routes: `backend/src/routes/admin.js`
- Admin route registration: `backend/src/app.js`
- Admin authorization middleware: `backend/src/middleware/auth.js`
- Temporary products and orders: `backend/src/data/mockData.js`
- Admin API client: `frontend/src/api.js`
- Admin dashboard component: `frontend/src/AdminPage.jsx`
- Admin browser route: `http://127.0.0.1:5173/admin`
- Phase 7 documentation: `docs/phase-7-admin-dashboard.md`

## Implemented Admin API

All routes require a valid JWT and the `admin` role.

| Method | Route | Function |
|---|---|---|
| `GET` | `/api/admin/products` | List products |
| `POST` | `/api/admin/products` | Create a product |
| `PUT` | `/api/admin/products/:productId` | Update product and stock |
| `DELETE` | `/api/admin/products/:productId` | Delete a product |
| `GET` | `/api/admin/categories` | List categories |
| `POST` | `/api/admin/categories` | Create a category |
| `PUT` | `/api/admin/categories/:categoryId` | Update a category |
| `DELETE` | `/api/admin/categories/:categoryId` | Delete a category when unused |
| `GET` | `/api/admin/orders` | List all orders |
| `PATCH` | `/api/admin/orders/:orderId/status` | Update fulfillment status |
| `GET` | `/api/admin/reports/sales` | Return order and revenue metrics |
| `GET` | `/api/admin/reports/top-products` | Return top-selling product quantities |

## Security Verification

- A customer JWT receives HTTP `403` from admin routes.
- The development admin account can create products and read reports.
- Product and category inputs are validated server-side.
- Order status values are limited to the defined workflow statuses.

Development admin credentials:

```text
Email: admin@example.com
Password: admin-password-change-me
```

Change this account before deployment.

## Frontend Dashboard

`frontend/src/AdminPage.jsx` provides:

- Sales summary metrics
- Product and inventory table
- Order table with status controls
- Product creation form

It uses the protected API helpers in `frontend/src/api.js`. The dashboard is connected to the `/admin` route, and the header shows that route only for admin users.

## Phase Boundary

- This phase uses in-memory product and order collections.
- Phase 5 MySQL integration must replace those collections before deployment.
- Reporting will become persistent and accurate after MySQL integration.
- Admin frontend route wiring is complete.

## Phase 7 Review Checklist

- [ ] Product CRUD reviewed
- [ ] Category CRUD reviewed
- [ ] Inventory changes reviewed
- [ ] Order status workflow reviewed
- [ ] Sales report reviewed
- [ ] Customer receives `403` for admin routes
- [x] Admin dashboard route wired into frontend router
- [ ] MySQL-backed admin operations approved
