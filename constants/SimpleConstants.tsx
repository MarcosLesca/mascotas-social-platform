import React, { useState } from 'react';

// Mock data simple sin errores
const MOCK_PETS = [
  {
    id: '1',
    name: 'Max',
    breed: 'Beagle',
    species: 'dog',
    gender: 'male',
    status: 'lost',
    urgency: true,
    timeLabel: 'hace 2 horas',
    location: 'Parque Oakwood',
    distance: '2.4 km',
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=800&auto=format&fit=crop',
    description: 'Perdido cerca del parque, responde al nombre de Max. Es muy amigable y está perdido.'
  },
  {
    id: '2',
    name: 'Luna',
    breed: 'Doméstica',
    species: 'cat',
    gender: 'female',
    status: 'found',
    timeLabel: 'hace 1 día',
    location: 'Calle Willow',
    distance: '0.8 km',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1?q=80&w=800&auto=format&fit=crop',
    description: 'Encontrada por vecinos y ahora está a salvo. Es muy tranquila.'
  }
];

const MOCK_CAMPAIGNS = [
  {
    id: 'c1',
    title: 'Cirugía para Max: Recuperación de Pata',
    description: 'Mascota con fractura en pata que necesita cirugía ortopédica especializada.',
    raised: 1250,
    goal: 2000,
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=800&auto=format&fit=crop',
    urgency: true,
    type: 'medical'
  }
];

export { MOCK_PETS, MOCK_CAMPAIGNS };
export type { Pet, DonationCampaign };