# Reservation Booking System Requirements

This document describes the current functional and non‑functional requirements for the reservation booking system.  
It is intentionally implementation‑agnostic, but aligns with the current Next.js + Prisma scaffold in this repository.

---

## 1. Scope and Overview

The system provides online reservation booking for recurring events.  
Key concepts:

- **Admin** – manages users, events, and global settings.
- **Host** – organizes events and manages their own schedule.
- **Client** – books slots for available events.

The initial scope focuses on:

- recurring events with weekly patterns,
- time‑based slots with capacities,
- basic role‑based access and booking flows.

---

## 2. User Roles and Permissions

### 2.1 User Account

**R1. User accounts**

- **R1.1** The system shall store, for each user:
  - `username` (unique identifier),
  - `password` (stored as a secure hash, never plaintext),
  - `email` (unique, used for communication and recovery).
- **R1.2** The system shall support:
  - user registration (creating a new account),
  - login and logout,
  - password reset initiated via email (may be deferred to a later phase).
- **R1.3** The system should support optional email verification to confirm ownership of the email address.

### 2.2 Roles

There are three primary roles: **Admin**, **Host**, and **Client**. A user may hold multiple roles.

**R2. Roles and capabilities**

- **R2.1 Admin**
  - R2.1.1 Create, update, and delete any Event Template.
  - R2.1.2 Assign and revoke Host and Client roles for users.
  - R2.1.3 View all bookings and events across the system.
  - R2.1.4 Configure global booking rules (e.g., max booking horizon, cancellation windows).

- **R2.2 Host**
  - R2.2.1 Create, update, and delete Event Templates for which they are the designated host.
  - R2.2.2 Manage Event Occurrences associated with their templates (e.g., cancel a specific date).
  - R2.2.3 View bookings for events they host.
  - R2.2.4 Adjust capacity or close slots for their events, subject to system rules.

- **R2.3 Client**
  - R2.3.1 Browse/search available events and time slots.
  - R2.3.2 Create bookings on available slots.
  - R2.3.3 View their own bookings (upcoming and past).
  - R2.3.4 Cancel their own bookings, subject to cancellation policies.

---

## 3. Event and Scheduling Model

The system uses a three‑level scheduling model:

1. **Event Template (Event Series)** – defines a recurring pattern.
2. **Event Occurrence (Session)** – a concrete date/time instance of an event.
3. **Slot** – a bookable time interval within an occurrence.

### 3.1 Event Template

**R3. Event Template (Event Series)**

Each Event Template describes the rules for generating occurrences and slots.

- **R3.1** Each Event Template shall include:
  - `id` – unique identifier.
  - `name` – event title (e.g., "Yoga Class").
  - `description` – optional textual description.
  - `host_id` – reference to a Host user (or primary host).
  - `location` – optional string (physical address or online link).
  - `timezone` – the timezone in which the event takes place (e.g., "America/Toronto").
  - `status` – one of: `draft`, `published`, `archived`.

- **R3.2** Each Event Template shall include scheduling properties:
  - `start_date` – date from which the event series may start.
  - `end_date` – date until which the series runs (may be `null` for open‑ended).
  - `days_of_week` – list of weekdays on which the event occurs (e.g., `[Mon, Wed]`).
  - `recurrence_interval_weeks` – integer, where:
    - `1` = every week,
    - `2` = every 2 weeks,
    - `n` = every n weeks.
  - `event_start_time` – time of day when the first slot may begin (e.g., 09:00).
  - `event_end_time` – time of day after which no slots begin (e.g., 17:00).
  - `slot_duration_minutes` – length of each slot (e.g., 30 minutes).
  - `slot_gap_minutes` – gap between slots (may be 0).
  - `max_clients_per_slot` – capacity per slot.

- **R3.3** Exception handling:
  - R3.3.1 The system shall allow specific dates to be flagged as:
    - `cancelled` – no occurrences or slots may be booked for that date.
    - `modified` – the template’s default times/capacity are overridden (may be deferred to later phase).
  - R3.3.2 The system shall ensure that exceptions override the default recurrence pattern for the given date.

### 3.2 Event Occurrence (Session)

**R4. Event Occurrence**

An Event Occurrence represents one concrete instance of an Event Template on a specific date.

- **R4.1** Each Event Occurrence shall include:
  - `id` – unique identifier.
  - `event_template_id` – reference to the Event Template.
  - `date` – calendar date (in the event’s timezone).
  - `start_datetime` – start timestamp.
  - `end_datetime` – end timestamp.
  - `status` – one of: `scheduled`, `cancelled`, `completed`.
  - `effective_host_id` – reference to the Host for this occurrence (can differ from template host if reassigned).

- **R4.2** Occurrence generation:
  - R4.2.1 The system shall generate or represent occurrences based on the Event Template’s:
    - `start_date` / `end_date`,
    - `days_of_week`,
    - `recurrence_interval_weeks`,
    - exceptions (cancelled/modified days).
  - R4.2.2 The system may generate occurrences on‑the‑fly (for a date range) or persist them ahead of time; the functional behavior must be equivalent.

### 3.3 Slots

**R5. Slots within an Occurrence**

Slots are the bookable sub‑intervals of an Event Occurrence.

- **R5.1** For each Event Occurrence, the system shall define slots as:
  - starting at `event_start_time`, ending by `event_end_time`,
  - each slot having duration `slot_duration_minutes`,
  - with a gap of `slot_gap_minutes` between consecutive slots.

- **R5.2** Each Slot shall include:
  - `id` – unique identifier.
  - `event_occurrence_id` – reference to the occurrence.
  - `start_datetime` – start timestamp.
  - `end_datetime` – end timestamp.
  - `capacity` – maximum number of clients allowed (default = `max_clients_per_slot` from the template).
  - `status` – one of: `available`, `full`, `closed`, `cancelled`.

- **R5.3** Slot availability:
  - R5.3.1 The system shall ensure that `available_capacity` (derived or stored) cannot exceed `capacity`.
  - R5.3.2 Once `available_capacity` reaches zero, the slot status should be treated as `full`.

---

## 4. Booking Requirements

### 4.1 Booking Entity

**R6. Bookings (Reservations)**

- **R6.1** Each booking shall include:
  - `id` – unique identifier.
  - `slot_id` – reference to the Slot.
  - `client_id` – reference to the Client user.
  - `status` – one of: `pending`, `confirmed`, `cancelled`, `no_show`.
  - `created_at` – timestamp when the booking was created.
  - `updated_at` – timestamp when the booking was last updated.
  - optional `notes` – free‑text notes by the client or host.

- **R6.2** Capacity enforcement:
  - R6.2.1 The system shall enforce that the number of **active** bookings (e.g., `pending` or `confirmed`) for a given slot does not exceed the slot’s `capacity`.
  - R6.2.2 Concurrent booking attempts shall be resolved atomically to prevent double‑booking (e.g., via DB constraints or transactional updates).
  - R6.2.3 If a slot is full, an attempt to book it shall fail with a user‑friendly error.

### 4.2 Booking Rules

**R7. Booking policies**

- **R7.1** Future booking window:
  - The system shall support configuration of how far in advance clients can book (e.g., up to N days or months).

- **R7.2** Cancellation rules:
  - The system shall support configuration of how close to the slot start time a client may cancel (e.g., at least 24 hours before).
  - Cancellations inside the restricted window may be blocked or require Host/Admin intervention.

- **R7.3** Optional waitlist (future enhancement):
  - When a slot is full, the system may allow clients to join a waitlist.
  - If a confirmed booking is cancelled, the system may automatically promote a waitlisted client or notify the Host.

---

## 5. Role‑Specific Flows

### 5.1 Admin Flows

**R8. Admin operations**

- **R8.1** Admins can:
  - R8.1.1 Manage users and their roles.
  - R8.1.2 Create, update, and archive Event Templates.
  - R8.1.3 View all Event Occurrences and Slots.
  - R8.1.4 View all bookings, and filter by event, host, client, or date range.
  - R8.1.5 Configure global booking and cancellation policies.

- **R8.2** Admin overrides:
  - R8.2.1 Admins may manually add or cancel bookings in any slot.
  - R8.2.2 Admins may cancel an entire Event Occurrence or Event Template (future occurrences) with appropriate notifications.

### 5.2 Host Flows

**R9. Host operations**

- **R9.1** Hosts can:
  - R9.1.1 Create and manage Event Templates where they are the host.
  - R9.1.2 Cancel or adjust specific Event Occurrences (e.g., change capacity or close bookings).
  - R9.1.3 Close individual Slots to stop new bookings while preserving existing ones.
  - R9.1.4 View all bookings for their events, including client contact details (e.g., name, email).

- **R9.2** Host‑initiated communication (future enhancement):
  - Hosts may send notifications to clients booked into a specific occurrence or slot (e.g., time changes, cancellations).

### 5.3 Client Flows

**R10. Client operations**

- **R10.1** Browsing & searching:
  - Clients shall be able to view a list of available events, with filters such as:
    - host,
    - date range,
    - event name or category (if categories are added).

- **R10.2** Booking:
  - Clients shall be able to:
    - select an event,
    - choose a date (occurrence),
    - pick a slot,
    - confirm a booking.

- **R10.3** Managing bookings:
  - Clients shall be able to:
    - view upcoming bookings,
    - view booking details (event, date, time, host),
    - cancel bookings (subject to cancellation policy).

---

## 6. Security, Authentication, and Audit

**R11. Security and access control**

- **R11.1** Authentication:
  - All operations that modify events, occurrences, slots, or bookings shall require an authenticated user.
- **R11.2** Authorization:
  - Role‑based access control shall be enforced to ensure only:
    - Admins can manage system‑wide settings and users.
    - Hosts can manage events they host.
    - Clients can manage only their own bookings.

- **R11.3** Data protection:
  - Passwords must be hashed using a modern, secure algorithm (e.g., bcrypt, Argon2).
  - Sensitive configuration values (DB credentials, keys) shall not be stored in source control.

**R12. Audit & logging**

- **R12.1** The system shall record at least:
  - who created/updated Event Templates and when,
  - who cancelled an Event Occurrence and when,
  - who created/updated/cancelled each booking and when.

- **R12.2** Audit data should be queryable by Admins for troubleshooting and reporting.

---

## 7. UX and Quality Requirements

**R13. UX behaviors**

- **R13.1** Timezones:
  - All times shown to users shall clearly indicate the timezone.
  - For remote clients in a different timezone, the UI should clearly show whether the time is in the event’s timezone or the client’s local timezone.

- **R13.2** Feedback:
  - After a successful booking, the client shall see a confirmation state with key details (event name, date, time, host).
  - Errors (e.g., slot full, booking window closed) shall be displayed with human‑readable messages.

- **R13.3** Performance:
  - Loading available slots for a given event and date should complete within an acceptable time for typical usage (e.g., under a second for normal loads).

---

This document is a working specification and is expected to evolve as more domain knowledge is gathered and additional use cases are identified.
