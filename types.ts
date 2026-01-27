
export enum View {
  HOME = 'home',
  LOST_PETS = 'lost_pets',
  ADOPTION = 'adoption',
  DONATIONS = 'donations',
  AI_ASSISTANT = 'ai_assistant'
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
