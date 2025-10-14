-- ============================================
-- AniKam Database Setup Script for Supabase
-- ============================================
-- This script creates all necessary tables, policies, 
-- functions, and triggers for user authentication
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
-- Stores user profile information
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  email text unique not null,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint username_length check (char_length(username) >= 3),
  constraint username_format check (username ~ '^[a-zA-Z0-9_]+$')
);

-- Add comment to table
comment on table public.profiles is 'User profile information linked to auth.users';

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS on profiles table
alter table public.profiles enable row level security;

-- Policy: Users can view their own profile
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Policy: Users can update their own profile
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Policy: Users can insert their own profile
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Policy: Users can delete their own profile (optional)
create policy "Users can delete their own profile"
  on public.profiles for delete
  using (auth.uid() = id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function: Automatically create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, email, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'username',
      split_part(new.email, '@', 1)
    ),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
exception
  when others then
    raise log 'Error creating profile for user %: %', new.id, sqlerrm;
    return new;
end;
$$;

-- Function: Update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Function: Get user profile by ID
create or replace function public.get_profile(user_id uuid)
returns json
language sql
stable
security definer
as $$
  select row_to_json(profiles.*)
  from public.profiles
  where profiles.id = user_id;
$$;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger: Automatically create profile when user signs up
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Trigger: Automatically update updated_at timestamp
drop trigger if exists on_profile_updated on public.profiles;
create trigger on_profile_updated
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- ============================================
-- INDEXES
-- ============================================
-- Indexes for better query performance

-- Index on username for fast lookups
create index if not exists profiles_username_idx 
  on public.profiles (username);

-- Index on email for fast lookups
create index if not exists profiles_email_idx 
  on public.profiles (email);

-- Index on created_at for sorting
create index if not exists profiles_created_at_idx 
  on public.profiles (created_at desc);

-- ============================================
-- GRANTS (Optional - for additional security)
-- ============================================
-- Grant appropriate permissions

-- Grant usage on schema
grant usage on schema public to authenticated;
grant usage on schema public to anon;

-- Grant permissions on profiles table
grant select, insert, update, delete on public.profiles to authenticated;
grant select on public.profiles to anon;

-- ============================================
-- TEST DATA (Optional - Remove in production)
-- ============================================
-- Uncomment the following to add test data

/*
-- Note: You need to create auth users first in Supabase dashboard
-- Then you can manually insert profiles or let the trigger handle it

-- Example test profile (only if user exists in auth.users)
insert into public.profiles (id, username, email, avatar_url)
values (
  'your-test-user-uuid-here',
  'testuser',
  'test@anikam.com',
  null
)
on conflict (id) do nothing;
*/

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these after setup to verify everything works

-- Check if profiles table exists and is configured correctly
select 
  schemaname,
  tablename,
  tableowner,
  rowsecurity as "RLS Enabled"
from pg_tables
where tablename = 'profiles';

-- Check policies
select 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
from pg_policies
where tablename = 'profiles';

-- Check triggers
select 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
from information_schema.triggers
where event_object_table in ('profiles', 'users')
order by event_object_table, trigger_name;

-- ============================================
-- CLEANUP (Use with caution!)
-- ============================================
-- Uncomment to remove everything and start fresh

/*
-- Drop triggers
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists on_profile_updated on public.profiles;

-- Drop functions
drop function if exists public.handle_new_user();
drop function if exists public.handle_updated_at();
drop function if exists public.get_profile(uuid);

-- Drop table (this will also drop all policies)
drop table if exists public.profiles cascade;
*/

-- ============================================
-- SETUP COMPLETE
-- ============================================
-- Your database is now ready for AniKam!
-- 
-- Next steps:
-- 1. Configure email templates in Authentication > Email Templates
-- 2. Set up redirect URLs in Authentication > URL Configuration
-- 3. Test user registration and login
-- 4. Monitor logs in Logs > Auth Logs
-- ============================================
