-- ============================================================
-- PetWelfare: Mascotas Perdidas (lost_pet_reports)
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

-- Tabla de reportes
create table if not exists public.lost_pet_reports (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  pet_name text not null,
  species text not null check (species in ('dog', 'cat', 'bird', 'other')),
  breed text not null,
  gender text not null check (gender in ('male', 'female')),
  age text,
  size text check (size in ('small', 'medium', 'large')),
  color text not null,
  distinctive_features text,
  last_seen_date date not null,
  last_seen_location text not null,
  additional_info text,
  urgency boolean not null default false,
  has_reward boolean not null default false,
  reward_amount text,
  contact_name text not null,
  contact_phone text not null,
  contact_email text,
  image_url text not null,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id),
  rejection_reason text
);

-- Índices
create index if not exists idx_lost_pet_reports_status on public.lost_pet_reports (status);
create index if not exists idx_lost_pet_reports_submitted_at on public.lost_pet_reports (submitted_at desc);

-- RLS
alter table public.lost_pet_reports enable row level security;

-- Anónimos: insertar (crear reporte) y leer solo aprobados
create policy "anon_insert_lost_pet_reports"
  on public.lost_pet_reports for insert
  to anon, authenticated
  with check (true);

create policy "anon_select_approved_lost_pet_reports"
  on public.lost_pet_reports for select
  to anon, authenticated
  using (status = 'approved');

-- Autenticados (admin): ver todos y actualizar (aprobar/rechazar)
create policy "auth_select_all_lost_pet_reports"
  on public.lost_pet_reports for select
  to authenticated
  using (true);

create policy "auth_update_lost_pet_reports"
  on public.lost_pet_reports for update
  to authenticated
  using (true)
  with check (true);

-- ============================================================
-- Storage: fotos de mascotas perdidas
-- 1. Dashboard → Storage → New bucket:
--    Name: lost-pet-images
--    Public: Sí (para que las fotos aprobadas sean visibles)
-- 2. Luego ejecutar las políticas siguientes.
-- ============================================================

-- Permiso para que cualquiera suba (al reportar)
create policy "anon_insert_lost_pet_images"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'lost-pet-images');

-- Lectura pública (ya está si el bucket es público; por si acaso)
create policy "public_read_lost_pet_images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'lost-pet-images');
