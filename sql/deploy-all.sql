-- Run this full deployment script in Supabase SQL Editor.
-- It combines the original core schema and the new personal data/objectives schema.

-- Wealth Quadrant Supabase schema
-- Run this in Supabase SQL Editor after enabling Email/Password Auth.

create type public.app_role as enum ('superadmin', 'premium');
create type public.approval_status as enum ('pending', 'approved', 'rejected');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  username text unique not null,
  role public.app_role not null default 'premium',
  status public.approval_status not null default 'pending',
  approved_by uuid references public.profiles(id),
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.wealth_month_data (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  year int not null,
  month int not null check (month between 0 and 11),
  data jsonb not null default '{}'::jsonb,
  storage_path text,
  updated_at timestamptz not null default now(),
  unique(user_id, year, month)
);

create or replace function public.is_superadmin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'superadmin' and p.status = 'approved');
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, username, role, status)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email,'@',1)),
    coalesce((new.raw_user_meta_data->>'requested_role')::public.app_role, 'premium'),
    case when not exists (select 1 from public.profiles where role='superadmin' and status='approved')
         then 'approved'::public.approval_status
         else 'pending'::public.approval_status end
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.wealth_month_data enable row level security;

create policy "profiles read self or superadmin" on public.profiles
for select to authenticated using (id = auth.uid() or public.is_superadmin());

create policy "superadmin updates profiles" on public.profiles
for update to authenticated using (public.is_superadmin()) with check (public.is_superadmin());

create policy "month data read own or superadmin" on public.wealth_month_data
for select to authenticated using (user_id = auth.uid() or public.is_superadmin());

create policy "premium writes own month data" on public.wealth_month_data
for insert to authenticated with check (user_id = auth.uid() or public.is_superadmin());

create policy "premium updates own month data" on public.wealth_month_data
for update to authenticated using (user_id = auth.uid() or public.is_superadmin()) with check (user_id = auth.uid() or public.is_superadmin());

create policy "premium deletes own month data" on public.wealth_month_data
for delete to authenticated using (user_id = auth.uid() or public.is_superadmin());

-- Storage bucket: create a private bucket named wealth-quadrant-analysis in Supabase Storage.
-- Storage policies for unique user folders.
create policy "storage read own folder or superadmin" on storage.objects
for select to authenticated using (bucket_id = 'wealth-quadrant-analysis' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_superadmin()));

create policy "storage write own folder or superadmin" on storage.objects
for insert to authenticated with check (bucket_id = 'wealth-quadrant-analysis' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_superadmin()));

create policy "storage update own folder or superadmin" on storage.objects
for update to authenticated using (bucket_id = 'wealth-quadrant-analysis' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_superadmin()));

create policy "storage delete own folder or superadmin" on storage.objects
for delete to authenticated using (bucket_id = 'wealth-quadrant-analysis' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_superadmin()));


-- Personal data and financial objectives extension
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
  year int not null default extract(year from now())::int,
  month int not null default (extract(month from now())::int - 1) check (month between 0 and 11),
  category text not null check (category in ('short','medium','long')),
  objective text,
  amount_expected numeric(14,2) not null default 0,
  due_expected text,
  sort_order integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


create index if not exists financial_objectives_user_period_idx
  on public.financial_objectives(user_id, year, month, category, sort_order);

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
