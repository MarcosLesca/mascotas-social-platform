import React, { useState, useMemo, useEffect } from 'react';
import { fetchApprovedLostPets } from '../services/lostPetsService';
import PetCard from '../components/PetCard';
import PetDetailModal from '../components/PetDetailModal';
import ReportLostPetModal from '../components/ReportLostPetModal';
import { Pet } from '../types';

interface FilterState {
  species: string[];
  age: string[];
  size: string[];
  gender: string[];
  urgency: boolean;
  searchTerm: string;
}

interface LostPetsProps {
  onToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info', duration?: number, showAcceptButton?: boolean) => void;
}

const LostPets: React.FC<LostPetsProps> = ({ onToast }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    species: [],
    age: [],
    size: [],
    gender: [],
    urgency: false,
    searchTerm: '',
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchApprovedLostPets().then(({ data, error }) => {
      if (cancelled) return;
      setLoading(false);
      if (error) {
        onToast('No se pudieron cargar las mascotas perdidas. Revisa la conexión.', 'error');
        return;
      }
      setPets(data);
    });
    return () => { cancelled = true; };
  }, [onToast]);

  // Filtrar y buscar mascotas
  const filteredPets = useMemo(() => {
    let filtered = pets;

    // Búsqueda por texto
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(pet =>
        pet.name.toLowerCase().includes(searchLower) ||
        pet.breed.toLowerCase().includes(searchLower) ||
        pet.location.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por especie
    if (filters.species.length > 0) {
      const speciesMap: { [key: string]: string } = {
        'Perros': 'dog',
        'Gatos': 'cat',
        'Aves': 'bird',
        'Otros': 'other'
      };
      const selectedSpecies = filters.species.map(s => speciesMap[s]).filter(Boolean);
      filtered = filtered.filter(pet => selectedSpecies.includes(pet.species));
    }

    // Filtro por edad (si el reporte tiene edad)
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

    // Filtro por urgencia
    if (filters.urgency) {
      filtered = filtered.filter(pet => pet.urgency);
    }

    return filtered;
  }, [pets, filters.searchTerm, filters]);

  const clearFilters = () => {
    setFilters({
      species: [],
      age: [],
      size: [],
      gender: [],
      urgency: false,
      searchTerm: ''
    });
  };

  const hasActiveFilters =
    filters.species.length > 0 ||
    filters.age.length > 0 ||
    filters.urgency ||
    !!filters.searchTerm;

  const toggleSpecies = (species: string) => {
    setFilters(prev => ({
      ...prev,
      species: prev.species.includes(species)
        ? prev.species.filter(s => s !== species)
        : [...prev.species, species],
    }));
  };

  const toggleAge = (age: string) => {
    setFilters(prev => ({
      ...prev,
      age: prev.age.includes(age)
        ? prev.age.filter(a => a !== age)
        : [...prev.age, age],
    }));
  };

  const handlePetAction = (pet: Pet, action: string) => {
    switch (action) {
      case 'view':
        setSelectedPet(pet);
        setShowDetailModal(true);
        break;
      case 'seen':
        onToast(`Gracias por reportar a ${pet.name}. Te contactaremos pronto.`, 'success');
        break;
      default:
        console.log('Acción:', action, 'para:', pet.name);
    }
  };

  const handleViewDetails = (pet: Pet) => {
    setSelectedPet(pet);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
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

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 pb-6 sm:pb-10 flex flex-col gap-6 sm:gap-8 lg:gap-10">
      <div className="max-w-3xl mx-auto text-center mt-4 sm:mt-6 px-2">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2">Ellos te siguen buscando</h2>
        <p className="text-gray-800 text-base sm:text-lg">
          Mascotas perdidas
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
                  placeholder="Buscar por nombre, raza o zona..."
                  className="w-full px-4 py-2.5 sm:py-3 bg-white dark:bg-white/10 border border-accent-teal/10 rounded-xl focus:ring-2 focus:ring-primary text-sm"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
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
                          ? 'bg-red-400 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
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
                          ? 'bg-red-400 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Urgencia</p>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.urgency}
                    onChange={(e) => setFilters({ ...filters, urgency: e.target.checked })}
                    className="rounded text-primary focus:ring-primary border-accent-teal/20"
                  />
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">
                    Mostrar solo casos urgentes
                  </span>
                </label>
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
              <p className="text-gray-800 text-sm sm:text-base font-medium">Cargando mascotas perdidas...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {/* Report Card - First Position */}
              <div className="bg-red-400/5 dark:bg-red-400/10 border-4 border-dashed border-red-400/30 rounded-2xl flex flex-col items-center justify-center p-6 sm:p-8 text-center group cursor-pointer hover:bg-red-400/10 transition-all min-h-[300px] sm:min-h-[380px]"
                   onClick={handleOpenReportModal}>
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-800">¿Has perdido a alguien?</h3>
                <p className="text-sm text-gray-600 mb-6 sm:mb-8 max-w-[220px]">Reporta ahora y activa la red de búsqueda en tu zona.</p>
                <button className="bg-red-400 text-white w-full md:w-auto px-6 sm:px-10 py-3 rounded-xl font-black shadow-lg hover:shadow-urgent-red/30 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenReportModal();
                        }}>
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

          {/* Sin resultados (solo con filtros activos) */}
          {!loading && hasActiveFilters && filteredPets.length === 0 && (
            <div className="bg-white dark:bg-white/5 rounded-2xl sm:rounded-3xl border border-accent-teal/5 p-6 sm:p-10 lg:p-12 text-center mt-6 sm:mt-8">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">No encontramos resultados</h3>
              <p className="text-sm sm:text-base text-gray-800 mb-6">Intenta ajustar los filtros o el término de búsqueda</p>
              <button onClick={clearFilters} className="bg-primary text-background-dark w-full sm:w-auto px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all">
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>


      {/* Modal de detalles */}
      <PetDetailModal
        pet={selectedPet}
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
        onAction={handlePetAction}
        variant="fullscreen"
      />

      {/* Modal de reporte */}
      <ReportLostPetModal
        isOpen={showReportModal}
        onClose={handleCloseReportModal}
        onSubmit={handleReportSubmit}
        onError={handleReportError}
      />
    </div>
  );
};

export default LostPets;
