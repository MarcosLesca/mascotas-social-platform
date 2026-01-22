import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🐾</span>
              </div>
              <span className="font-bold text-lg">MascotasSanJusto</span>
            </div>
            <p className="text-gray-400 text-sm">
              Ayudamos a reunir mascotas perdidas con sus dueños y encontrarles un hogar amoroso en San Justo y alrededores.
            </p>
          </div>

          {/* Links principales */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Secciones</h3>
            <div className="space-y-2">
              <Link href="/perdidas" className="block text-gray-400 hover:text-white text-sm transition-colors">
                Mascotas Perdidas
              </Link>
              <Link href="/adopcion" className="block text-gray-400 hover:text-white text-sm transition-colors">
                Adopción
              </Link>
              <Link href="/donaciones" className="block text-gray-400 hover:text-white text-sm transition-colors">
                Donaciones
              </Link>
            </div>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Ayuda</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">
                Cómo publicar
              </a>
              <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">
                Consejos de seguridad
              </a>
              <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">
                Contacto
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 MascotasSanJusto. Hecho con ❤️ para ayudar a nuestras mascotas
            </p>
        </div>
      </div>
    </footer>
  );
}