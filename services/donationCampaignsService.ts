import { supabase } from './supabase';
import type { DonationCampaign, DonationCampaignReportRow } from '../types';

const BUCKET = 'donation-campaign-images';

function parseContactInfo(contactInfo: string): {
  whatsappNumber?: string;
  contactEmail?: string;
} {
  const text = (contactInfo || '').trim();
  if (!text) return {};

  const whatsappMatch = text.match(/whatsapp:\s*([^;|]+)/i);
  const emailMatch = text.match(/email:\s*([^;|]+)/i);

  if (whatsappMatch || emailMatch) {
    return {
      whatsappNumber: whatsappMatch?.[1]?.trim() || undefined,
      contactEmail: emailMatch?.[1]?.trim() || undefined,
    };
  }

  // Compatibilidad con datos viejos en texto libre.
  const looseEmail = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
  const loosePhone = text.match(/(\+?\d[\d\s().-]{7,}\d)/)?.[0];
  return {
    whatsappNumber: loosePhone?.trim() || undefined,
    contactEmail: looseEmail?.trim() || undefined,
  };
}

function buildContactInfo(whatsappNumber: string, contactEmail: string): string {
  return `whatsapp:${whatsappNumber.trim()};email:${contactEmail.trim()}`;
}

function rowToDonationCampaign(row: DonationCampaignReportRow): DonationCampaign {
  const parsedContact = parseContactInfo(row.contact_info);
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    goal: row.goal,
    image: row.image_url,
    urgency: row.urgency,
    type: row.type,
    petName: row.pet_name,
    cbu: row.cbu,
    alias: row.alias,
    accountHolder: row.account_holder,
    responsibleName: row.responsible_name,
    contactInfo: row.contact_info,
    whatsappNumber: parsedContact.whatsappNumber,
    contactEmail: parsedContact.contactEmail,
    deadline: row.deadline,
  };
}

export interface SubmitDonationCampaignInput {
  title: string;
  description: string;
  goal: number;
  urgency: boolean;
  type: 'medical' | 'food' | 'shelter' | 'spay_neuter' | 'emergency' | 'other' | 'infrastructure';
  petName: string;
  cbu: string;
  alias: string;
  accountHolder: string;
  responsibleName: string;
  whatsappNumber: string;
  contactEmail: string;
  deadline: string;
  imageFile: File;
}

/** Subir imagen a Storage y crear Donation de donacion pendiente. */
export async function submitDonationCampaign(
  input: SubmitDonationCampaignInput
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

  const { error: insertError } = await supabase.from('donation_campaign_reports').insert({
    id,
    status: 'pending',
    title: input.title.trim(),
    description: input.description.trim(),
    goal: input.goal,
    image_url: imageUrl,
    urgency: input.urgency,
    type: input.type,
    pet_name: input.petName.trim(),
    cbu: input.cbu.trim(),
    alias: input.alias.trim(),
    account_holder: input.accountHolder.trim(),
    responsible_name: input.responsibleName.trim(),
    contact_info: buildContactInfo(input.whatsappNumber, input.contactEmail),
    deadline: input.deadline.trim(),
  });

  if (insertError) return { error: new Error(insertError.message) };
  return { error: null };
}

/** Listar solo donaciones aprobadas (publico). */
export async function fetchApprovedDonationCampaigns(): Promise<{
  data: DonationCampaign[];
  error: Error | null;
}> {
  const { data, error } = await supabase
    .from('donation_campaign_reports')
    .select('*')
    .eq('status', 'approved')
    .order('submitted_at', { ascending: false });

  if (error) return { data: [], error: new Error(error.message) };
  const rows = (data ?? []) as DonationCampaignReportRow[];
  return { data: rows.map(rowToDonationCampaign), error: null };
}

/** Listar donaciones aprobadas (admin). */
export async function fetchApprovedDonationCampaignReports(): Promise<{
  data: DonationCampaignReportRow[];
  error: Error | null;
}> {
  const { data, error } = await supabase
    .from('donation_campaign_reports')
    .select('*')
    .eq('status', 'approved')
    .order('reviewed_at', { ascending: false });

  if (error) return { data: [], error: new Error(error.message) };
  return { data: (data ?? []) as DonationCampaignReportRow[], error: null };
}

/** Listar pendientes (admin). */
export async function fetchPendingDonationCampaignReports(): Promise<{
  data: DonationCampaignReportRow[];
  error: Error | null;
}> {
  const { data, error } = await supabase
    .from('donation_campaign_reports')
    .select('*')
    .eq('status', 'pending')
    .order('submitted_at', { ascending: false });

  if (error) return { data: [], error: new Error(error.message) };
  return { data: (data ?? []) as DonationCampaignReportRow[], error: null };
}

/** Aprobar donacion (admin). */
export async function approveDonationCampaignReport(
  id: string,
  userId: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('donation_campaign_reports')
    .update({
      status: 'approved',
      reviewed_at: new Date().toISOString(),
      reviewed_by: userId,
      rejection_reason: null,
    })
    .eq('id', id);

  return { error: error ? new Error(error.message) : null };
}

/** Rechazar donacion (admin). */
export async function rejectDonationCampaignReport(
  id: string,
  userId: string,
  reason?: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('donation_campaign_reports')
    .update({
      status: 'rejected',
      reviewed_at: new Date().toISOString(),
      reviewed_by: userId,
      rejection_reason: reason?.trim() || null,
    })
    .eq('id', id);

  return { error: error ? new Error(error.message) : null };
}

/** Listar donaciones del usuario actual (user). */
export async function fetchUserDonationCampaignReports(
  userId: string
): Promise<{ data: DonationCampaignReportRow[]; error: Error | null }> {
  const { data, error } = await supabase
    .from('donation_campaign_reports')
    .select('*')
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false });

  if (error) return { data: [], error: new Error(error.message) };
  return { data: (data ?? []) as DonationCampaignReportRow[], error: null };
}

/** Eliminar donacion (user). */
export async function deleteDonationCampaignReport(
  id: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('donation_campaign_reports')
    .delete()
    .eq('id', id);

  return { error: error ? new Error(error.message) : null };
}
