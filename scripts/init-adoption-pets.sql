-- ============================================================
-- PetWelfare: Adopción (adoption_pet_reports)
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

-- Tabla de publicaciones
create table if not exists public.adoption_pet_reports (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  pet_name text not null,
  species text not null check (species in ('dog', 'cat', 'bird', 'other')),
  breed text not null,
  gender text not null check (gender in ('male', 'female')),
  age text,
  size text check (size in ('small', 'medium', 'large')),
  color text not null,
  description text,
  location text not null,
  med_status text[],
  adoption_requirements text,
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
create index if not exists idx_adoption_pet_reports_status on public.adoption_pet_reports (status);
create index if not exists idx_adoption_pet_reports_submitted_at on public.adoption_pet_reports (submitted_at desc);

-- RLS
alter table public.adoption_pet_reports enable row level security;

-- Anónimos: insertar (crear publicación) y leer solo aprobados
create policy "anon_insert_adoption_pet_reports"
  on public.adoption_pet_reports for insert
  to anon, authenticated
  with check (true);

create policy "anon_select_approved_adoption_pet_reports"
  on public.adoption_pet_reports for select
  to anon, authenticated
  using (status = 'approved');

-- Autenticados (admin): ver todos y actualizar (aprobar/rechazar)
create policy "auth_select_all_adoption_pet_reports"
  on public.adoption_pet_reports for select
  to authenticated
  using (true);

create policy "auth_update_adoption_pet_reports"
  on public.adoption_pet_reports for update
  to authenticated
  using (true)
  with check (true);

-- ============================================================
-- Storage: fotos de mascotas en adopciÃ³n
-- 1. Dashboard â†’ Storage â†’ New bucket:
--    Name: adoption-pet-images
--    Public: SÃ­ (para que las fotos aprobadas sean visibles)
-- 2. Luego ejecutar las polÃ­ticas siguientes.
-- ============================================================

-- Permiso para que cualquiera suba (al publicar)
create policy "anon_insert_adoption_pet_images"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'adoption-pet-images');

-- Lectura pÃºblica (ya estÃ¡ si el bucket es pÃºblico; por si acaso)
create policy "public_read_adoption_pet_images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'adoption-pet-images');
