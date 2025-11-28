# Prisma Migrations and Schema Changes

This document explains what to do **after changing `prisma/schema.prisma`** and how Prisma migrations fit into the development workflow.

It assumes you are running the local Postgres database via Docker (see `docker-compose.yml`).

---

## 1. Concepts

### 1.1 Prisma schema

- `prisma/schema.prisma` describes the **desired** database schema (models, fields, relations, enums).
- You edit this file whenever you:
  - add/remove a model,
  - rename fields,
  - add relations,
  - change enum values, etc.

### 1.2 Migrations

- A **migration** is a versioned set of SQL changes that takes the database from state **N** to state **N+1**.
- Prisma stores migrations under `prisma/migrations/` and also tracks which ones have been applied in the database itself (table `_prisma_migrations`).

In practice:

1. You change `schema.prisma`.
2. You run `prisma migrate`.
3. Prisma:
   - diffs the DB vs. the schema,
   - generates a new migration folder with SQL,
   - applies the SQL to the DB,
   - regenerates the Prisma Client types.

---

## 2. Typical dev workflow after a schema change

From the project root:

```bash
# 1. Ensure Postgres is running
docker compose up -d

# 2. Create + apply a migration
npx prisma migrate dev --name <meaningful-name>

# example:
npx prisma migrate dev --name align-data-model

# 3. (Optional, but safe to run)
npx prisma generate
```

Notes:

- `migrate dev` will:
  - Prompt you before creating a new migration.
  - Apply it to your local dev database.
  - Run `prisma generate` automatically.
- Use a descriptive migration name (e.g. `add-user-role`, `rename-reservation-to-booking`).

Once this is done, your database schema and Prisma Client are both in sync with `schema.prisma`.

---

## 3. Resetting the dev database

Sometimes the schema / data get messy in development and you want to start fresh.

```bash
npx prisma migrate reset
```

This will:

1. Drop the dev database.
2. Recreate it.
3. Re-apply **all** migrations in order.
4. Optionally run `prisma db seed` (if configured).

Use this only in development (not in production), because it destroys all existing data.

---

## 4. Applying migrations in other environments

### 4.1 Staging / production

In a non-dev environment, you generally use:

```bash
npx prisma migrate deploy
```

- `migrate deploy`:
  - Looks at the migrations in `prisma/migrations/`.
  - Applies any that have not yet been run.
  - **Does not** try to generate new migrations; it only uses what was already created in development.

Typical flow:

1. Make schema changes and run `npx prisma migrate dev` locally.
2. Commit the updated `schema.prisma` and `prisma/migrations/` directory.
3. Deploy to staging/production.
4. As part of the deploy step, run `npx prisma migrate deploy` against the remote database.

---

## 5. Safety tips

- Treat migrations as source code:
  - Commit `prisma/migrations/` to the repo.
  - Review generated SQL (especially drops/renames) before running in production.
- For **breaking changes** (dropping columns, renaming fields):
  - Prefer two-step migrations where possible (add new column, backfill, then drop old).
- Always run the test suite / basic smoke tests after a migration:
  - `npm run dev` should start cleanly.
  - Admin views (event templates, rules, bookings) should load without errors.

---

## 6. Quick checklist after editing `schema.prisma`

1. **Did you run `docker compose up -d`?**  
   Make sure Postgres is running.

2. **Did you create a new migration?**

   ```bash
   npx prisma migrate dev --name <change-name>
   ```

3. **Did you regenerate Prisma Client?**  
   (`migrate dev` does this automatically, but you can also run `npx prisma generate`.)

4. **Does the app boot and basic flows still work?**

   ```bash
   npm run dev
   # visit:
   # - http://localhost:3000/bookings
   # - http://localhost:3000/admin/event-templates
   # - http://localhost:3000/admin/bookings
   ```

If all of the above pass, your schema change and migration are applied correctly.
