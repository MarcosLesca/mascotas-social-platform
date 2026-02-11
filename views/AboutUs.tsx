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

      
    </div>
  );
};

export default AboutUs;
