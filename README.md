# Beecause by The Hive

TanStack Start app with Supabase for content, forms, and auth.

## Setup

1. Copy `.env.example` to `.env` (already pointed at project `czjgazqnjmvcqoilgakr`).
2. Confirm `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` match [API settings](https://supabase.com/dashboard/project/czjgazqnjmvcqoilgakr/settings/api).
3. Install and run:

```bash
bun install
bun run dev
```

Admin routes require a signed-in user with an `admin` row in `public.user_roles`. After creating an account at `/auth`, add that user's UUID in the SQL editor:

```sql
insert into public.user_roles (user_id, role)
values ('YOUR_USER_UUID', 'admin');
```
