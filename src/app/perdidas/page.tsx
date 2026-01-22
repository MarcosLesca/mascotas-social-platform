import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";

import { PetCard, PetCardSkeleton } from "@/components/cards/PetCard";

export default function PerdidasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/30 via-white to-orange-50/30">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-rose-100 text-rose-800 px-6 py-3 rounded-full text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-rose-600 rounded-full animate-pulse"></div>
            <span>Búsqueda Activa</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            Mascotas
            <span className="block text-rose-600 font-bold">Perdidas</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Trabajamos incansablemente para reunir a las mascotas con sus familias mediante 
            reportes precisos, coordinación comunitaria y difusión responsable.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-gradient-to-br from-rose-50 to-rose-100 border-2 border-rose-200 rounded-3xl p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Tipo de Mascota</label>
              <select className="w-full px-4 py-3 border border-rose-200 rounded-xl bg-white focus:ring-2 focus:ring-rose-500 focus:border-transparent">
                <option>Todos</option>
                <option>Perros</option>
                <option>Gatos</option>
                <option>Otros</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Tamaño</label>
              <select className="w-full px-4 py-3 border border-rose-200 rounded-xl bg-white focus:ring-2 focus:ring-rose-500 focus:border-transparent">
                <option>Todos</option>
                <option>Pequeños</option>
                <option>Medianos</option>
                <option>Grandes</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Ubicación</label>
              <input 
                type="text" 
                placeholder="Ciudad o barrio"
                className="w-full px-4 py-3 border border-rose-200 rounded-xl bg-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">&nbsp;</label>
              <button className="w-full bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 interactive">
                Buscar
              </button>
            </div>
          </div>
        </div>

        {/* Results Stats */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-gray-600">
            <span className="font-semibold">24</span> publicaciones encontradas
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Ordenar por:</span>
            <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm">
              <option>Más reciente</option>
              <option>Más antiguo</option>
              <option>Cercanía</option>
            </select>
          </div>
        </div>

        {/* Grid de publicaciones - usando placeholder data con el nuevo componente */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {/* Mostramos algunos skeletons para demostrar el loading state */}
          <PetCardSkeleton />
          <PetCardSkeleton />
          
          {/* Cards demostrativos - reemplazar con datos reales */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border-2 border-rose-200 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
              {/* Status Badge */}
              <div className="bg-rose-500 text-white px-6 py-3 text-center font-bold text-sm">
                Perdida
              </div>
              
              <div className="p-8">
                {/* Image Placeholder */}
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-6">
                  <img 
                    src="/images/placeholder-lost.svg" 
                    alt="Mascota perdida"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="space-y-4">
                  <h3 className="font-bold text-2xl text-gray-900 leading-tight">
                    {i === 1 ? "Max - Labrador" : 
                     i === 2 ? "Luna - Gata Siamés" :
                     i === 3 ? "Rocky - Caniche" :
                     `Mascota Perdida #${i}`}
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="font-medium">Tipo:</span>
                      <span>{i % 2 === 0 ? "Gato" : "Perro"}</span>
                      <span>·</span>
                      <span>Edad: {2 + i} años</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="font-medium">Tamaño:</span>
                      <span>{i % 3 === 0 ? "Pequeño" : i % 3 === 1 ? "Mediano" : "Grande"}</span>
                      <span>·</span>
                      <span>{i % 2 === 0 ? "Hembra" : "Macho"}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 line-clamp-3 leading-relaxed">
                    Se desapareció el día 15/01 cerca del parque central. Es muy amigable y responde al nombre de 
                    {i === 1 ? "Max" : i === 2 ? "Luna" : "la mascota"}. Tiene collar con identificación y está medicada.
                  </p>
                  
                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                    <span>San Justo, Centro</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      {i === 1 ? "Hoy" : i === 2 ? "Ayer" : `Hace ${i} días`}
                    </span>
              <span className="text-sm font-medium text-rose-600 interactive">
                Contactar →
              </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-16">
          <button className="bg-white border-2 border-rose-200 text-rose-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-rose-50 transition-all duration-200 interactive">
            Cargar Más Publicaciones
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}