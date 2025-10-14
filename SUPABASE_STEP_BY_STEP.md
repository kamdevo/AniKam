# 🚀 Pasos para Configurar Supabase - Guía Visual

## 🎯 Resumen
Esta guía te llevará paso a paso para configurar Supabase en AniKam en **menos de 10 minutos**.

---

## ⚡ PASO 1: Crear Proyecto en Supabase

### 1.1 - Ir a Supabase
```
🌐 Abre tu navegador y ve a: https://supabase.com
👤 Haz clic en "Sign In" o "Start your project"
```

### 1.2 - Crear Cuenta (si no tienes)
```
📧 Puedes registrarte con:
   • GitHub
   • Email
```

### 1.3 - Crear Nuevo Proyecto
```
➕ Click en "New Project"

Rellena:
┌─────────────────────────────────────┐
│ Organization: Tu organización        │
│ Project Name: AniKam                │
│ Database Password: ••••••••••       │  ← Crea una segura
│ Region: Closest to you              │  ← Elige la más cercana
│ Pricing Plan: Free                  │
└─────────────────────────────────────┘

🚀 Click "Create new project"
⏱️  Espera ~2 minutos mientras se crea
```

---

## 🔑 PASO 2: Obtener Credenciales

### 2.1 - Ir a Settings
```
En el sidebar izquierdo:
⚙️  Click en "Settings" (ícono de engranaje)
🔌 Click en "API"
```

### 2.2 - Copiar las Credenciales
```
Encontrarás dos valores importantes:

┌──────────────────────────────────────────────┐
│ Project URL                                   │
│ https://abcdefghijklmnop.supabase.co         │
│                                        [Copy] │
└──────────────────────────────────────────────┘
                  👆 Copia esto

┌──────────────────────────────────────────────┐
│ Project API keys                              │
│                                               │
│ anon public                                   │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...      │
│                                        [Copy] │
└──────────────────────────────────────────────┘
                  👆 Copia esto también
```

---

## 📝 PASO 3: Configurar Variables de Entorno

### 3.1 - Crear archivo .env
```powershell
# En la raíz del proyecto AniKam
New-Item -Path .env -ItemType File
```

### 3.2 - Editar .env
```
Abre el archivo .env y pega:

┌──────────────────────────────────────────────┐
│ VITE_SUPABASE_URL=                           │
│ VITE_SUPABASE_ANON_KEY=                      │
└──────────────────────────────────────────────┘

Después de pegar tus credenciales debe verse así:

┌──────────────────────────────────────────────┐
│ VITE_SUPABASE_URL=https://tuproye.supabase.co│
│ VITE_SUPABASE_ANON_KEY=eyJhbGci...          │
└──────────────────────────────────────────────┘
```

⚠️ **IMPORTANTE**: 
- No dejes espacios antes o después del `=`
- No uses comillas
- Reemplaza con TUS credenciales reales

---

## 💾 PASO 4: Ejecutar Script SQL

### 4.1 - Abrir SQL Editor
```
En el dashboard de Supabase:
📊 Click en "SQL Editor" en el sidebar izquierdo
➕ Click en "New query"
```

### 4.2 - Copiar y Pegar el Script
```
1. Abre el archivo: supabase-setup-simple.sql
2. Selecciona TODO el contenido (Ctrl + A)
3. Copia (Ctrl + C)
4. Pega en el SQL Editor de Supabase (Ctrl + V)
```

### 4.3 - Ejecutar
```
▶️  Click en "RUN" (esquina inferior derecha)
   O presiona Ctrl + Enter

✅ Deberías ver: "Success. No rows returned"
```

Si ves errores, verifica que copiaste TODO el script.

---

## 🔓 PASO 5: Desactivar Confirmación de Email

### 5.1 - Ir a Authentication
```
En el sidebar de Supabase:
🔐 Click en "Authentication"
🔌 Click en "Providers"
```

### 5.2 - Configurar Email Provider
```
Busca "Email" en la lista
Click en "Email"

Configura así:
┌────────────────────────────────────────┐
│ ✅ Enable Email provider               │
│ ✅ Enable Signup                       │
│ ❌ Confirm email        ← DESACTIVAR  │
│ ❌ Secure email change  ← DESACTIVAR  │
└────────────────────────────────────────┘

💾 Click "Save"
```

---

## ✅ PASO 6: Verificar Configuración

### 6.1 - Verificar con SQL
```
En SQL Editor, ejecuta:

SELECT * FROM profiles;

Debería decir: "0 rows" (normal, aún no hay usuarios)
```

### 6.2 - Verificar Políticas
```
En SQL Editor, ejecuta el contenido de:
supabase-verify.sql

Deberías ver confirmación de:
✅ Tabla profiles existe
✅ RLS habilitado
✅ 3 políticas creadas
✅ 2 triggers activos
```

---

## 🎮 PASO 7: Probar la Aplicación

### 7.1 - Iniciar Servidor
```powershell
# En la terminal:
npm run dev
```

### 7.2 - Abrir en Navegador
```
🌐 Abre: http://localhost:5173
```

### 7.3 - Registrar Usuario
```
1. Click en "Sign Up" (esquina superior derecha)
2. Rellena el formulario:
   ┌──────────────────────────────────┐
   │ Username: testuser               │
   │ Email: test@ejemplo.com          │
   │ Password: 123456                 │
   │ Confirm Password: 123456         │
   └──────────────────────────────────┘
3. Click "Create Account"
4. ✅ Deberías estar automáticamente autenticado!
```

### 7.4 - Verificar en Supabase
```
Regresa a Supabase Dashboard:

1. Authentication > Users
   ✅ Deberías ver tu usuario

2. Table Editor > profiles
   ✅ Deberías ver tu perfil creado automáticamente
```

---

## 🎉 ¡LISTO!

Tu aplicación AniKam ahora tiene:
- ✅ Sistema de autenticación completo
- ✅ Base de datos PostgreSQL
- ✅ Perfiles de usuario
- ✅ Seguridad Row Level Security
- ✅ Login/Logout funcionando

---

## 🧪 Probar Funcionalidades

### Login
```
1. Logout si estás autenticado
2. Click "Sign In"
3. Usa las credenciales que creaste:
   Email: test@ejemplo.com
   Password: 123456
4. ✅ Deberías poder entrar
```

### Usuario Demo (Sin Supabase)
```
Email: demo@anikam.com
Password: demo123
✅ Este sigue funcionando sin conexión a Supabase
```

---

## 🐛 ¿Algo salió mal?

### Error: "Invalid API key"
```
✅ Solución:
1. Verifica .env tiene las credenciales correctas
2. Reinicia el servidor: Ctrl+C y luego npm run dev
3. Limpia caché: Ctrl+Shift+R en el navegador
```

### Error: "Email not confirmed"
```
✅ Solución:
1. Ve a Supabase: Authentication > Providers > Email
2. Verifica que "Confirm email" esté DESACTIVADO
3. Si estaba activado, desactívalo y guarda
4. Intenta registrar de nuevo con otro email
```

### No puedo registrarme
```
✅ Solución:
1. Abre DevTools (F12)
2. Ve a Console
3. Busca errores en rojo
4. Si ves "User already registered", usa otro email
```

### La página no carga
```
✅ Solución:
1. Verifica que el servidor esté corriendo
2. Checa la terminal - debería decir:
   "Local: http://localhost:5173"
3. Si hay errores, ejecuta: npm install
```

---

## 📚 Recursos Adicionales

### Documentación
```
📖 SUPABASE_SETUP_SIMPLE.md      ← Guía detallada
📖 SUPABASE_QUICK_REFERENCE.md   ← Referencia rápida
📖 SUPABASE_INTEGRATION.md       ← Documentación técnica
```

### Scripts SQL
```
📄 supabase-setup-simple.sql     ← Script principal
📄 supabase-verify.sql           ← Script de verificación
```

### Archivos de Código
```
💻 client/lib/supabase.ts              ← Cliente Supabase
💻 client/contexts/auth-context.tsx    ← Lógica de autenticación
💻 client/pages/AuthCallback.tsx       ← Callback (no usado sin email confirm)
```

---

## 🎯 Próximos Pasos

Una vez que todo funcione:

1. **Experimenta**: 
   - Registra varios usuarios
   - Prueba login/logout
   - Verifica los datos en Supabase

2. **Explora el Dashboard**:
   - Revisa los logs
   - Explora las estadísticas
   - Familiarízate con la interfaz

3. **Desarrollo Futuro**:
   - Guardar biblioteca de anime en Supabase
   - Sincronizar entre dispositivos
   - Agregar autenticación social

---

## 💬 ¿Necesitas Ayuda?

1. **Revisa los logs** en Supabase:
   - Logs > Auth Logs
   - Logs > Postgres Logs

2. **Revisa la consola** del navegador (F12)

3. **Verifica las guías**:
   - SUPABASE_SETUP_SIMPLE.md para detalles
   - SUPABASE_QUICK_REFERENCE.md para comandos rápidos

---

**¡Felicidades! 🎊 Tu aplicación AniKam está lista con Supabase!**
