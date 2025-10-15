# Base de Datos - AniKam

Este directorio contiene los scripts SQL necesarios para configurar y actualizar la base de datos de AniKam en Supabase.

## Configuración Inicial

### 1. Ejecutar Script de Actualización

Ve a tu proyecto de Supabase → SQL Editor y ejecuta el archivo `update_profiles_table.sql`:

```sql
-- Copia y pega el contenido del archivo update_profiles_table.sql
```

### 2. Verificar Estructura de la Tabla

Después de ejecutar el script, la tabla `profiles` debe tener la siguiente estructura:

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | UUID | ID único del usuario (FK a auth.users) |
| `username` | TEXT | Nombre de usuario único |
| `display_name` | TEXT | Nombre para mostrar (puede ser diferente al username) |
| `email` | TEXT | Email del usuario |
| `avatar_url` | TEXT | URL del avatar del usuario |
| `banner_url` | TEXT | URL del banner de perfil |
| `bio` | TEXT | Biografía del usuario |
| `content_filter` | TEXT | Filtro de contenido: 'all', 'safe', 'mature' |
| `theme_preference` | TEXT | Tema preferido: 'light', 'dark', 'auto' |
| `language` | TEXT | Idioma preferido (código ISO) |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de última actualización |

### 3. Políticas RLS (Row Level Security)

El script configura automáticamente las siguientes políticas:

- **Lectura**: Los usuarios pueden ver su propio perfil
- **Inserción**: Los usuarios pueden crear su propio perfil
- **Actualización**: Los usuarios pueden actualizar su propio perfil

### 4. Triggers Automáticos

- **updated_at**: Se actualiza automáticamente cuando se modifica un registro

## Funcionalidades del Perfil

### Campos Principales

1. **display_name**: Nombre que se muestra en la interfaz (por defecto igual al username)
2. **avatar_url**: Puede ser una URL de imagen o un emoji
3. **banner_url**: Imagen de fondo del perfil
4. **bio**: Descripción personal del usuario

### Configuraciones

1. **content_filter**: 
   - `all`: Muestra todo el contenido
   - `safe`: Solo contenido familiar
   - `mature`: Solo contenido para adultos

2. **theme_preference**:
   - `light`: Tema claro
   - `dark`: Tema oscuro
   - `auto`: Automático según el sistema

3. **language**:
   - `es`: Español
   - `en`: Inglés
   - `ja`: Japonés

## Migración de Datos Existentes

Si ya tienes usuarios en la base de datos, el script:

1. Agrega las nuevas columnas sin afectar datos existentes
2. Establece `display_name = username` para usuarios existentes
3. Aplica valores por defecto para las nuevas configuraciones

## Verificación

Para verificar que todo está configurado correctamente:

```sql
-- Ver estructura de la tabla
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Ver políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Ver triggers
SELECT * FROM information_schema.triggers WHERE event_object_table = 'profiles';
```

## Notas Importantes

1. **Backup**: Siempre haz un backup antes de ejecutar scripts en producción
2. **Testing**: Prueba primero en un entorno de desarrollo
3. **RLS**: Las políticas RLS están habilitadas para seguridad
4. **Índices**: Se crean índices automáticamente para mejorar el rendimiento

## Solución de Problemas

### Error: "column already exists"
Si ves este error, significa que algunas columnas ya existen. El script usa `IF NOT EXISTS` para evitar esto, pero si persiste, puedes ejecutar las partes individualmente.

### Error de permisos RLS
Si los usuarios no pueden actualizar sus perfiles, verifica que las políticas RLS estén configuradas correctamente y que `auth.uid()` funcione en tu configuración.

### Problemas con OAuth
Asegúrate de que el frontend esté usando los campos correctos (`display_name` en lugar de solo `username`) después de la migración.
