import React, { useState, useMemo, useEffect } from 'react';
import { fetchApprovedLostPets } from '../services/lostPetsService';
import PetCard from '../components/PetCard';
import PetDetailModal from '../components/PetDetailModal';
import ReportLostPetModal from '../components/ReportLostPetModal';
import { Pet } from '../types';

interface FilterState {
  species: string;
  timeRange: string;
  location: string;
  color: string;
  urgency: boolean;
}

interface LostPetsProps {
  onToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

const LostPets: React.FC<LostPetsProps> = ({ onToast }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    species: '',
    timeRange: '',
    location: '',
    color: '',
    urgency: false,
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
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(pet => 
        pet.name.toLowerCase().includes(searchLower) ||
        pet.breed.toLowerCase().includes(searchLower) ||
        pet.location.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por especie
    if (filters.species) {
      filtered = filtered.filter(pet => {
        const speciesMap: { [key: string]: string } = {
          'Perros': 'dog',
          'Gatos': 'cat',
          'Aves': 'bird'
        };
        return pet.species === speciesMap[filters.species];
      });
    }

    // Filtro por urgencia
    if (filters.urgency) {
      filtered = filtered.filter(pet => pet.urgency);
    }

    // Filtro por rango de tiempo
    if (filters.timeRange) {
      const now = new Date();
      filtered = filtered.filter(pet => {
        if (!pet.timeLabel) return true;
        
        const hours = parseInt(pet.timeLabel.match(/\d+/)?.[0] || '0');
        const unit = pet.timeLabel.includes('hora') ? 'hours' : 'days';
        
        if (filters.timeRange === 'Últimas 24h' && unit === 'hours' && hours <= 24) return true;
        if (filters.timeRange === 'Última semana' && (unit === 'hours' || (unit === 'days' && hours <= 7))) return true;
        if (filters.timeRange === 'Último mes' && (unit === 'hours' || (unit === 'days' && hours <= 30))) return true;
        
        return false;
      });
    }

    return filtered;
  }, [pets, searchTerm, filters]);

  const clearFilters = () => {
    setFilters({
      species: '',
      timeRange: '',
      location: '',
      color: '',
      urgency: false
    });
    setSearchTerm('');
  };

  const hasActiveFilters = filters.species || filters.timeRange || filters.location || filters.color || filters.urgency || searchTerm;

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
    onToast('Reporte enviado. Un administrador lo revisará pronto; si lo aprueba, se publicará aquí.', 'success');
  };

  const handleReportError = (msg: string) => {
    onToast(msg, 'error');
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-4xl font-extrabold mb-2">Búsqueda de Mascotas Perdidas</h2>
          <p className="text-accent-teal text-lg">
            Ayuda a reunir hoy a <span className="text-primary font-bold">{pets.length}</span> mascotas con sus familias.
            {hasActiveFilters && (
              <span className="ml-2 text-sm">({filteredPets.length} resultados)</span>
            )}
          </p>
        </div>
        <div className="flex gap-2 bg-accent-teal/5 p-1 rounded-2xl">
          <button 
            onClick={() => setViewMode('grid')}
            className={`px-6 py-2 rounded-xl font-bold text-sm transition-colors ${
              viewMode === 'grid' ? 'bg-white dark:bg-white/10 shadow-sm' : 'text-accent-teal hover:text-primary'
            }`}
          >
            Cuadrícula
          </button>
          <button 
            onClick={() => setViewMode('map')}
            className={`px-6 py-2 rounded-xl font-bold text-sm transition-colors ${
              viewMode === 'map' ? 'bg-white dark:bg-white/10 shadow-sm' : 'text-accent-teal hover:text-primary'
            }`}
          >
            Mapa
          </button>
        </div>
      </div>

      <div className="relative">
        <input 
          type="text" 
          placeholder="Busca por raza, color o zona..."
          className="w-full px-6 pr-6 py-5 bg-white dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-primary shadow-sm text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-3 pb-2 overflow-x-auto scrollbar-hide">
        {/* Filtro Especie */}
        <div className="relative">
          <button 
            onClick={() => {
              const speciesOptions = ['', 'Perros', 'Gatos', 'Aves'];
              const currentIndex = speciesOptions.indexOf(filters.species);
              const nextIndex = (currentIndex + 1) % speciesOptions.length;
              setFilters({...filters, species: speciesOptions[nextIndex]});
            }}
            className={`px-5 py-2.5 border rounded-xl text-sm font-bold flex items-center gap-2 transition-colors ${
              filters.species 
                ? 'bg-primary text-background-dark border-primary' 
                : 'bg-white dark:bg-white/5 border-accent-teal/10 hover:border-primary'
            }`}
          >
            {filters.species || 'Especie'}
            {filters.species && <span className="text-xs underline">Limpiar</span>}
          </button>
        </div>

        {/* Filtro Fecha */}
        <div className="relative">
          <button 
            onClick={() => {
              const timeOptions = ['', 'Últimas 24h', 'Última semana', 'Último mes'];
              const currentIndex = timeOptions.indexOf(filters.timeRange);
              const nextIndex = (currentIndex + 1) % timeOptions.length;
              setFilters({...filters, timeRange: timeOptions[nextIndex]});
            }}
            className={`px-5 py-2.5 border rounded-xl text-sm font-bold flex items-center gap-2 transition-colors ${
              filters.timeRange 
                ? 'bg-primary text-background-dark border-primary' 
                : 'bg-white dark:bg-white/5 border-accent-teal/10 hover:border-primary'
            }`}
          >
            {filters.timeRange || 'Fecha'}
            {filters.timeRange && <span className="text-xs underline">Limpiar</span>}
          </button>
        </div>

        {/* Filtro Ubicación */}
        <div className="relative">
          <button 
            onClick={() => {
              const locationOptions = ['', 'Cerca', 'A menos de 5km', 'A menos de 10km'];
              const currentIndex = locationOptions.indexOf(filters.location);
              const nextIndex = (currentIndex + 1) % locationOptions.length;
              setFilters({...filters, location: locationOptions[nextIndex]});
            }}
            className={`px-5 py-2.5 border rounded-xl text-sm font-bold flex items-center gap-2 transition-colors ${
              filters.location 
                ? 'bg-primary text-background-dark border-primary' 
                : 'bg-white dark:bg-white/5 border-accent-teal/10 hover:border-primary'
            }`}
          >
            {filters.location || 'Ubicación'}
            {filters.location && <span className="text-xs underline">Limpiar</span>}
          </button>
        </div>

        {/* Filtro Urgencia */}
        <button 
          onClick={() => setFilters({...filters, urgency: !filters.urgency})}
          className={`px-5 py-2.5 border rounded-xl text-sm font-bold flex items-center gap-2 transition-colors ${
            filters.urgency 
              ? 'bg-urgent-red text-white border-urgent-red' 
              : 'bg-white dark:bg-white/5 border-accent-teal/10 hover:border-primary'
          }`}
        >
          Urgente
          {filters.urgency && <span className="text-xs underline">Quitar</span>}
        </button>

        {/* Limpiar filtros */}
        {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="ml-auto text-primary text-sm font-bold hover:underline"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Vista de Mapa (placeholder sin iconos) */}
      {viewMode === 'map' && (
        <div className="bg-white dark:bg-white/5 rounded-3xl border border-accent-teal/5 p-8 text-center min-h-[500px] flex flex-col items-center justify-center">
          <h3 className="text-2xl font-bold mb-2">Vista de Mapa</h3>
          <p className="text-accent-teal mb-6">Mapa interactivo con ubicaciones de mascotas perdidas</p>
          <p className="text-sm text-accent-teal/80">Encontramos {filteredPets.length} mascotas en tu zona</p>
        </div>
      )}

      {/* Vista de Cuadrícula */}
      {viewMode === 'grid' && (
        <>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <p className="text-accent-teal font-medium">Cargando mascotas perdidas…</p>
            </div>
          ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredPets.map(pet => (
            <PetCard 
              key={pet.id} 
              pet={pet} 
              onAction={handlePetAction}
              onViewDetails={handleViewDetails}
            />
          ))}
          
          {/* Report Placeholder Card */}
          <div className="bg-primary/5 dark:bg-primary/10 border-4 border-dashed border-primary/20 rounded-2xl flex flex-col items-center justify-center p-8 text-center group cursor-pointer hover:bg-primary/10 transition-all min-h-[400px]"
               onClick={handleOpenReportModal}>
            <h3 className="text-xl font-bold mb-3">¿Has perdido a alguien?</h3>
            <p className="text-sm text-accent-teal mb-8 max-w-[220px]">Reporta ahora y activa la red de búsqueda en tu zona.</p>
            <button className="bg-primary text-background-dark px-10 py-3 rounded-xl font-black shadow-lg hover:shadow-primary/30 transition-all" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenReportModal();
                    }}>
              COMENZAR
            </button>
          </div>
        </div>
          )}
        </>
      )}

      {/* Sin resultados (solo con filtros activos) */}
      {!loading && hasActiveFilters && filteredPets.length === 0 && viewMode === 'grid' && (
        <div className="bg-white dark:bg-white/5 rounded-3xl border border-accent-teal/5 p-12 text-center">
          <h3 className="text-2xl font-bold mb-2">No encontramos resultados</h3>
          <p className="text-accent-teal mb-6">Intenta ajustar los filtros o el término de búsqueda</p>
          <button onClick={clearFilters} className="bg-primary text-background-dark px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all">
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Modal de detalles */}
      <PetDetailModal
        pet={selectedPet}
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
        onAction={handlePetAction}
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
