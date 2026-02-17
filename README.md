## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Admin Panel (Supabase)

El panel de administración usa **Supabase** para autenticación y base de datos.

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Copia `.env.example` a `.env` y rellena:
   - `VITE_SUPABASE_URL`: URL del proyecto (Settings → API)
   - `VITE_SUPABASE_ANON_KEY`: clave anónima pública (Settings → API)
3. En Supabase: **Authentication → Users** crea un usuario (email + contraseña) para admin.
4. Accede a `/admin` o haz clic en **Admin** en el footer. Si no estás logueado, irás a `/admin/login`.

**Seguridad del login:**
- Validación de email y contraseña (mín. 8 caracteres, máx. 72).
- Límite de intentos fallidos (5 en 15 min) con bloqueo temporal.
- Mensajes genéricos ante error (no se revela si el email existe).
- Sesión persistente y refresh automático de tokens (Supabase).

## Mascotas Perdidas (ABM + aprobación)

1. **Supabase Storage:** Dashboard → Storage → New bucket → nombre `lost-pet-images`, **público**.
2. **SQL:** En Supabase → SQL Editor, ejecuta el contenido de [scripts/init-lost-pets.sql](scripts/init-lost-pets.sql) (tabla `lost_pet_reports`, RLS y políticas de Storage).
3. **Flujo:**
   - Una persona reporta una mascota perdida en **Mascotas Perdidas** → **COMENZAR** (formulario con foto, datos y contacto).
   - El reporte se guarda con estado `pending`. Solo los aprobados se publican.
   - Admin en **Admin → Mascotas perdidas**: ve pendientes, **Aprobar** o **Rechazar** (opcional: motivo).
   - Si aprueba, el reporte pasa a `approved` y se muestra en la vista pública de Mascotas Perdidas.


## Adopción (ABM + aprobación)

1. **Supabase Storage:** Dashboard → Storage → New bucket → nombre `adoption-pet-images`, **público**.
2. **SQL:** En Supabase → SQL Editor, ejecuta el contenido de [scripts/init-adoption-pets.sql](scripts/init-adoption-pets.sql) (tabla `adoption_pet_reports`, RLS y políticas de Storage).
3. **Flujo:**
   - Un responsable publica una mascota en **Adopción** → **COMENZAR** (formulario con foto, datos, ubicación y contacto).
   - La publicación se guarda con estado `pending`. Solo las aprobadas se publican.
   - Admin en **Admin → Adopción**: ve pendientes, **Aprobar** o **Rechazar** (opcional: motivo).
   - Si aprueba, la publicación pasa a `approved` y se muestra en la vista pública de Adopción.

## Donaciones (ABM + aprobación)

1. **Supabase Storage:** Dashboard → Storage → New bucket → nombre `donation-campaign-images`, **público**.
2. **SQL:** En Supabase → SQL Editor, ejecuta [scripts/init-donation-campaigns.sql](scripts/init-donation-campaigns.sql) (tabla `donation_campaign_reports`, RLS y políticas de Storage).
3. **Flujo:**
   - Una campaña se guarda con estado `pending`.
   - Admin en **Admin → Donaciones**: ve pendientes, **Aprobar** o **Rechazar** (opcional: motivo).
   - Si aprueba, la campaña pasa a `approved` y se muestra en la vista pública de Donaciones.
