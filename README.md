# Booking System MVP Scaffold

Generic Next.js + Tailwind + Prisma + Postgres project you can extend for a booking / reservation business.

## Prereqs
- Node 18+
- Docker Desktop (for local Postgres)

## Setup

```bash
npm install

# copy env
cp .env.example .env

# start postgres
docker compose up -d

# migrate + generate client
npx prisma migrate dev --name init
npx prisma generate

# run app
npm run dev
```

Visit:
- Home: http://localhost:3000
- Bookings: http://localhost:3000/bookings
- Admin event templates: http://localhost:3000/admin/event-templates
- Admin bookings: http://localhost:3000/admin/bookings

## How to use (phase-1)
1. Go to `/admin/event-templates` and create an Event Template.
2. Add weekly availability rules to that Event Template.
3. Copy the Event Template ID into `/bookings`, pick a date, and book a slot.

## Extend next
- Add auth for admin routes.
- Replace prompt-based rule creation with real forms.
- Payments (Stripe), notifications (email/SMS), cancellations, etc.
- Multi-capacity and overlapping rules.


## AWS VM deploy (Terraform)
See `infra/README.md` for provisioning a minimal EC2 + Docker-based deployment.


## Prisma migrations

After updating `prisma/schema.prisma` to reflect new requirements:

```bash
# ensure Postgres is running
docker compose up -d

# create and apply a new migration
npx prisma migrate dev --name align-data-model

# regenerate the Prisma Client
npx prisma generate
```
