# SUPABASE SETUP — cloud save + public read-only

This makes the tracker save to the cloud so you can edit from any device, while
the public sees your real progress but can't change it. ~15 minutes, one time.

You'll do three things: (1) create a Supabase project + table, (2) create your
login, (3) put two secret values into GitHub. Then push.

---

## 1. Create the Supabase project

1. Go to **supabase.com** → sign up (free, can use GitHub login).
2. **New project**. Name it `uhhdirt-grow`. Pick any region near you.
   Set a database password (save it somewhere; you won't need it day-to-day).
3. Wait ~2 min for it to provision.

## 2. Create the table + security rules

1. In your project, left sidebar → **SQL Editor** → **New query**.
2. Paste ALL of this and click **Run**:

```sql
-- one row holds the whole grow state as JSON
create table grow_state (
  id text primary key,
  state jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- turn on row level security
alter table grow_state enable row level security;

-- ANYONE can read (public view)
create policy "public read"
  on grow_state for select
  using (true);

-- ONLY logged-in users can insert/update (you)
create policy "auth write insert"
  on grow_state for insert
  to authenticated
  with check (true);

create policy "auth write update"
  on grow_state for update
  to authenticated
  using (true);

-- seed the starting row
insert into grow_state (id, state) values ('pomelo-punch-v1', '{}');
```

This is what enforces "public reads, only you write" — at the database level,
not just hidden buttons. A technical visitor still can't write.

## 3. Create YOUR login

1. Left sidebar → **Authentication** → **Users** → **Add user** → **Create new user**.
2. Enter your email + a password you'll remember. (This is what you'll type
   once per device to edit.)
3. **Important:** check **"Auto Confirm User"** so you can log in immediately
   without an email confirmation step.

## 4. Get your two connection values

1. Left sidebar → **Project Settings** (gear) → **API**.
2. Copy two things:
   - **Project URL** (looks like `https://abcxyz.supabase.co`)
   - **anon public** key (a long string — the one labeled "anon" / "public",
     NOT the "service_role" secret one)

These are safe to expose — the anon key can only do what the policies above allow.

## 5. Put them in GitHub as secrets

1. Your **`uhhdirt-grow`** repo on github.com → **Settings** → **Secrets and
   variables** → **Actions** → **New repository secret**.
2. Add two secrets (name them EXACTLY):
   - Name: `VITE_SUPABASE_URL`  → Value: your Project URL
   - Name: `VITE_SUPABASE_ANON_KEY`  → Value: your anon public key

## 6. Push the new code + deploy

1. Copy this whole `grow-app` folder's contents into your local grow repo
   (replace the old files; keep `.github/workflows/deploy.yml`).
2. Commit + push.
3. The build runs, injecting your secrets. Wait for green in the Actions tab.
4. Hard-refresh **grow.uhhdirt.com** (Ctrl+Shift+R).

---

## USING IT

- **Public visitors:** see your real checked state, read-only. Boxes don't click.
  A line up top says "Viewing Paul's grow log — read only."
- **You:** click **"sign in"** (top-right), enter your email + password once.
  Now boxes are clickable and every change saves to the cloud instantly
  ("saving…" flashes). You stay signed in on that device.
- **Any device:** sign in once there, then it's frictionless.
- **Sign out:** the top-right shows "editing · sign out" when you're in edit mode.

## TROUBLESHOOTING
- Blank page after deploy → check both GitHub secrets are named exactly
  `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Can't sign in → confirm you checked "Auto Confirm User" when creating yourself,
  or go to Authentication → Users and confirm the user.
- Changes don't save → make sure the SQL ran without errors (the policies are
  what allow your writes).
