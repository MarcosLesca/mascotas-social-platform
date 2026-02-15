import { supabase } from './supabase';
import type { LostPetReportRow } from '../types';
import type { Pet } from '../types';

const BUCKET = 'lost-pet-images';

function timeLabelFromDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);
  if (diffMins < 60) return `hace ${diffMins} min`;
  if (diffHours < 24) return `hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
  if (diffDays < 30) return `hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
  return `hace ${Math.floor(diffDays / 30)} ${Math.floor(diffDays / 30) === 1 ? 'mes' : 'meses'}`;
}

function rowToPet(r: LostPetReportRow): Pet {
  const parts: string[] = [];
  if (r.distinctive_features) parts.push(r.distinctive_features);
  if (r.additional_info) parts.push(r.additional_info);
  if (r.has_reward && r.reward_amount) parts.push(`Recompensa: ${r.reward_amount}`);
  const description = parts.length ? parts.join('\n\n') : undefined;
  return {
    id: r.id,
    name: r.pet_name,
    breed: r.breed,
    species: r.species,
    gender: r.gender,
    age: r.age ?? undefined,
    status: 'lost',
    urgency: r.urgency,
    timeLabel: timeLabelFromDate(r.last_seen_date),
    location: r.last_seen_location,
    image: r.image_url,
    description,
    contactName: r.contact_name,
    contactPhone: r.contact_phone,
    contactEmail: r.contact_email ?? undefined,
    lastSeenDate: r.last_seen_date,
    lastSeenLocation: r.last_seen_location,
  };
}

export interface SubmitReportInput {
  petName: string;
  species: 'dog' | 'cat' | 'bird' | 'other';
  breed: string;
  gender: 'male' | 'female';
  age: string;
  size: 'small' | 'medium' | 'large';
  color: string;
  distinctiveFeatures: string;
  lastSeenDate: string;
  lastSeenLocation: string;
  additionalInfo: string;
  urgency: boolean;
  hasReward: boolean;
  rewardAmount: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  imageFile: File;
}

/** Subir imagen a Storage y crear reporte pendiente. */
export async function submitLostPetReport(
  input: SubmitReportInput
): Promise<{ error: Error | null }> {
  const id = crypto.randomUUID();
  const ext = input.imageFile.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `reports/${id}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, input.imageFile, { upsert: false });

  if (uploadError) return { error: new Error(uploadError.message) };

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const imageUrl = urlData.publicUrl;

  const { error: insertError } = await supabase.from('lost_pet_reports').insert({
    id,
    status: 'pending',
    pet_name: input.petName.trim(),
    species: input.species,
    breed: input.breed.trim(),
    gender: input.gender,
    age: input.age.trim() || null,
    size: input.size,
    color: input.color.trim(),
    distinctive_features: input.distinctiveFeatures.trim() || null,
    last_seen_date: input.lastSeenDate,
    last_seen_location: input.lastSeenLocation.trim(),
    additional_info: input.additionalInfo.trim() || null,
    urgency: input.urgency,
    has_reward: input.hasReward,
    reward_amount: input.rewardAmount.trim() || null,
    contact_name: input.contactName.trim(),
    contact_phone: input.contactPhone.trim(),
    contact_email: input.contactEmail.trim() || null,
    image_url: imageUrl,
  });

  if (insertError) return { error: new Error(insertError.message) };
  return { error: null };
}

/** Listar solo reportes aprobados (público). */
export async function fetchApprovedLostPets(): Promise<{ data: Pet[]; error: Error | null }> {
  const { data, error } = await supabase
    .from('lost_pet_reports')
    .select('*')
    .eq('status', 'approved')
    .order('submitted_at', { ascending: false });

  if (error) return { data: [], error: new Error(error.message) };
  const rows = (data ?? []) as LostPetReportRow[];
  return { data: rows.map(rowToPet), error: null };
}

/** Listar pendientes (admin). */
export async function fetchPendingLostPetReports(): Promise<{
  data: LostPetReportRow[];
  error: Error | null;
}> {
  const { data, error } = await supabase
    .from('lost_pet_reports')
    .select('*')
    .eq('status', 'pending')
    .order('submitted_at', { ascending: false });

  if (error) return { data: [], error: new Error(error.message) };
  return { data: (data ?? []) as LostPetReportRow[], error: null };
}

/** Aprobar reporte (admin). */
export async function approveLostPetReport(
  id: string,
  userId: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('lost_pet_reports')
    .update({
      status: 'approved',
      reviewed_at: new Date().toISOString(),
      reviewed_by: userId,
      rejection_reason: null,
    })
    .eq('id', id);

  return { error: error ? new Error(error.message) : null };
}

/** Rechazar reporte (admin). */
export async function rejectLostPetReport(
  id: string,
  userId: string,
  reason?: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('lost_pet_reports')
    .update({
      status: 'rejected',
      reviewed_at: new Date().toISOString(),
      reviewed_by: userId,
      rejection_reason: reason?.trim() || null,
    })
    .eq('id', id);

  return { error: error ? new Error(error.message) : null };
}
