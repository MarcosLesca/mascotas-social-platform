import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";

export default function PerdidasPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Mascotas Perdidas
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Busca entre las publicaciones de mascotas perdidas o ayuda a encontrarlas
          </p>
        </div>

        {/* Filtros (placeholder) */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="text-center text-gray-500">
            <p>🔍 Filtros de búsqueda próximamente</p>
          </div>
        </div>

        {/* Grid de publicaciones (placeholder) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
              <h3 className="font-semibold text-lg mb-2">Mascota perdida #{i}</h3>
              <p className="text-gray-600 text-sm mb-4">Descripción de la mascota...</p>
              <div className="text-sm text-gray-500">
                <p>📍 Montevideo</p>
                <p>📅 Hace 2 días</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}