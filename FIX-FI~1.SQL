-- Fix Financial Objectives saving for multiple rows per month.
-- Run this once in Supabase SQL Editor.
-- Problem: financial_objectives_user_year_month_key allows only 1 row per user/month.
-- Financial Objectives needs multiple rows per user/month/category.

-- 1) Ensure month columns exist.
alter table public.financial_objectives
  add column if not exists year int not null default extract(year from now())::int;

alter table public.financial_objectives
  add column if not exists month int not null default (extract(month from now())::int - 1);

-- 2) Remove the wrong unique index/constraint if it exists.
drop index if exists public.financial_objectives_user_year_month_key;
alter table public.financial_objectives
  drop constraint if exists financial_objectives_user_year_month_key;

-- 3) Keep month validation.
alter table public.financial_objectives
  drop constraint if exists financial_objectives_month_check;

alter table public.financial_objectives
  add constraint financial_objectives_month_check check (month between 0 and 11);

-- 4) Create the correct index for multiple rows.
-- This allows short row 1, short row 2, medium row 1, etc. in the same month.
create index if not exists financial_objectives_user_period_idx
  on public.financial_objectives(user_id, year, month, category, sort_order);
