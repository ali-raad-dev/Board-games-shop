# Phase 6: Payment and Order Workflow

## Status

**Phase 6 is implemented as a Stripe test-mode integration point and is ready for review.** The API requires Stripe test credentials before it will create a payment. No live payment credentials are used or stored in the repository.

## File Locations

- Stripe client: `backend/src/services/stripe.js`
- Payment and order routes: `backend/src/routes/orders.js`
- Route registration and webhook body handling: `backend/src/app.js`
- Frontend API client: `frontend/src/api.js`
- Frontend checkout and customer flows: `frontend/src/App.jsx`
- Frontend public environment template: `frontend/.env.example`
- Temporary order store: `backend/src/data/mockData.js`
- Stripe environment settings: `backend/.env.example`
- Phase 5 database payment table: `database/schema.sql`
- Phase 6 documentation: `docs/phase-6-payment-order-workflow.md`

## Workflow

1. The authenticated customer adds products to their cart.
2. `POST /api/checkout/payment-intent` recalculates the cart total on the server.
3. The backend creates a Stripe PaymentIntent in test mode and returns its client secret.
4. The future React checkout will use the client secret with Stripe Elements.
5. After Stripe confirms the payment, the client sends `POST /api/orders`.
6. The backend retrieves the PaymentIntent from Stripe and verifies the user, successful status, cart stock, and total.
7. The backend creates an order snapshot, clears the cart, and returns the confirmation.
8. Stripe sends webhook events to `POST /api/payments/webhook`.
9. The customer can list orders and request an HTML receipt.

The backend never trusts a total supplied by the browser and never stores card details.

## Routes

| Method | Route | Access | Purpose |
|---|---|---|---|
| `POST` | `/api/checkout/payment-intent` | Customer | Create a Stripe test PaymentIntent from the server cart |
| `POST` | `/api/orders` | Customer | Confirm payment and create the order snapshot |
| `GET` | `/api/orders` | Customer | List the customer's orders |
| `GET` | `/api/orders/:orderId/receipt` | Customer | Return the customer's HTML receipt |
| `POST` | `/api/payments/webhook` | Stripe | Process payment success/failure events |

## Configure Stripe Test Mode

From the project root:

```powershell
cd backend
Copy-Item .env.example .env
```

Set these values in `backend/.env` using Stripe test-mode credentials:

```text
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Never commit `backend/.env` or expose `STRIPE_SECRET_KEY` in the React frontend.

The webhook endpoint for local development is:

```text
http://127.0.0.1:4000/api/payments/webhook
```

A Stripe CLI or Stripe Dashboard webhook can forward test events to that URL. The webhook route must receive the raw request body so Stripe signature verification works.

## Development Behavior Without Credentials

If `STRIPE_SECRET_KEY` is missing, payment-intent creation returns HTTP `503` with error code `PAYMENTS_NOT_CONFIGURED`. This is intentional: the application must not simulate a successful payment while claiming Stripe integration is active.

## Receipt Behavior

The current receipt is an HTML confirmation generated from the order snapshot. It includes:

- Store name
- Order number
- Order status
- Total amount
- Stripe PaymentIntent reference

PDF invoice formatting and MySQL order persistence can be refined after the workflow is reviewed.

## Frontend Connection

The React frontend now connects to the backend for:

- Catalog loading with a fallback to local mock data
- Registration and login
- Persistent local cart state
- Backend cart synchronization before checkout
- Stripe Payment Element checkout
- Order confirmation and order history

To show Stripe's browser payment form, create `frontend/.env` from `frontend/.env.example` and add the publishable `pk_test_...` key. The secret `sk_test_...` key remains in `backend/.env` only.

## Phase Boundary

- Stripe test mode is implemented; live payments are out of scope.
- Order records are temporarily held in memory by the Phase 4 repository. Connecting order creation and payment records to MySQL is the next integration refinement.
- React checkout UI is currently a frontend placeholder and will be connected to these routes after the API contract is approved.

## Phase 6 Review Checklist

- [ ] Stripe test credentials configured locally
- [ ] PaymentIntent amount matches server cart total
- [ ] Successful PaymentIntent creates an order
- [ ] Failed or incomplete PaymentIntent cannot create an order
- [ ] Stock is checked again before order creation
- [ ] Webhook signature verification reviewed
- [ ] Receipt output reviewed
- [ ] MySQL order/payment persistence approved
