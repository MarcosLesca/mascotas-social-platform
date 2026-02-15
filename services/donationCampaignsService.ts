import { supabase } from './supabase';
import type { DonationCampaign, DonationCampaignReportRow } from '../types';

const BUCKET = 'donation-campaign-images';

function rowToDonationCampaign(row: DonationCampaignReportRow): DonationCampaign {
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
    deadline: row.deadline,
  };
}

export interface SubmitDonationCampaignInput {
  title: string;
  description: string;
  goal: number;
  urgency: boolean;
  type: 'medical' | 'food' | 'infrastructure';
  petName: string;
  cbu: string;
  alias: string;
  accountHolder: string;
  responsibleName: string;
  contactInfo: string;
  deadline: string;
  imageFile: File;
}

/** Subir imagen a Storage y crear campana de donacion pendiente. */
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
    contact_info: input.contactInfo.trim(),
    deadline: input.deadline.trim(),
  });

  if (insertError) return { error: new Error(insertError.message) };
  return { error: null };
}

/** Listar solo campanas aprobadas (publico). */
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

/** Aprobar campana (admin). */
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

/** Rechazar campana (admin). */
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
