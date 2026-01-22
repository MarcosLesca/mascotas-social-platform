import Link from "next/link";

const features = [
  {
    icon: "🐕",
    title: "Mascotas Perdidas",
    description: "Publica y busca mascotas perdidas en tu zona",
    href: "/perdidas",
    color: "bg-orange-100 hover:bg-orange-200"
  },
  {
    icon: "🏠", 
    title: "Adopción",
    description: "Encuentra un hogar para mascotas necesitadas",
    href: "/adopcion",
    color: "bg-blue-100 hover:bg-blue-200"
  },
  {
    icon: "❤️",
    title: "Donaciones", 
    description: "Solicita ayuda para el cuidado de mascotas",
    href: "/donaciones",
    color: "bg-pink-100 hover:bg-pink-200"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ¿Necesitas ayuda?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Te ofrecemos diferentes secciones para que encuentres exactamente lo que necesitas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {features.map((feature) => (
            <Link 
              key={feature.title}
              href={feature.href}
              className={cn(
                "block p-8 rounded-2xl text-center transition-all duration-300 hover:scale-105",
                feature.color
              )}
            >
              <div className="text-6xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function cn(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}