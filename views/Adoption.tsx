
import React, { useState, useMemo, useEffect } from 'react';
import { fetchApprovedAdoptionPets } from '../services/adoptionPetsService';
import PetCard from '../components/PetCard';
import PetDetailModal from '../components/PetDetailModal';
import ReportAdoptionPetModal from '../components/ReportAdoptionPetModal';
import { Pet } from '../types';

interface AdoptionFilters {
  species: string[];
  age: string[];
  energy: string;
  searchTerm: string;
}

interface AdoptionProps {
  onToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

const Adoption: React.FC<AdoptionProps> = ({ onToast }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AdoptionFilters>({
    species: [],
    age: [],
    energy: 'Medio',
    searchTerm: ''
  });
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchApprovedAdoptionPets().then(({ data, error }) => {
      if (cancelled) return;
      setLoading(false);
      if (error) {
        onToast('No se pudieron cargar las mascotas en adopciÃ³n. Revisa la conexiÃ³n.', 'error');
        return;
      }
      setPets(data);
    });
    return () => { cancelled = true; };
  }, [onToast]);

  // Filtrar mascotas según los filtros seleccionados
  const filteredPets = useMemo(() => {
    let filtered = pets;

    // Filtro por especie
    if (filters.species.length > 0) {
      const speciesMap: { [key: string]: string } = {
        'Perros': 'dog',
        'Gatos': 'cat',
        'Aves': 'bird',
        'Otros': 'other'
      };
      const normalizeSpecies = (value: string) => {
        const normalized = value.toLowerCase();
        if (normalized.startsWith('perr')) return 'dog';
        if (normalized.startsWith('gat')) return 'cat';
        if (normalized.startsWith('ave')) return 'bird';
        if (normalized.startsWith('other')) return 'other';
        return value;
      };
      const selectedSpecies = filters.species.map(s => speciesMap[s]).filter(Boolean);
      filtered = filtered.filter(pet => selectedSpecies.includes(normalizeSpecies(pet.species)));
    }

    // Filtro por edad
    if (filters.age.length > 0) {
      filtered = filtered.filter(pet => {
        if (!pet.age) return false;
        
        const ageLower = pet.age.toLowerCase();
        return filters.age.some(filterAge => {
          switch (filterAge) {
            case 'Cachorro':
              return ageLower.includes('año') && parseInt(ageLower) <= 2 || ageLower.includes('mes');
            case 'Joven':
              return ageLower.includes('año') && parseInt(ageLower) > 2 && parseInt(ageLower) <= 5;
            case 'Adulto':
              return ageLower.includes('año') && parseInt(ageLower) > 5 && parseInt(ageLower) <= 10;
            case 'Senior':
              return ageLower.includes('año') && parseInt(ageLower) > 10;
            default:
              return false;
          }
        });
      });
    }

    // Filtro por búsqueda
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(pet => 
        pet.name.toLowerCase().includes(searchLower) ||
        pet.breed.toLowerCase().includes(searchLower) ||
        pet.description?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [filters, pets]);

  const handlePetAction = (pet: Pet, action: string) => {
    switch (action) {
      case 'view':
        setSelectedPet(pet);
        setShowModal(true);
        break;
      case 'adopt':
        onToast(`Solicitud de adopción para ${pet.name} enviada. Te contactaremos pronto.`, 'success');
        break;
      default:
        console.log('Acción:', action, 'para:', pet.name);
    }
  };

  const handleViewDetails = (pet: Pet) => {
    setSelectedPet(pet);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPet(null);
  };

  const handleOpenReportModal = () => {
    setShowReportModal(true);
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
  };

  const handleReportSubmit = () => {
    onToast('PublicaciÃ³n enviada. Un administrador la revisarÃ¡ pronto; si la aprueba, se publicarÃ¡ aquÃ­.', 'success');
  };

  const handleReportError = (msg: string) => {
    onToast(msg, 'error');
  };

  const clearFilters = () => {
    setFilters({
      species: [],
      age: [],
      energy: 'Medio',
      searchTerm: ''
    });
  };

  const toggleSpecies = (species: string) => {
    setFilters(prev => ({
      ...prev,
      species: prev.species.includes(species)
        ? prev.species.filter(s => s !== species)
        : [...prev.species, species]
    }));
  };

  const toggleAge = (age: string) => {
    setFilters(prev => ({
      ...prev,
      age: prev.age.includes(age)
        ? prev.age.filter(a => a !== age)
        : [...prev.age, age]
    }));
  };

  const hasActiveFilters = filters.species.length > 0 || filters.age.length > 0 || filters.searchTerm;

  return (
    <div className="flex flex-col gap-10">
      <div className="max-w-3xl mx-auto text-center mt-6">
        <h1 className="text-5xl font-black tracking-tight mb-4">Algunos todavía esperan su primera oportunidad</h1>
        <p className="text-xl text-gray-800 font-sans italic">
          Adopción
        </p>
      </div>

      <div className="grid grid-cols-12 gap-10">
        <aside className="col-span-12 lg:col-span-3">
          <div className="bg-white dark:bg-white/5 p-8 rounded-3xl border border-accent-teal/5 sticky top-24">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold">Filtros</h3>
              {hasActiveFilters && (
                <button 
                  onClick={clearFilters}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  LIMPIAR
                </button>
              )}
            </div>

            {/* Búsqueda */}
            <div className="mb-8">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Buscar por nombre, raza..."
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 border border-accent-teal/10 rounded-xl focus:ring-2 focus:ring-primary text-sm"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <p className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Especie</p>
                <div className="flex flex-wrap gap-2">
                  {['Perros', 'Gatos', 'Aves', 'Otros'].map(s => (
                    <button 
                      key={s} 
                      onClick={() => toggleSpecies(s)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                        filters.species.includes(s) 
                          ? 'bg-primary text-background-dark' 
                          : 'bg-accent-teal/5 text-gray-800 hover:bg-accent-teal/10'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Edad</p>
                <div className="space-y-3">
                  {['Cachorro', 'Joven', 'Adulto', 'Senior'].map(age => (
                    <label key={age} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={filters.age.includes(age)}
                        onChange={() => toggleAge(age)}
                        className="rounded text-primary focus:ring-primary border-accent-teal/20" 
                      />
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">{age}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Energía</p>
                <div className="grid grid-cols-3 gap-2">
                  {['Bajo', 'Medio', 'Alto'].map(e => (
                    <button 
                      key={e} 
                      onClick={() => setFilters({...filters, energy: e})}
                      className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${
                        filters.energy === e 
                          ? 'bg-primary text-background-dark' 
                          : 'bg-accent-teal/5 text-gray-800 hover:bg-accent-teal/10'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button className="w-full mt-10 bg-primary text-background-dark py-4 rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
              {filteredPets.length} Mascotas
            </button>
          </div>
        </aside>

        <div className="col-span-12 lg:col-span-9">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <p className="text-gray-800 font-medium">Cargando mascotas en adopción…</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredPets.map(pet => (
                <PetCard 
                  key={pet.id} 
                  pet={pet} 
                  onAction={handlePetAction}
                  onViewDetails={handleViewDetails}
                />
              ))}

              <div
                className="bg-primary/5 dark:bg-primary/10 border-4 border-dashed border-primary/20 rounded-2xl flex flex-col items-center justify-center p-8 text-center group cursor-pointer hover:bg-primary/10 transition-all min-h-[380px]"
                onClick={handleOpenReportModal}
              >
                <h3 className="text-xl font-bold mb-3">Publicar en adopción</h3>
                <p className="text-sm text-gray-800 mb-8 max-w-[220px]">
                  Ayuda a encontrar un hogar definitivo. Creá una publicación ahora.
                </p>
                <button
                  className="bg-primary text-background-dark px-10 py-3 rounded-xl font-black shadow-lg hover:shadow-primary/30 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenReportModal();
                  }}
                >
                  COMENZAR
                </button>
              </div>
            </div>
          )}

          {/* Sin resultados */}
          {!loading && filteredPets.length === 0 && (
            <div className="bg-white dark:bg-white/5 rounded-3xl border border-accent-teal/5 p-12 text-center mt-8">
              <h3 className="text-2xl font-bold mb-2">No encontramos mascotas con esos filtros</h3>
              <p className="text-gray-800 mb-6">Intenta ajustar los filtros para ver más opciones</p>
              <button onClick={clearFilters} className="bg-primary text-background-dark px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all">
                Limpiar filtros
              </button>
            </div>
          )}



          {/* Modal de detalles */}
          <PetDetailModal
            pet={selectedPet}
            isOpen={showModal}
            onClose={handleCloseModal}
            onAction={handlePetAction}
          />

          {/* Modal de publicaciÃ³n */}
          <ReportAdoptionPetModal
            isOpen={showReportModal}
            onClose={handleCloseReportModal}
            onSubmit={handleReportSubmit}
            onError={handleReportError}
          />
        </div>
      </div>
    </div>
  );
};

export default Adoption;
