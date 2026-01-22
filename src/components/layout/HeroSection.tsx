import Link from "next/link";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
            Encuentra a tu mascota
            <span className="block text-blue-500">en San Justo</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Plataforma gratuita para publicar mascotas perdidas, en adopción o solicitar donaciones. 
            Conectamos a personas que aman los animales en San Justo y alrededores.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link 
              href="/perdidas"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg"
            >
              🐕 Buscar en San Justo
            </Link>
            <Link 
              href="/publicar"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg"
            >
              📝 Publicar Ahora
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}