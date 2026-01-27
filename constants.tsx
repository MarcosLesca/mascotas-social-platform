
import { Pet, DonationCampaign } from './types';

export const MOCK_LOST_PETS: Pet[] = [
  {
    id: '1',
    name: 'Cooper',
    breed: 'Beagle',
    species: 'dog',
    gender: 'male',
    status: 'lost',
    urgency: true,
    timeLabel: 'hace 2 horas',
    location: 'Parque Oakwood',
    distance: '2.4 km',
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Luna',
    breed: 'Doméstica',
    species: 'cat',
    gender: 'female',
    status: 'lost',
    timeLabel: 'hace 1 día',
    location: 'Calle Willow',
    distance: '0.8 km',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Mochi',
    breed: 'Bulldog Francés',
    species: 'dog',
    gender: 'male',
    status: 'lost',
    urgency: true,
    timeLabel: 'hace 5 horas',
    location: 'Plaza Central',
    distance: '1.2 km',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '4',
    name: 'Buddy',
    breed: 'Golden Retriever',
    species: 'dog',
    gender: 'male',
    status: 'lost',
    timeLabel: 'hace 3 días',
    location: 'Río Este',
    distance: '5.0 km',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=800&auto=format&fit=crop',
  }
];

export const MOCK_ADOPTION_PETS: Pet[] = [
  {
    id: 'a1',
    name: 'Cooper',
    breed: 'Golden Retriever',
    species: 'dog',
    gender: 'male',
    age: '2 Años',
    status: 'adoption',
    location: 'A 4 km',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=800&auto=format&fit=crop',
    description: 'Un compañero lleno de energía al que le encanta jugar y nadar.',
    medStatus: ['Vacunado', 'Esterilizado', 'Microchip']
  },
  {
    id: 'a2',
    name: 'Luna',
    breed: 'Mezcla de Corgi',
    species: 'dog',
    gender: 'female',
    age: '4 Años',
    status: 'adoption',
    location: 'A 6 km',
    image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?q=80&w=800&auto=format&fit=crop',
    description: 'Muy tranquila y observadora. Luna disfruta de paseos cortos.',
    medStatus: ['Esterilizada', 'Vacunada']
  }
];

export const MOCK_CAMPAIGNS: DonationCampaign[] = [
  {
    id: 'c1',
    title: 'Cirugía para Max: Recuperación de Pata',
    description: 'Cirugía ortopédica especializada urgente para un cruce de golden retriever rescatado.',
    raised: 1250,
    goal: 2000,
    image: 'https://images.unsplash.com/photo-1551730459-92db2a308d6a?q=80&w=800&auto=format&fit=crop',
    urgency: true,
    type: 'medical'
  },
  {
    id: 'c2',
    title: 'Rescate: 15 Cachorros Encontrados',
    description: 'Vacunación inmediata, desparasitación y nutrición especializada necesaria.',
    raised: 450,
    goal: 800,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop',
    type: 'medical'
  }
];
