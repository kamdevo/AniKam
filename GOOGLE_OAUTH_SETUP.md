# 🔐 Configuración de Google OAuth en Supabase

## ✅ Ya Completado
- ✅ Provider de Google activado en Supabase
- ✅ Código actualizado para usar Google OAuth

## 🎯 Configuración Necesaria en Supabase

### 1️⃣ Configurar URLs de Redirección

Ve a tu Dashboard de Supabase:

**Authentication** > **URL Configuration**

Agrega las siguientes URLs a **"Redirect URLs"**:

```
http://localhost:8080/auth/callback
http://localhost:5173/auth/callback
http://localhost:8085/auth/callback
```

> 💡 Agrega todas las URLs porque el puerto puede variar

### 2️⃣ Configurar Site URL

En la misma sección **URL Configuration**, configura:

**Site URL:**
```
http://localhost:8080
```

---

## 🧪 Probar Google OAuth

### Pasos para Probar:

1. **Reinicia el servidor** (si no lo has hecho):
   ```bash
   npm run dev
   ```

2. **Abre la aplicación:**
   ```
   http://localhost:8080
   ```

3. **Haz clic en "Sign In" o "Sign Up"**

4. **Haz clic en el botón de Google**
   - Deberías ser redirigido a la página de login de Google
   - Selecciona tu cuenta de Google
   - Autoriza la aplicación
   - Serás redirigido de vuelta a AniKam autenticado

---

## 🔍 Si No Funciona

### Error: "Redirect URL not allowed"

**Solución:**
1. Ve a Supabase: **Authentication** > **URL Configuration**
2. Verifica que hayas agregado: `http://localhost:8080/auth/callback`
3. Haz clic en **Save**
4. Espera 1-2 minutos para que se apliquen los cambios
5. Intenta de nuevo

### Error: "OAuth provider not configured"

**Solución:**
1. Ve a Supabase: **Authentication** > **Providers**
2. Verifica que **Google** esté activado (toggle verde)
3. Verifica que tengas configurado:
   - Client ID (de Google Cloud Console)
   - Client Secret (de Google Cloud Console)

---

## 📋 Configuración Completa de Google OAuth (Si No Lo Has Hecho)

Si el botón no funciona, necesitas configurar las credenciales de Google:

### 1. Ve a Google Cloud Console

1. Ve a: https://console.cloud.google.com/
2. Crea un nuevo proyecto (o selecciona uno existente)
3. Nombre: "AniKam OAuth"

### 2. Habilita la API de Google OAuth

1. En el menú: **APIs & Services** > **OAuth consent screen**
2. Selecciona **External**
3. Completa:
   - App name: `AniKam`
   - User support email: Tu email
   - Developer contact: Tu email
4. Click **Save and Continue**
5. En Scopes: Click **Save and Continue** (usa los defaults)
6. En Test users: Agrega tu email de Google
7. Click **Save and Continue**

### 3. Crear Credenciales OAuth

1. Ve a: **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client ID**
3. Application type: **Web application**
4. Name: `AniKam Web Client`
5. **Authorized JavaScript origins:**
   ```
   http://localhost:8080
   http://localhost:5173
   https://fcqqcjvyioeiuhhchvnn.supabase.co
   ```
6. **Authorized redirect URIs:**
   ```
   https://fcqqcjvyioeiuhhchvnn.supabase.co/auth/v1/callback
   ```
7. Click **Create**
8. **Copia el Client ID y Client Secret**

### 4. Configurar en Supabase

1. Ve a Supabase: **Authentication** > **Providers** > **Google**
2. Pega:
   - **Client ID:** (de Google Cloud Console)
   - **Client Secret:** (de Google Cloud Console)
3. Click **Save**

---

## ✅ Checklist Final

Antes de probar, verifica:

- [ ] Google provider activado en Supabase
- [ ] Client ID y Client Secret configurados (si usas OAuth real)
- [ ] Redirect URLs configuradas en Supabase
- [ ] Redirect URIs configuradas en Google Cloud Console
- [ ] Servidor reiniciado (`npm run dev`)
- [ ] Puerto correcto (verifica en la terminal)

---

## 🎉 ¡Listo!

Una vez configurado todo:

1. Abre la app: `http://localhost:8080`
2. Click en "Sign In"
3. Click en el botón de **Google**
4. Selecciona tu cuenta de Google
5. ✅ ¡Deberías estar autenticado!

---

## 💡 Nota Importante

Si solo activaste el provider pero **NO configuraste Client ID y Secret**, Supabase usará las credenciales por defecto para desarrollo, que funcionan solo con dominios localhost.

Para **producción**, DEBES configurar tus propias credenciales de Google Cloud Console.

---

## 🐛 Debugging

Si algo falla, revisa:

1. **Consola del navegador** (F12) - busca errores
2. **Supabase Logs**: Dashboard > Logs > Auth Logs
3. **Google Cloud Console**: OAuth consent screen > Test users

¿Necesitas ayuda con algún paso? 🔧
