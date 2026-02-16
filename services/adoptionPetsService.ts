import { supabase } from './supabase';
import type { AdoptionPetReportRow } from '../types';
import type { Pet } from '../types';

const BUCKET = 'adoption-pet-images';

function rowToPet(r: AdoptionPetReportRow): Pet {
  const parts: string[] = [];
  if (r.description) parts.push(r.description);
  const description = parts.length ? parts.join('\n\n') : undefined;
  // Siempre mostrar San Justo como ubicación base
  const fullLocation = r.location ? `San Justo - ${r.location}` : 'San Justo';
  return {
    id: r.id,
    name: r.pet_name,
    breed: r.breed,
    species: r.species,
    gender: r.gender,
    age: r.age ?? undefined,
    status: 'adoption',
    location: fullLocation,
    image: r.image_url,
    description,
    medStatus: r.med_status ?? undefined,
    contactName: r.contact_name,
    contactPhone: r.contact_phone,
    contactEmail: r.contact_email ?? undefined,
    requirements: r.adoption_requirements ?? undefined,
  };
}

export interface SubmitAdoptionReportInput {
  petName: string;
  species: 'dog' | 'cat' | 'bird' | 'other';
  breed: string;
  gender: 'male' | 'female';
  age: string;
  size: 'small' | 'medium' | 'large';
  color: string;
  description: string;
  location: string;
  medStatus: string[];
  adoptionRequirements: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  imageFile: File;
}

/** Subir imagen a Storage y crear publicaciÃ³n de adopciÃ³n pendiente. */
export async function submitAdoptionPetReport(
  input: SubmitAdoptionReportInput
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

  const { error: insertError } = await supabase.from('adoption_pet_reports').insert({
    id,
    status: 'pending',
    pet_name: input.petName.trim(),
    species: input.species,
    breed: input.breed.trim(),
    gender: input.gender,
    age: input.age.trim() || null,
    size: input.size,
    color: input.color.trim(),
    description: input.description.trim() || null,
    location: input.location.trim(),
    med_status: input.medStatus.length ? input.medStatus : null,
    adoption_requirements: input.adoptionRequirements.trim() || null,
    contact_name: input.contactName.trim(),
    contact_phone: input.contactPhone.trim(),
    contact_email: input.contactEmail.trim() || null,
    image_url: imageUrl,
  });

  if (insertError) return { error: new Error(insertError.message) };
  return { error: null };
}

/** Listar solo publicaciones aprobadas (pÃºblico). */
export async function fetchApprovedAdoptionPets(): Promise<{ data: Pet[]; error: Error | null }> {
  const { data, error } = await supabase
    .from('adoption_pet_reports')
    .select('*')
    .eq('status', 'approved')
    .order('submitted_at', { ascending: false });

  if (error) return { data: [], error: new Error(error.message) };
  const rows = (data ?? []) as AdoptionPetReportRow[];
  return { data: rows.map(rowToPet), error: null };
}

/** Listar pendientes (admin). */
export async function fetchPendingAdoptionPetReports(): Promise<{
  data: AdoptionPetReportRow[];
  error: Error | null;
}> {
  const { data, error } = await supabase
    .from('adoption_pet_reports')
    .select('*')
    .eq('status', 'pending')
    .order('submitted_at', { ascending: false });

  if (error) return { data: [], error: new Error(error.message) };
  return { data: (data ?? []) as AdoptionPetReportRow[], error: null };
}

/** Aprobar publicaciÃ³n (admin). */
export async function approveAdoptionPetReport(
  id: string,
  userId: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('adoption_pet_reports')
    .update({
      status: 'approved',
      reviewed_at: new Date().toISOString(),
      reviewed_by: userId,
      rejection_reason: null,
    })
    .eq('id', id);

  return { error: error ? new Error(error.message) : null };
}

/** Rechazar publicaciÃ³n (admin). */
export async function rejectAdoptionPetReport(
  id: string,
  userId: string,
  reason?: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('adoption_pet_reports')
    .update({
      status: 'rejected',
      reviewed_at: new Date().toISOString(),
      reviewed_by: userId,
      rejection_reason: reason?.trim() || null,
    })
    .eq('id', id);

  return { error: error ? new Error(error.message) : null };
}
