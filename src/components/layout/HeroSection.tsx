import Link from "next/link";
import { ScrollAnimation } from "@/components/animations/ScrollAnimation";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-emerald-50/50 via-white to-sky-50/50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center space-y-8 max-w-5xl mx-auto">
          <ScrollAnimation animation="fadeInDown">
            {/* Trust Badge */}
            <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-6 py-3 rounded-full text-sm font-medium hover-lift">
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
              <span>Plataforma Confiable y Responsable</span>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation animation="fadeInUp" delay={200}>
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 leading-tight tracking-tight">
                Juntos encontramos
                <span className="block text-emerald-600 font-bold text-gradient-animate">respuestas amorosas</span>
              </h1>
              
              <div className="max-w-4xl mx-auto">
                <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 leading-relaxed font-light">
                  Conectamos familias con sus mascotas perdidas, coordinamos adopciones responsables 
                  y facilitamos la ayuda comunitaria en San Justo y toda la región.
                </p>
              </div>
            </div>
          </ScrollAnimation>

          <ScrollAnimation animation="fadeInUp" delay={400}>
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto py-8">
              <div className="text-center group hover-lift">
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 group-hover:scale-110 transition-transform">500+</div>
                <div className="text-gray-600 font-medium">Reencuentros</div>
              </div>
              <div className="text-center group hover-lift">
                <div className="text-3xl md:text-4xl font-bold text-sky-600 group-hover:scale-110 transition-transform">200+</div>
                <div className="text-gray-600 font-medium">Adopciones</div>
              </div>
              <div className="text-center group hover-lift">
                <div className="text-3xl md:text-4xl font-bold text-rose-600 group-hover:scale-110 transition-transform">1000+</div>
                <div className="text-gray-600 font-medium">Familias Ayudadas</div>
              </div>
            </div>
          </ScrollAnimation>

          <ScrollAnimation animation="fadeInUp" delay={600}>
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
              <Link 
                href="/perdidas"
                className="group relative bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 overflow-hidden btn-shine"
              >
                <span className="relative z-10">Buscar Mascota Perdida</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </Link>
              
              <Link 
                href="/publicar"
                className="group relative bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 overflow-hidden btn-shine"
              >
                <span className="relative z-10">Publicar Ahora</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </Link>
            </div>

            {/* Secondary CTAs */}
            <div className="flex flex-wrap justify-center gap-6 pt-8">
              <Link 
                href="/adopcion"
                className="text-emerald-600 hover:text-emerald-700 font-semibold text-base flex items-center space-x-2 transition-all duration-200 hover:scale-105"
              >
                <span>Adopción Responsable</span>
                <span className="text-emerald-400 transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link 
                href="/donaciones"
                className="text-sky-600 hover:text-sky-700 font-semibold text-base flex items-center space-x-2 transition-all duration-200 hover:scale-105"
              >
                <span>Ayuda Comunitaria</span>
                <span className="text-sky-400 transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}