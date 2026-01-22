import { ScrollAnimation } from "@/components/animations/ScrollAnimation";

export function SuccessStories() {
  const stories = [
    {
      id: 1,
      title: "Max volvió a casa",
      description: "Después de 3 semanas, Max fue encontrado gracias a la publicación en la plataforma. Una vecina lo reconoció y contactó a su familia.",
      image: "/stories/max.jpg",
      days: 21,
      location: "San Justo Centro"
    },
    {
      id: 2, 
      title: "Luna encontró amor",
      description: "Luna fue rescatada de la calle y hoy vive con una familia que la vio en nuestra sección de adopción.",
      image: "/stories/luna.jpg",
      days: 7,
      location: "San Justo Norte"
    },
    {
      id: 3,
      title: "Rocky fue ayudado",
      description: "La comunidad se unió para cubrir su tratamiento veterinario. Hoy está completamente recuperado.",
      image: "/stories/rocky.jpg", 
      days: 14,
      location: "San Justo Sur"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-emerald-50/40 via-white to-sky-50/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation animation="fadeInUp">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-6 py-3 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
              <span>Historias Reales</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Historias
              <span className="block text-emerald-600 dark:text-emerald-400 font-bold">Felices</span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Cada día familias se reencuentran y mascotas encuentran hogares amorosos gracias a nuestra comunidad.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <ScrollAnimation 
              key={story.id} 
              animation="fadeInUp" 
              delay={index * 200}
            >
              <div className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 card-reveal interactive">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-sky-200"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/30 rounded-2xl backdrop-blur-sm"></div>
                  </div>
                  
                  {/* Success badge */}
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    ✓ Reunido
                  </div>
                </div>

                <div className="p-8">
                  {/* Time & Location */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>Hace {story.days} días</span>
                    <span>{story.location}</span>
                  </div>

                  {/* Content */}
                  <h3 className="font-bold text-2xl text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors">
                    {story.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {story.description}
                  </p>

                  {/* Thank you message */}
                  <div className="bg-emerald-50 rounded-2xl p-4 text-center">
                    <p className="text-emerald-700 font-medium text-sm">
                      ¡Gracias a nuestra comunidad por hacer posible esta historia!
                    </p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        {/* Call to Action */}
        <ScrollAnimation animation="fadeInUp" delay={600}>
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-3xl p-8 text-white">
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-2">¿Quieres compartir tu historia?</h3>
                <p className="text-emerald-100">Tu experiencia puede inspirar a otros a ayudar</p>
              </div>
              <button className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-bold hover:bg-emerald-50 transition-colors interactive">
                Compartir Historia
              </button>
            </div>
          </div>
        </ScrollAnimation>

        {/* Stats banner */}
        <ScrollAnimation animation="fadeInUp" delay={800}>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center border border-emerald-200">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">523</div>
                  <div className="text-sm text-gray-600">Reencuentros Exitosos</div>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center border border-sky-200">
                  <div className="text-3xl font-bold text-sky-600 mb-2">187</div>
                  <div className="text-sm text-gray-600">Adopciones Felices</div>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center border border-rose-200">
                  <div className="text-3xl font-bold text-rose-600 mb-2">89</div>
                  <div className="text-sm text-gray-600">Casos de Ayuda</div>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center border border-purple-200">
                  <div className="text-3xl font-bold text-purple-600 mb-2">12k+</div>
                  <div className="text-sm text-gray-600">Familias Activas</div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}