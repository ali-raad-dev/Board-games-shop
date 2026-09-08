# Phase 5: Database

## Status

**Phase 5 is prepared for review.** The MySQL schema and seed scripts are complete. They are separate from the Phase 4 in-memory API until the database review and connection details are approved.

## File Locations

- Schema: `database/schema.sql`
- Seed data: `database/seed.sql`
- MySQL connection pool: `backend/src/config/database.js`
- Database environment template: `backend/.env.example`
- Phase 4 API: `backend/src/`
- Phase 5 documentation: `docs/phase-5-database.md`

## Database Contents

The seed script creates:

- 6 product categories
- 32 products
- 3 users: 1 admin and 2 customers
- 2 saved customer addresses
- 32 product image records
- 2 customer carts with cart items
- 3 sample orders
- 6 order items
- 3 historical order shipping addresses
- 3 Stripe test-mode payment records

The sample passwords are bcrypt hashes. The development seed credentials are:

```text
Admin: admin@example.com / admin-password-change-me
Customer: customer@example.com / password123
Customer: amina@example.com / password123
```

These are development-only credentials and must be changed before deployment.

## Normalized Tables

The schema contains the following tables:

- `users`
- `addresses`
- `categories`
- `products`
- `product_images`
- `carts`
- `cart_items`
- `orders`
- `order_items`
- `order_addresses`
- `payments`

Foreign keys enforce relationships between records. Order item prices and order addresses are snapshots so historical orders remain correct after product prices or customer addresses change.

## Setup With MySQL

Install and start MySQL locally, then from the project root run:

```powershell
mysql -u root -p < database/schema.sql
mysql -u root -p board_games_shop < database/seed.sql
```

On systems where the `mysql` command is not available, open the two SQL files in MySQL Workbench and execute them in order:

1. `database/schema.sql`
2. `database/seed.sql`

The SQL import could not be executed in this workspace because the MySQL command-line client is not installed. The scripts are ready for local MySQL or MySQL Workbench execution.

## Configure the Backend Connection

From the project root:

```powershell
cd backend
Copy-Item .env.example .env
```

Update `backend/.env` with the local MySQL password. The connection module reads these variables:

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

The connection pool is available from `backend/src/config/database.js`. The Phase 4 routes still use mock data deliberately; switching those routes to this pool is the next integration step after review.

## Verification Queries

After importing the schema and seed data:

```sql
USE board_games_shop;
SELECT COUNT(*) AS product_count FROM products;
SELECT COUNT(*) AS category_count FROM categories;
SELECT COUNT(*) AS user_count FROM users;
SELECT COUNT(*) AS order_count FROM orders;
SELECT status, COUNT(*) AS total FROM orders GROUP BY status;
```

Expected minimum results:

```text
product_count: 32
category_count: 6
user_count: 3
order_count: 3
```

## Phase 5 Review Checklist

- [ ] Schema reviewed
- [ ] Foreign keys and relationships reviewed
- [ ] 32-product seed reviewed
- [ ] Sample users and roles reviewed
- [ ] Sample orders and payment records reviewed
- [ ] MySQL import completed locally
- [ ] Verification queries return expected counts
- [ ] Approval given to connect Phase 4 routes to MySQL
