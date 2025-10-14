-- ============================================
-- AniKam - Configuración Simple de Supabase
-- SIN confirmación de email
-- ============================================

-- Habilitar extensión UUID
create extension if not exists "uuid-ossp";

-- ============================================
-- TABLA: profiles
-- ============================================
-- Almacena la información del perfil de usuario
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  email text unique not null,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint username_length check (char_length(username) >= 3)
);

-- ============================================
-- SEGURIDAD: Row Level Security (RLS)
-- ============================================
alter table public.profiles enable row level security;

-- Los usuarios pueden ver su propio perfil
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Los usuarios pueden actualizar su propio perfil
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Los usuarios pueden insertar su propio perfil
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ============================================
-- FUNCIÓN: Crear perfil automáticamente
-- ============================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, username, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email,
    null
  );
  return new;
exception
  when others then
    -- Si hay error, registrarlo pero no fallar
    raise log 'Error creating profile: %', sqlerrm;
    return new;
end;
$$;

-- ============================================
-- FUNCIÓN: Actualizar timestamp automáticamente
-- ============================================
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- ============================================
-- TRIGGERS
-- ============================================

-- Crear perfil cuando un usuario se registra
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Actualizar updated_at cuando se modifica el perfil
drop trigger if exists on_profile_updated on public.profiles;
create trigger on_profile_updated
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- ============================================
-- ÍNDICES para mejor rendimiento
-- ============================================
create index if not exists profiles_username_idx on public.profiles (username);
create index if not exists profiles_email_idx on public.profiles (email);

-- ============================================
-- ✅ CONFIGURACIÓN COMPLETADA
-- ============================================
-- Siguiente paso: Configurar Supabase Dashboard
-- Ver: SUPABASE_SETUP_SIMPLE.md
