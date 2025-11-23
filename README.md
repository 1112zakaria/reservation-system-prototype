# Reservations MVP Scaffold

Generic Next.js + Tailwind + Prisma + Postgres project you can extend for a booking/reservation business.

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
- Bookings: http://localhost:3000/reservations
- Admin resources: http://localhost:3000/admin/resources
- Admin reservations: http://localhost:3000/admin/reservations

## How to use (phase-1)
1. Go to `/admin/resources` and create a Resource.
2. Add weekly availability rules to that Resource.
3. Copy the Resource ID into `/reservations`, pick a date, and book a slot.

## Extend next
- Add auth for admin routes.
- Replace prompt-based rule creation with real forms.
- Payments (Stripe), notifications (email/SMS), cancellations, etc.
- Multi-capacity and overlapping rules.


## AWS VM deploy (Terraform)
See `infra/README.md` for provisioning a minimal EC2 + Docker-based deployment.
