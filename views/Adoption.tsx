
import React, { useState, useMemo, useEffect } from 'react';
import { fetchApprovedAdoptionPets } from '../services/adoptionPetsService';
import PetCard from '../components/PetCard';
import PetDetailModal from '../components/PetDetailModal';
import ReportAdoptionPetModal from '../components/ReportAdoptionPetModal';
import { Pet } from '../types';

interface AdoptionFilters {
  species: string[];
  age: string[];
  size: string[];
  gender: string[];
  searchTerm: string;
}

interface AdoptionProps {
  onToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info', duration?: number, showAcceptButton?: boolean) => void;
}

const Adoption: React.FC<AdoptionProps> = ({ onToast }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AdoptionFilters>({
    species: [],
    age: [],
    size: [],
    gender: [],
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
        onToast('No se pudieron cargar las mascotas en adopción. Revisa la conexión.', 'error');
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

    // Filtro por tamaño
    if (filters.size.length > 0) {
      filtered = filtered.filter(pet => {
        if (!pet.size) return false;
        return filters.size.includes(pet.size);
      });
    }

    // Filtro por género
    if (filters.gender.length > 0) {
      filtered = filtered.filter(pet => {
        if (!pet.gender) return false;
        return filters.gender.includes(pet.gender);
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
        onToast(`Tu solicitud de adopción para ${pet.name} fue enviada correctamente. El dueño te contactará pronto.`, 'success', 0, true);
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
    onToast('Tu publicación fue enviada correctamente.\n\nSerá revisada por LyM desarrollo web antes de hacerse visible en Mascotas SJ.\n\nPodrás verla publicada una vez que sea aprobada.', 'success', 0, true);
  };

  const handleReportError = (msg: string) => {
    onToast(msg, 'error');
  };

  const clearFilters = () => {
    setFilters({
      species: [],
      age: [],
      size: [],
      gender: [],
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

  const hasActiveFilters = filters.species.length > 0 || filters.size.length > 0 || filters.gender.length > 0 || filters.searchTerm;

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 pb-6 sm:pb-10 flex flex-col gap-6 sm:gap-8 lg:gap-10">
      <div className="max-w-3xl mx-auto text-center mt-4 sm:mt-6 px-2">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 sm:mb-4">Algunos todavía esperan su primera oportunidad</h1>
        <p className="text-lg sm:text-xl text-gray-800 font-sans italic">
          Adopción
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
        <aside className="col-span-1 xl:col-span-3">
          <div className="bg-white dark:bg-white/5 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-accent-teal/5 xl:sticky xl:top-24">
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold">Filtros</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-[11px] sm:text-xs font-bold text-primary hover:underline"
                >
                  LIMPIAR
                </button>
              )}
            </div>

            {/* Búsqueda */}
            <div className="mb-6 sm:mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full px-4 py-2.5 sm:py-3 bg-white dark:bg-white/10 border border-accent-teal/10 rounded-xl focus:ring-2 focus:ring-primary text-sm"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
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
                <p className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Tamaño</p>
                <div className="flex flex-wrap gap-2">
                  {['Pequeño', 'Mediano', 'Grande'].map(s => (
                    <button
                      key={s}
                      onClick={() => {
                        const sizeMap: { [key: string]: string } = { 'Pequeño': 'small', 'Mediano': 'medium', 'Grande': 'large' };
                        setFilters(prev => ({
                          ...prev,
                          size: prev.size.includes(sizeMap[s])
                            ? prev.size.filter(sz => sz !== sizeMap[s])
                            : [...prev.size, sizeMap[s]]
                        }));
                      }}
                       className={`px-3 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all ${
                        filters.size.includes(s === 'Pequeño' ? 'small' : s === 'Mediano' ? 'medium' : 'large')
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
                <p className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Género</p>
                <div className="flex flex-wrap gap-2">
                  {['Macho', 'Hembra'].map(g => (
                    <button
                      key={g}
                      onClick={() => {
                        const genderMap: { [key: string]: string } = { 'Macho': 'male', 'Hembra': 'female' };
                        setFilters(prev => ({
                          ...prev,
                          gender: prev.gender.includes(genderMap[g])
                            ? prev.gender.filter(gn => gn !== genderMap[g])
                            : [...prev.gender, genderMap[g]]
                        }));
                      }}
                       className={`px-3 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all ${
                        filters.gender.includes(g === 'Macho' ? 'male' : 'female')
                          ? 'bg-primary text-background-dark'
                          : 'bg-accent-teal/5 text-gray-800 hover:bg-accent-teal/10'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button className="w-full mt-8 sm:mt-10 bg-primary text-background-dark py-3.5 sm:py-4 rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
              {filteredPets.length} Mascotas
            </button>
          </div>
        </aside>

        <div className="col-span-1 xl:col-span-9">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 gap-4">
              <p className="text-gray-800 text-sm sm:text-base font-medium">Cargando mascotas en adopción...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {/* Publicar Card - First Position */}
              <div
                className="bg-primary/5 dark:bg-primary/10 border-4 border-dashed border-primary/20 rounded-2xl flex flex-col items-center justify-center p-6 sm:p-8 text-center group cursor-pointer hover:bg-primary/10 transition-all min-h-[300px] sm:min-h-[380px]"
                onClick={handleOpenReportModal}
              >
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-800">Publicar en adopción</h3>
                <p className="text-sm text-gray-600 mb-6 sm:mb-8 max-w-[220px]">
                  Ayuda a encontrar un hogar definitivo. Creá una publicación ahora.
                </p>
                <button
                  className="bg-primary text-background-dark w-full md:w-auto px-6 sm:px-10 py-3 rounded-xl font-black shadow-lg hover:shadow-primary/30 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenReportModal();
                  }}
                >
                  COMENZAR
                </button>
              </div>

              {filteredPets.map(pet => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  onAction={handlePetAction}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}

          {/* Sin resultados */}
          {!loading && filteredPets.length === 0 && (
            <div className="bg-white dark:bg-white/5 rounded-2xl sm:rounded-3xl border border-accent-teal/5 p-6 sm:p-10 lg:p-12 text-center mt-6 sm:mt-8">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">No encontramos mascotas con esos filtros</h3>
              <p className="text-sm sm:text-base text-gray-800 mb-6">Intenta ajustar los filtros para ver más opciones</p>
              <button onClick={clearFilters} className="bg-primary text-background-dark w-full sm:w-auto px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all">
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
            variant="fullscreen"
          />

          {/* Modal de publicación */}
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
