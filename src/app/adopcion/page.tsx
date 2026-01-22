import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";

export default function AdopcionPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Mascotas en Adopción
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encuentra un nuevo amigo que necesita un hogar lleno de amor
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <div className="text-center text-blue-600">
            <p>🏠 Filtros de adopción próximamente</p>
          </div>
        </div>

        {/* Grid de publicaciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="bg-blue-100 h-48 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-6xl">🐕</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Amigo #{i}</h3>
              <p className="text-gray-600 text-sm mb-4">Descripción del amigo que busca hogar...</p>
              <div className="text-sm text-gray-500">
                <p>📍 Montevideo</p>
                <p>📅 Publicado hace 1 semana</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}