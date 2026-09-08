# Phase 4: Back-End Application

## Status

**Phase 4 is in progress.** This first backend slice is runnable and uses in-memory mock data. MySQL persistence, seed data, and production authentication configuration belong to later phases.

## File Locations

- Backend root: `backend/`
- Server entry point: `backend/src/server.js`
- Express app configuration: `backend/src/app.js`
- Mock repository: `backend/src/data/mockData.js`
- Authentication middleware: `backend/src/middleware/auth.js`
- Authentication routes: `backend/src/routes/auth.js`
- Catalog routes: `backend/src/routes/products.js`
- Cart routes: `backend/src/routes/cart.js`
- Environment template: `backend/.env.example`
- Frontend application: `frontend/`
- Phase 1 documentation: `docs/phase-1-requirements.md`
- Phase 2 documentation: `docs/phase-2-system-design.md`

## Implemented API Features

- `GET /api/health`: confirms the API is running and identifies Phase 4.
- `POST /api/auth/register`: validates and creates a customer with a bcrypt password hash.
- `POST /api/auth/login`: verifies credentials and returns a JWT.
- `GET /api/auth/me`: returns the authenticated user's public profile.
- `GET /api/categories`: returns available categories.
- `GET /api/products`: returns products with optional `search` and `category` filters.
- `GET /api/products/:productId`: returns one product.
- `GET /api/cart`: returns the authenticated customer's cart.
- `POST /api/cart/items`: adds a product to the authenticated customer's cart.
- `PUT /api/cart/items/:itemId`: changes an authenticated cart item's quantity.
- `GET /api/admin/status`: admin-only verification route used to test role authorization.

Protected cart routes require:

```text
Authorization: Bearer <JWT>
```

The development mock repository includes an admin account to verify authorization:

```text
Email: admin@example.com
Password: admin-password-change-me
```

This credential exists only for local development and must be replaced with a secure seeded account before deployment.

## Run Locally

From the project root:

```powershell
cd backend
Copy-Item .env.example .env
```

Set a private development value for `JWT_SECRET` in `backend/.env`, then run:

```powershell
npm install
npm start
```

The API runs at `http://127.0.0.1:4000` by default.

For automatic restart during development:

```powershell
npm run dev
```

## Example Requests

Health check:

```powershell
Invoke-RestMethod http://127.0.0.1:4000/api/health
```

Search products:

```powershell
Invoke-RestMethod 'http://127.0.0.1:4000/api/products?search=wing'
```

Register a customer:

```powershell
$body = @{ name = 'Demo Customer'; email = 'demo@example.com'; password = 'password123' } | ConvertTo-Json
Invoke-RestMethod http://127.0.0.1:4000/api/auth/register -Method Post -ContentType 'application/json' -Body $body
```

## Deliberate Phase Boundaries

- MySQL access is not implemented in this phase. The in-memory collections are temporary and will be replaced in Phase 5.
- Stripe is not implemented in this phase. Payment workflow belongs to Phase 6.
- Admin CRUD and reporting belong to Phase 7.
- The React frontend is not yet connected to these routes; API integration is the next frontend/backend connection step.
- JWT is implemented for development, but deployment secrets and production token policy require security review.
- Customer tokens are denied admin routes with HTTP `403`; admin tokens can access admin-only routes.

## Phase 4 Review Checklist

- [ ] API health route reviewed
- [ ] Catalog routes reviewed
- [ ] Registration and login flow reviewed
- [ ] JWT protection reviewed
- [ ] Cart routes reviewed
- [ ] MySQL replacement plan approved for Phase 5
- [ ] Frontend API integration scope approved
