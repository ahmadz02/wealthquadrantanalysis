-- Wealth Quadrant Analyzer - Personal Data and Financial Objectives Schema
-- Run after your existing schema.sql

create table if not exists public.personal_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text,
  ic_number text,
  current_age integer,
  phone text,
  email text,
  profession text,
  home_address text,
  spouse_enabled boolean not null default false,
  spouse_data jsonb not null default '{}'::jsonb,
  children_enabled boolean not null default false,
  children_data jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.financial_objectives (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (category in ('short','medium','long')),
  objective text,
  amount_expected numeric(14,2) not null default 0,
  due_expected text,
  sort_order integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.personal_profiles enable row level security;
alter table public.financial_objectives enable row level security;

-- Premium users can manage their own profile.
create policy "Users can read own personal profile"
  on public.personal_profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own personal profile"
  on public.personal_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own personal profile"
  on public.personal_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Superadmin can view and update all profiles.
create policy "Superadmin can read all personal profiles"
  on public.personal_profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role = 'superadmin'
        and p.status = 'approved'
    )
  );


create policy "Superadmin can insert all personal profiles"
  on public.personal_profiles for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role = 'superadmin'
        and p.status = 'approved'
    )
  );

create policy "Superadmin can update all personal profiles"
  on public.personal_profiles for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role = 'superadmin'
        and p.status = 'approved'
    )
  );

-- Premium users can manage their own objectives.
create policy "Users can read own financial objectives"
  on public.financial_objectives for select
  using (auth.uid() = user_id);

create policy "Users can insert own financial objectives"
  on public.financial_objectives for insert
  with check (auth.uid() = user_id);

create policy "Users can update own financial objectives"
  on public.financial_objectives for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own financial objectives"
  on public.financial_objectives for delete
  using (auth.uid() = user_id);

-- Superadmin can manage all objectives.
create policy "Superadmin can read all financial objectives"
  on public.financial_objectives for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role = 'superadmin'
        and p.status = 'approved'
    )
  );

create policy "Superadmin can insert all financial objectives"
  on public.financial_objectives for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role = 'superadmin'
        and p.status = 'approved'
    )
  );

create policy "Superadmin can update all financial objectives"
  on public.financial_objectives for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role = 'superadmin'
        and p.status = 'approved'
    )
  );

create policy "Superadmin can delete all financial objectives"
  on public.financial_objectives for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role = 'superadmin'
        and p.status = 'approved'
    )
  );
