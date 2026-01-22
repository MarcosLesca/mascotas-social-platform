import Link from "next/link";
import { ScrollAnimation } from "@/components/animations/ScrollAnimation";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <ScrollAnimation animation="fadeInUp">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <span className="text-white font-bold text-xl">MS</span>
                </div>
                <div>
                  <span className="font-bold text-xl text-white block">Mascotas</span>
                  <span className="font-bold text-xl text-emerald-400 block">San Justo</span>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Plataforma responsable que une a nuestra comunidad para proteger y ayudar 
                a las mascotas que más lo necesitan.
              </p>
              
              {/* Trust indicators */}
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-gray-400">Confiable</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                  <span className="text-gray-400">Verificado</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-6">
              <h3 className="font-bold text-white text-lg mb-4">Servicios</h3>
              <div className="space-y-3">
              <Link href="/perdidas" className="block text-gray-400 hover:text-emerald-400 transition-colors duration-200 py-2 interactive">
                Mascotas Perdidas
              </Link>
              <Link href="/adopcion" className="block text-gray-400 hover:text-emerald-400 transition-colors duration-200 py-2 interactive">
                Adopción Responsable
              </Link>
              <Link href="/donaciones" className="block text-gray-400 hover:text-emerald-400 transition-colors duration-200 py-2 interactive">
                Ayuda Comunitaria
              </Link>
              <Link href="/publicar" className="block text-gray-400 hover:text-emerald-400 transition-colors duration-200 py-2 interactive">
                Publicar
              </Link>
              </div>
            </div>

            {/* Resources */}
            <div className="space-y-6">
              <h3 className="font-bold text-white text-lg mb-4">Recursos</h3>
              <div className="space-y-3">
                <a href="#" className="block text-gray-400 hover:text-sky-400 transition-colors duration-200 py-2 interactive">
                  Cómo Publicar
                </a>
                <a href="#" className="block text-gray-400 hover:text-sky-400 transition-colors duration-200 py-2 interactive">
                  Consejos de Seguridad
                </a>
                <a href="#" className="block text-gray-400 hover:text-sky-400 transition-colors duration-200 py-2 interactive">
                  Guía de Adopción
                </a>
                <a href="#" className="block text-gray-400 hover:text-sky-400 transition-colors duration-200 py-2 interactive">
                  Preguntas Frecuentes
                </a>
              </div>
            </div>

            {/* Contact & Legal */}
            <div className="space-y-6">
              <h3 className="font-bold text-white text-lg mb-4">Legal y Contacto</h3>
              <div className="space-y-3">
                <a href="#" className="block text-gray-400 hover:text-rose-400 transition-colors duration-200 py-2 interactive">
                  Términos de Uso
                </a>
                <a href="#" className="block text-gray-400 hover:text-rose-400 transition-colors duration-200 py-2 interactive">
                  Política de Privacidad
                </a>
                <a href="#" className="block text-gray-400 hover:text-rose-400 transition-colors duration-200 py-2 interactive">
                  Contacto
                </a>
                <a href="#" className="block text-gray-400 hover:text-rose-400 transition-colors duration-200 py-2 interactive">
                  Reportar Abuso
                </a>
              </div>
            </div>
          </div>

          {/* Developer Branding Section */}
          <div className="border-t border-gray-700 pt-12">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0">
              <div className="text-center md:text-left space-y-2">
                <p className="text-gray-400 text-sm">
                  © {currentYear} Mascotas San Justo. Todos los derechos reservados.
                </p>
                <p className="text-gray-500 text-xs">
                  Plataforma creada con responsabilidad y compromiso animal.
                </p>
              </div>

              <ScrollAnimation animation="fadeInRight" delay={200}>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400 text-sm">Desarrollado con ❤️ por</span>
                  <div className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl border border-gray-600 hover:border-gray-500 transition-all duration-300 hover:scale-105 group interactive">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                      <span className="text-white font-bold text-sm">L&amp;M</span>
                    </div>
                    <div className="text-left">
                      <div className="text-white font-bold text-sm">L&amp;M Desarrollo Web</div>
                      <div className="text-gray-400 text-xs">Soluciones Digitales</div>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </ScrollAnimation>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-xs text-gray-500">
              <span>San Justo, Santa Fe</span>
              <span>•</span>
              <span>Argentina</span>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Tiempo de actividad: 99.9%</span>
              <span>•</span>
              <span>Última actualización: Hoy</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}