import React, { useState } from 'react';
import { useApp } from '../context/SimpleAppContext';
import { MOCK_CAMPAIGNS } from '../constants/SimpleConstants';

const LostPets: React.FC = () => {
  const { dispatch, state } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPets = state.pets.filter(pet => pet.status === 'lost');
  const searchFiltered = filteredPets.filter(pet => 
    pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2">Mascotas Perdidas</h1>
        <p className="text-lg text-gray-800">
          Ayuda a reunir hoy a <span className="text-primary font-bold">{searchFiltered.length}</span> mascotas con sus familias.
        </p>
      </div>

      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Busca por nombre, raza o ubicación..."
          className="w-full px-6 py-4 bg-white dark:bg-white/5 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex gap-4 flex-wrap mb-6">
        <button className="px-4 py-2.5 bg-white dark:bg-white/5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
          <span>🔎 Filtros</span>
        </button>
        <button className="px-4 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors">
          <span>🔍 Buscar</span>
        </button>
        <button className="px-4 py-2.5 text-gray-600 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors">
          <span>✨ Limpiar</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {searchFiltered.map(pet => (
          <div key={pet.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <div className="aspect-video bg-gray-200 rounded-2xl mb-4 overflow-hidden">
              <img 
                src={pet.image} 
                className="w-full h-full object-cover" 
                alt={pet.name}
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold">{pet.name}</h3>
                  <p className="text-sm text-gray-600">{pet.breed}</p>
                </div>
                <span className="bg-red-400 text-white text-xs px-2 py-1 rounded-full font-bold">
                  URGENTE
                </span>
              </div>
            </div>
              
              {pet.description && (
                <p className="text-gray-600 text-sm mb-4">{pet.description}</p>
              )}
              
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => {
                    dispatch({
                      type: 'ADD_NOTIFICATION',
                      payload: {
                        type: 'success',
                        message: `Gracias por reportar avistamiento de ${pet.name}. Contactaremos al dueño.`
                      }
                    });
                  }}
                  className="flex-1 bg-red-400 text-white py-3 rounded-xl font-bold text-center transition-colors"
                >
                  🐾 He visto a {pet.name}
                </button>
                <button className="px-4 border border-gray-300 rounded-xl hover:bg-gray-50">
                  <span className="text-gray-600">🔄 Compartir</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Botón para agregar */}
        <div className="bg-primary/10 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold mb-4">¿Perdiste a alguien?</h3>
          <p className="text-gray-800 mb-4">
            Publica ahora mismo para que la comunidad pueda ayudar
          </p>
          <button 
            onClick={() => dispatch({ type: 'OPEN_MODAL', payload: 'reportLostPet' })}
            className="bg-primary text-background-dark px-6 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            🐾 Reportar Mascota Perdida
          </button>
        </div>
      </div>
    </div>
  );
};

export default LostPets;