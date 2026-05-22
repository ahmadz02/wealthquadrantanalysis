# Wealth Quadrant Tracker — Modular Supabase Version

This version splits the previous single HTML file into modules:

- `index.html` — app shell and auth screens
- `css/styles.css` — original Wealth Quadrant styles plus auth/admin UI
- `js/config.js` — Supabase project URL, anon key, bucket name
- `js/supabase-client.js` — Supabase client setup
- `js/roles.js` — signup, login, approval workflow, Superadmin user switching
- `js/storage.js` — user-scoped monthly data saving/loading and Supabase Storage folder backup
- `js/app.js` — existing tracker, analytics, calculations, UI logic
- `sql/schema.sql` — tables, trigger, roles, approval status, RLS policies, Storage policies

## Setup

1. Create a Supabase project.
2. Enable Email/Password auth.
3. Create a private Storage bucket named `wealth-quadrant`.
4. Run `sql/schema.sql` in Supabase SQL Editor.
5. Update `js/config.js` with your Supabase URL and anon key.
6. Host this folder on Netlify/Vercel/static hosting, or open through a local server.

## Role flow

- Anyone can sign up as Superadmin or Premium User.
- First ever Superadmin is auto-approved so the system can be bootstrapped.
- All later accounts are `pending` until approved by an approved Superadmin.
- Superadmin can view all approved users from the dropdown and approve/reject pending users.
- Premium User can only read/write its own monthly data and storage folder.

## Storage design

Database table `wealth_month_data` is the source of truth. Supabase Storage also receives JSON copies under:

```text
<user_id>/pft_<year>_<month>.json
```

This gives every user a unique folder while RLS prevents Premium Users from accessing other users' folders.


## This generated version

`js/app.js` now mounts the Wealth Quadrant Online interface adapted from `wealth-quadrant_15.html`, while continuing to use the existing `config.js`, `supabase-client.js`, `roles.js`, `storage.js`, and `sql/schema.sql` modules. Data is saved per selected month/year via `WQStorage.saveMonthData()` and loaded through `WQStorage.getMonthData()`.
