export enum View {
  HOME = 'home',
  LOST_PETS = 'lost_pets',
  ADOPTION = 'adoption',
  DONATIONS = 'donations',
  AI_ASSISTANT = 'ai_assistant',
  FAQ = 'faq'
}

export interface Pet {
  id: string;
  name: string;
  breed: string;
  species: 'dog' | 'cat' | 'bird' | 'other';
  gender: 'male' | 'female';
  age?: string;
  status: 'lost' | 'found' | 'adoption';
  urgency?: boolean;
  timeLabel?: string;
  location: string;
  distance?: string;
  image: string;
  description?: string;
  medStatus?: string[];
  /** Contacto del reportante (mascotas perdidas desde Supabase) */
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export type LostPetStatus = 'pending' | 'approved' | 'rejected';

export interface LostPetReportRow {
  id: string;
  status: LostPetStatus;
  pet_name: string;
  species: 'dog' | 'cat' | 'bird' | 'other';
  breed: string;
  gender: 'male' | 'female';
  age: string | null;
  size: 'small' | 'medium' | 'large' | null;
  color: string;
  distinctive_features: string | null;
  last_seen_date: string;
  last_seen_location: string;
  additional_info: string | null;
  urgency: boolean;
  has_reward: boolean;
  reward_amount: string | null;
  contact_name: string;
  contact_phone: string;
  contact_email: string | null;
  image_url: string;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  rejection_reason: string | null;
}

export interface DonationCampaign {
  id: string;
  title: string;
  description: string;
  raised: number;
  goal: number;
  image: string;
  urgency?: boolean;
  type: 'medical' | 'food' | 'infrastructure';
}

export interface Message {
  role: 'user' | 'model';
  content: string;
}
