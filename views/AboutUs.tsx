import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 space-y-20">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center size-20 bg-primary/10 rounded-3xl mb-4">
          <span className="material-symbols-outlined text-5xl text-primary">pets</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-primary to-accent-teal bg-clip-text text-transparent">
          Sobre Nosotros
        </h1>
        <p className="text-xl text-accent-teal max-w-3xl mx-auto leading-relaxed">
          Conectando corazones para el bienestar de nuestras mascotas
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-white dark:bg-white/5 rounded-3xl p-10 border border-accent-teal/10 shadow-xl">
        <div className="flex items-start gap-6">
          <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-3xl text-primary">favorite</span>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black">Nuestra Misión</h2>
            <p className="text-accent-teal leading-relaxed text-lg">
              En <span className="font-bold text-primary">PetWelfare</span>, creemos que cada mascota merece un hogar lleno de amor y cuidado.
              Nuestra plataforma nace con el propósito de crear una comunidad solidaria donde las personas puedan ayudarse mutuamente
              en la búsqueda de mascotas perdidas, facilitar adopciones responsables y apoyar a quienes necesitan ayuda para el cuidado
              de sus compañeros peludos.
            </p>
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <div className="bg-gradient-to-br from-primary/5 to-accent-teal/5 rounded-3xl p-10 border border-accent-teal/10">
        <div className="flex items-start gap-6">
          <div className="size-16 bg-accent-teal/10 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-3xl text-accent-teal">visibility</span>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black">Nuestra Visión</h2>
            <p className="text-accent-teal leading-relaxed text-lg">
              Aspiramos a ser la plataforma líder en bienestar animal, donde la tecnología y la solidaridad se unen para crear
              un impacto positivo en la vida de miles de mascotas y sus familias. Queremos construir un futuro donde ninguna
              mascota esté perdida, abandonada o sin los cuidados que necesita.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="space-y-8">
        <h2 className="text-4xl font-black text-center">Nuestros Valores</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: 'volunteer_activism',
              title: 'Solidaridad',
              description: 'Fomentamos la ayuda mutua y la colaboración entre nuestra comunidad para el bienestar animal.'
            },
            {
              icon: 'verified_user',
              title: 'Transparencia',
              description: 'Operamos con total claridad en nuestras acciones, especialmente en las campañas de donación.'
            },
            {
              icon: 'psychology',
              title: 'Responsabilidad',
              description: 'Promovemos la tenencia responsable de mascotas y el compromiso con su cuidado integral.'
            },
            {
              icon: 'diversity_3',
              title: 'Comunidad',
              description: 'Creamos espacios de encuentro donde las personas comparten el amor por los animales.'
            },
            {
              icon: 'health_and_safety',
              title: 'Bienestar',
              description: 'Priorizamos la salud física y emocional de cada mascota en nuestra plataforma.'
            },
            {
              icon: 'eco',
              title: 'Sostenibilidad',
              description: 'Buscamos soluciones duraderas que generen un impacto positivo a largo plazo.'
            }
          ].map((value, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-white/5 rounded-2xl p-8 border border-accent-teal/10 hover:border-primary/30 transition-all hover:shadow-lg group"
            >
              <div className="size-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl text-primary">{value.icon}</span>
              </div>
              <h3 className="text-xl font-black mb-3">{value.title}</h3>
              <p className="text-accent-teal text-sm leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How We Work Section */}
      <div className="bg-white dark:bg-white/5 rounded-3xl p-10 border border-accent-teal/10 shadow-xl">
        <h2 className="text-3xl font-black mb-8 text-center">¿Cómo Funcionamos?</h2>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="size-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
              1
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Publicación de Anuncios</h3>
              <p className="text-accent-teal">
                Los usuarios pueden reportar mascotas perdidas, publicar mascotas en adopción o solicitar ayuda mediante campañas de donación.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="size-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
              2
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Conexión Directa</h3>
              <p className="text-accent-teal">
                Facilitamos el contacto directo entre las personas interesadas, sin intermediarios innecesarios.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="size-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
              3
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Transparencia en Donaciones</h3>
              <p className="text-accent-teal">
                No administramos dinero. Solo publicamos las necesidades con toda la información bancaria para que las donaciones sean directas y transparentes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-primary to-accent-teal rounded-3xl p-12 text-center text-white shadow-2xl">
        <h2 className="text-4xl font-black mb-4">Únete a Nuestra Comunidad</h2>
        <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
          Juntos podemos hacer la diferencia en la vida de miles de mascotas.
          Cada acción cuenta, cada ayuda suma.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-white text-primary px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg">
            Reportar Mascota Perdida
          </button>
          <button className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform border-2 border-white/30">
            Ver Adopciones
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="text-center space-y-4 pb-10">
        <h3 className="text-2xl font-black">¿Tienes Preguntas?</h3>
        <p className="text-accent-teal">
          Estamos aquí para ayudarte. Contáctanos en{' '}
          <a href="mailto:contacto@petwelfare.com" className="text-primary font-bold hover:underline">
            contacto@petwelfare.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
