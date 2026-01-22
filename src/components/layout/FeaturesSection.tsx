import Link from "next/link";

const features = [
  {
    title: "Mascotas Perdidas",
    description: "Publica y busca mascotas perdidas en tu zona con responsabilidad y compromiso",
    href: "/perdidas",
    bgGradient: "bg-gradient-to-br from-rose-50 to-rose-100",
    borderColor: "border-rose-200",
    hoverBorder: "hover:border-rose-300"
  },
  {
    title: "Adopción Responsable",
    description: "Encuentra un hogar amoroso para mascotas que necesitan una segunda oportunidad",
    href: "/adopcion",
    bgGradient: "bg-gradient-to-br from-emerald-50 to-emerald-100", 
    borderColor: "border-emerald-200",
    hoverBorder: "hover:border-emerald-300"
  },
  {
    title: "Ayuda Comunitaria",
    description: "Coordina donaciones y asistencia para el cuidado de mascotas vulnerables",
    href: "/donaciones",
    bgGradient: "bg-gradient-to-br from-sky-50 to-sky-100",
    borderColor: "border-sky-200", 
    hoverBorder: "hover:border-sky-300"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-neutral-50/50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-6 py-3 rounded-full text-sm font-medium mb-6">
            <span>Nuestros Servicios</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            ¿Cómo podemos
            <span className="block text-emerald-600 font-bold">ayudarte hoy?</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            Ofrecemos una plataforma integral y responsable para diferentes necesidades de nuestra comunidad animal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Link 
              key={feature.title}
              href={feature.href}
              className={cn(
                "group relative block p-10 rounded-3xl text-center transition-all duration-700 hover:scale-105 border-2 overflow-hidden interactive",
                feature.bgGradient,
                feature.borderColor,
                feature.hoverBorder,
                "shadow-lg hover:shadow-2xl"
              )}
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative z-10">
                {/* Icon Container */}
                <div className="w-20 h-20 mx-auto mb-8 bg-white/90 backdrop-blur rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl shadow-inner"></div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-base font-light">
                  {feature.description}
                </p>
                
                {/* Learn more indicator */}
                <div className="mt-8 inline-flex items-center space-x-2 text-gray-500 group-hover:text-gray-700 transition-colors interactive">
                  <span className="text-sm font-medium">Explorar</span>
                  <span className="text-lg">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Trust Section */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center space-x-8 bg-white px-12 py-8 rounded-3xl shadow-lg border border-neutral-200">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
              <span className="text-gray-700 font-medium">100% Gratuito</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-sky-500 rounded-full"></div>
              <span className="text-gray-700 font-medium">Verificado</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-rose-500 rounded-full"></div>
              <span className="text-gray-700 font-medium">Comunidad Real</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function cn(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}