-- ============================================================
-- PetWelfare: Donaciones (donation_campaign_reports)
-- Ejecutar en Supabase -> SQL Editor
-- ============================================================

-- Tabla de campanas
create table if not exists public.donation_campaign_reports (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  title text not null,
  description text not null,
  goal numeric(12,2) not null check (goal > 0),
  image_url text not null,
  urgency boolean not null default false,
  type text not null check (type in ('medical', 'food', 'infrastructure')),
  pet_name text not null,
  cbu text not null,
  alias text not null,
  account_holder text not null,
  responsible_name text not null,
  contact_info text not null,
  deadline text not null,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id),
  rejection_reason text
);

-- Indices
create index if not exists idx_donation_campaign_reports_status on public.donation_campaign_reports (status);
create index if not exists idx_donation_campaign_reports_submitted_at on public.donation_campaign_reports (submitted_at desc);

-- RLS
alter table public.donation_campaign_reports enable row level security;

-- Anonimos: insertar y leer solo aprobados
create policy "anon_insert_donation_campaign_reports"
  on public.donation_campaign_reports for insert
  to anon, authenticated
  with check (true);

create policy "anon_select_approved_donation_campaign_reports"
  on public.donation_campaign_reports for select
  to anon, authenticated
  using (status = 'approved');

-- Autenticados (admin): ver todo y actualizar
create policy "auth_select_all_donation_campaign_reports"
  on public.donation_campaign_reports for select
  to authenticated
  using (true);

create policy "auth_update_donation_campaign_reports"
  on public.donation_campaign_reports for update
  to authenticated
  using (true)
  with check (true);

-- ============================================================
-- Storage: imagenes de campanas de donacion
-- 1. Dashboard -> Storage -> New bucket:
--    Name: donation-campaign-images
--    Public: Si
-- 2. Luego ejecutar las politicas siguientes.
-- ============================================================

create policy "anon_insert_donation_campaign_images"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'donation-campaign-images');

create policy "public_read_donation_campaign_images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'donation-campaign-images');
