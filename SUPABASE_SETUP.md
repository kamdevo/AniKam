# Configuración de Supabase para AniKam

## 📋 Pasos para configurar Supabase

### 1. Crear un Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta o inicia sesión
2. Haz clic en "New Project"
3. Completa los datos:
   - **Project Name**: AniKam
   - **Database Password**: Elige una contraseña segura (guárdala en un lugar seguro)
   - **Region**: Elige la región más cercana a tus usuarios
4. Haz clic en "Create new project" y espera a que se complete la configuración

### 2. Obtener las Credenciales

1. Una vez creado el proyecto, ve a **Settings** > **API**
2. Copia las siguientes credenciales:
   - **Project URL** (bajo "Project URL")
   - **anon/public key** (bajo "Project API keys")

### 3. Configurar las Variables de Entorno

1. Crea un archivo `.env` en la raíz del proyecto (si no existe)
2. Agrega las siguientes líneas reemplazando con tus credenciales:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 4. Configurar la Base de Datos

Ve a **SQL Editor** en tu dashboard de Supabase y ejecuta el siguiente script SQL:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  email text unique not null,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Policies for profiles table
-- Allow users to read their own profile
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

-- Allow users to update their own profile
create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Allow users to insert their own profile
create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Function to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email,
    null
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to automatically update updated_at
create trigger on_profile_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- Indexes for better performance
create index profiles_username_idx on public.profiles (username);
create index profiles_email_idx on public.profiles (email);
```

### 5. Configurar la Autenticación por Email

1. Ve a **Authentication** > **Providers** en tu dashboard
2. Habilita el proveedor de **Email**
3. Configura las opciones:
   - **Enable Email Confirmations**: ✅ Activado (recomendado)
   - **Secure email change**: ✅ Activado
   - **Enable Signup**: ✅ Activado

### 6. Configurar las URLs de Redirección

1. Ve a **Authentication** > **URL Configuration**
2. Agrega las siguientes URLs a **Redirect URLs**:
   - `http://localhost:5173/auth/callback` (para desarrollo)
   - `https://tu-dominio.com/auth/callback` (para producción)

### 7. Personalizar las Plantillas de Email (Opcional)

1. Ve a **Authentication** > **Email Templates**
2. Puedes personalizar:
   - **Confirm signup**: Email de confirmación de registro
   - **Reset password**: Email para restablecer contraseña
   - **Magic Link**: Link mágico para login sin contraseña

#### Ejemplo de plantilla personalizada para confirmación:

```html
<h2>¡Bienvenido a AniKam!</h2>
<p>Hola {{ .Email }},</p>
<p>Gracias por registrarte en AniKam, tu compañero definitivo para anime y manga.</p>
<p>Para completar tu registro, confirma tu correo electrónico haciendo clic en el siguiente enlace:</p>
<p><a href="{{ .ConfirmationURL }}">Confirmar Email</a></p>
<p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
<p>¡Disfruta explorando el mundo del anime y manga!</p>
<p>El equipo de AniKam</p>
```

### 8. Configurar Políticas de Seguridad (Opcional pero Recomendado)

En **Authentication** > **Policies**, puedes configurar:

- **Password Requirements**: Mínimo 6 caracteres (ya está validado en el cliente)
- **Rate Limiting**: Para prevenir ataques de fuerza bruta
- **Session Duration**: Tiempo de vida de la sesión

### 9. Verificar la Configuración

1. Ejecuta el proyecto: `npm run dev`
2. Intenta registrar un nuevo usuario
3. Verifica que:
   - Se envíe el email de confirmación
   - El usuario aparezca en **Authentication** > **Users**
   - Se cree el perfil en **Table Editor** > **profiles**

## 🔒 Seguridad Adicional

### Variables de Entorno para Producción

Cuando despliegues a producción (Netlify, Vercel, etc.), agrega las variables de entorno:

**En Netlify:**
1. Ve a Site settings > Environment variables
2. Agrega:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

**En Vercel:**
1. Ve a Project Settings > Environment Variables
2. Agrega las mismas variables

### Archivo .gitignore

Asegúrate de que `.env` esté en tu `.gitignore`:

```
# Environment variables
.env
.env.local
.env.production
```

## 🧪 Probar la Autenticación

### Registro de Usuario

1. Abre la aplicación
2. Haz clic en "Sign up"
3. Completa el formulario
4. Revisa tu email para el enlace de confirmación
5. Haz clic en el enlace de confirmación
6. Serás redirigido a la aplicación y estarás autenticado

### Login

1. Usa las credenciales de un usuario registrado
2. Si el email está confirmado, podrás iniciar sesión
3. Si no está confirmado, recibirás un error

### Usuario Demo

El usuario demo sigue funcionando sin necesidad de Supabase:
- Email: `demo@anikam.com`
- Password: `demo123`

## 📊 Monitoreo

En el dashboard de Supabase puedes:

- Ver usuarios registrados en **Authentication** > **Users**
- Ver perfiles en **Table Editor** > **profiles**
- Monitorear logs en **Logs** > **Auth Logs**
- Ver estadísticas de uso en **Home**

## 🛠️ Comandos Útiles SQL

### Ver todos los perfiles

```sql
select * from profiles;
```

### Buscar un usuario por email

```sql
select * from profiles where email = 'usuario@ejemplo.com';
```

### Eliminar un perfil (y su usuario asociado)

```sql
-- Esto también eliminará el usuario de auth.users debido al cascade
delete from profiles where email = 'usuario@ejemplo.com';
```

### Actualizar avatar de un usuario

```sql
update profiles 
set avatar_url = 'https://ejemplo.com/avatar.jpg' 
where email = 'usuario@ejemplo.com';
```

## 📝 Notas Importantes

1. **Confirmación de Email**: Los usuarios deben confirmar su email antes de poder iniciar sesión (a menos que desactives esta opción en Supabase)

2. **Rate Limiting**: Supabase tiene rate limiting incorporado para prevenir abuso

3. **PKCE Flow**: Estamos usando el flujo PKCE para mayor seguridad en la autenticación

4. **Row Level Security**: Las políticas RLS aseguran que los usuarios solo puedan acceder a sus propios datos

5. **Triggers Automáticos**: El perfil se crea automáticamente cuando un usuario se registra

## 🚨 Solución de Problemas

### Error: "Invalid API key"
- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de usar la `anon` key, no la `service_role` key

### Email de confirmación no llega
- Verifica la bandeja de spam
- Revisa los logs en Supabase: **Logs** > **Auth Logs**
- Verifica que el email del remitente no esté bloqueado

### Usuario no puede iniciar sesión después de registrarse
- Verifica que haya confirmado su email
- Revisa **Authentication** > **Users** para ver el estado del usuario

### Error de CORS
- Asegúrate de que la URL de tu aplicación esté en las Redirect URLs
- Verifica que estés usando la URL correcta en el `.env`

## 🎯 Próximos Pasos

Después de configurar la autenticación básica, puedes:

1. Agregar autenticación social (Google, GitHub, etc.)
2. Implementar recuperación de contraseña
3. Agregar autenticación de dos factores
4. Crear tablas adicionales para las bibliotecas de anime/manga de cada usuario
5. Implementar sincronización en tiempo real de las listas

¡Tu sistema de autenticación con Supabase está listo! 🎉
