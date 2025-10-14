# 🚀 Guía Rápida: Configuración Simple de Supabase (SIN Confirmación de Email)

## 📝 Pasos de Configuración

### 1️⃣ Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Haz clic en **"New Project"**
3. Rellena:
   - **Project Name**: `AniKam`
   - **Database Password**: Crea una contraseña segura (guárdala)
   - **Region**: Elige la más cercana a ti
4. Haz clic en **"Create new project"** y espera ~2 minutos

### 2️⃣ Obtener las Credenciales

1. En el dashboard, ve a **Settings** > **API**
2. Copia:
   - **Project URL** (ejemplo: `https://abcdefgh.supabase.co`)
   - **anon public** key (la clave larga que empieza con `eyJ...`)

### 3️⃣ Configurar Variables de Entorno

1. En la raíz del proyecto, crea un archivo `.env`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...tu-clave-aqui
```

> ⚠️ **Importante**: Reemplaza con TUS credenciales reales

### 4️⃣ Ejecutar el Script SQL

1. En Supabase, ve a **SQL Editor** (icono de base de datos en el menú lateral)
2. Haz clic en **"New query"**
3. Copia y pega TODO el contenido del archivo `supabase-setup-simple.sql`
4. Haz clic en **"Run"** (o presiona `Ctrl + Enter`)
5. Deberías ver: ✅ **Success. No rows returned**

### 5️⃣ Desactivar Confirmación de Email

1. Ve a **Authentication** > **Providers** en el menú lateral
2. Busca **Email** en la lista y haz clic en él
3. **IMPORTANTE**: Configura lo siguiente:
   - ✅ **Enable Email provider**: Activado
   - ✅ **Enable Signup**: Activado
   - ❌ **Confirm email**: **DESACTIVADO** ← MUY IMPORTANTE
   - ❌ **Secure email change**: **DESACTIVADO**
4. Haz clic en **"Save"**

### 6️⃣ Verificar la Configuración

En el SQL Editor, ejecuta estas consultas para verificar:

```sql
-- Ver la tabla profiles
SELECT * FROM profiles;

-- Ver las políticas de seguridad
SELECT tablename, policyname FROM pg_policies WHERE tablename = 'profiles';

-- Ver los triggers
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE event_object_table = 'profiles';
```

## 🎯 Probar el Sistema

### Iniciar el Proyecto

```bash
npm run dev
```

### Registrar un Usuario

1. Abre la aplicación en el navegador
2. Haz clic en **"Sign Up"**
3. Rellena el formulario:
   - Username: `testuser`
   - Email: `test@ejemplo.com`
   - Password: `123456` (mínimo 6 caracteres)
4. Haz clic en **"Create Account"**
5. **¡Listo!** Deberías estar automáticamente autenticado

### Verificar en Supabase

1. Ve a **Authentication** > **Users**
2. Deberías ver tu nuevo usuario
3. Ve a **Table Editor** > **profiles**
4. Deberías ver el perfil creado automáticamente

## 🔍 Verificación Rápida

### ✅ Checklist de Configuración

- [ ] Proyecto creado en Supabase
- [ ] Variables de entorno configuradas en `.env`
- [ ] Script SQL ejecutado sin errores
- [ ] Confirmación de email **DESACTIVADA**
- [ ] Tabla `profiles` creada
- [ ] Políticas RLS configuradas
- [ ] Trigger `on_auth_user_created` activo
- [ ] Aplicación corriendo (`npm run dev`)
- [ ] Registro de usuario funciona
- [ ] Login funciona

## 🎮 Usuario Demo

El usuario demo sigue funcionando sin Supabase:
- **Email**: `demo@anikam.com`
- **Password**: `demo123`

## 🔧 Solución de Problemas Comunes

### ❌ "Invalid API key"
**Solución**: 
- Verifica que copiaste las credenciales correctas
- Reinicia el servidor: `Ctrl + C` y luego `npm run dev`
- Asegúrate de usar la clave `anon`, NO la `service_role`

### ❌ "User already registered"
**Solución**: 
- El email ya existe, usa otro email
- O elimina el usuario en **Authentication** > **Users**

### ❌ "Email not confirmed"
**Solución**: 
- Verifica que **Confirm email** esté **DESACTIVADO** en Auth Settings
- Si no está desactivado, ve al paso 5️⃣ y desactívalo

### ❌ Error al crear perfil
**Solución**: 
```sql
-- Verifica que el trigger existe
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Si no existe, ejecuta de nuevo el script supabase-setup-simple.sql
```

### ❌ "Cannot read properties of null"
**Solución**: 
- Limpia el localStorage: Abre DevTools (F12) > Console > Escribe:
```javascript
localStorage.clear();
location.reload();
```

## 📊 Consultas Útiles SQL

### Ver todos los usuarios y perfiles
```sql
SELECT 
  u.email,
  u.created_at as registered_at,
  p.username,
  p.avatar_url
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;
```

### Eliminar un usuario específico
```sql
-- Primero elimina el perfil (o se eliminará automáticamente por cascade)
DELETE FROM auth.users WHERE email = 'test@ejemplo.com';
```

### Contar usuarios registrados
```sql
SELECT COUNT(*) as total_users FROM auth.users;
```

### Ver últimos registros
```sql
SELECT email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 10;
```

## 🚀 Próximos Pasos

Una vez que todo funcione:

1. **Guarda tu biblioteca de anime/manga en Supabase**:
   - Crea una tabla `user_library` para almacenar los animes guardados
   - Sincroniza entre dispositivos

2. **Agrega autenticación social** (opcional):
   - Google
   - GitHub
   - Discord

3. **Personalización del perfil**:
   - Subir avatares
   - Biografía
   - Estadísticas personales

4. **Deploy a producción**:
   - Configura las variables de entorno en Netlify/Vercel
   - Actualiza las URLs permitidas en Supabase

## 📱 Configuración para Producción

Cuando despliegues a producción (Netlify, Vercel, etc.):

### En Netlify:
```
Site settings > Environment variables:
VITE_SUPABASE_URL=tu-url
VITE_SUPABASE_ANON_KEY=tu-key
```

### En Vercel:
```
Project Settings > Environment Variables:
VITE_SUPABASE_URL=tu-url
VITE_SUPABASE_ANON_KEY=tu-key
```

## 🎉 ¡Listo!

Tu aplicación AniKam ahora tiene:
- ✅ Registro de usuarios (sin confirmación de email)
- ✅ Login/Logout
- ✅ Perfiles de usuario
- ✅ Seguridad con Row Level Security
- ✅ Base de datos PostgreSQL escalable
- ✅ Usuario demo que sigue funcionando

---

**¿Necesitas ayuda?** Revisa los logs en Supabase:
- **Logs** > **Auth Logs** - Para ver errores de autenticación
- **Logs** > **Postgres Logs** - Para ver errores de base de datos

**¡Disfruta construyendo AniKam! 🎌✨**
