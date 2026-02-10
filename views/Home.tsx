
import React, { useState } from 'react';
import { MOCK_LOST_PETS, MOCK_CAMPAIGNS } from '../constants';
import HeroZoom from '../components/home/HeroZoom';
import DonationModal from '../components/DonationModal';
import ReportLostPetModal from '../components/ReportLostPetModal';
import { DonationCampaign } from '../types';

interface HomeProps {
  onToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

const Home: React.FC<HomeProps> = ({ onToast }) => {
  const [selectedCampaign, setSelectedCampaign] = useState<DonationCampaign | null>(null);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const handleDonateClick = (campaign: DonationCampaign) => {
    setSelectedCampaign(campaign);
    setShowDonationModal(true);
  };

  const handleCloseDonationModal = () => {
    setShowDonationModal(false);
    setSelectedCampaign(null);
  };

  const handleDonation = (amount: number, data: any) => {
    console.log('Donación procesada:', { amount, campaign: selectedCampaign?.title, data });
    onToast(`¡Gracias por tu donación de $${amount}!`, 'success');
  };

  const handleOpenReportModal = () => {
    setShowReportModal(true);
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
  };

  const handleReportSubmit = (data: any) => {
    console.log('Nuevo reporte:', data);
    onToast('Reporte publicado exitosamente', 'success');
  };

  return (
    <>
      {/* Hero Section con GSAP Animation - Full Width */}
      <HeroZoom />
      
      {/* Contenido Principal - Posicionado para que aparezca durante la animación */}
      <div className="relative px-4 md:px-10 lg:px-20 py-8" style={{ marginTop: '200vh' }}>
        <div className="grid grid-cols-12 gap-8 max-w-[1440px] mx-auto">
      {/* Sidebar - Impact & Links */}
      <aside className="hidden xl:flex col-span-3 flex-col gap-6">
        <div className="bg-white dark:bg-white/5 p-6 rounded-3xl shadow-sm border border-accent-teal/5">
          <h3 className="font-bold text-lg mb-4">Nuestro Impacto</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xl font-bold leading-none">1,248</p>
              <p className="text-[10px] text-accent-teal uppercase font-bold tracking-wider">Mascotas Reunidas</p>
            </div>
            <div>
              <p className="text-xl font-bold leading-none">452</p>
              <p className="text-[10px] text-accent-teal uppercase font-bold tracking-wider">Adopciones Exitosas</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/5 p-6 rounded-3xl shadow-sm border border-accent-teal/5">
          <h3 className="font-bold text-xs text-accent-teal uppercase tracking-widest mb-4">Enlaces Rápidos</h3>
          <nav className="flex flex-col gap-3 text-sm font-medium">
            {['Ser Voluntario', 'Mapa de Veterinarios', 'Grupos Locales'].map((link) => (
              <a key={link} className="hover:text-primary transition-colors" href="#">
                {link}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Feed */}
      <section className="col-span-12 lg:col-span-8 xl:col-span-6 flex flex-col gap-6">
        {/* Urgent Lost Pet - Hero Card */}
        <article className="bg-white dark:bg-white/5 rounded-3xl overflow-hidden shadow-sm border-l-8 border-urgent-red border-t border-r border-b border-accent-teal/5">
          <div className="md:flex h-full">
            <div className="md:w-2/5 h-64 md:h-auto overflow-hidden">
              <img 
                src={MOCK_LOST_PETS[0].image} 
                className="w-full h-full object-cover" 
                alt="Urgent Lost Pet"
              />
            </div>
            <div className="p-8 md:w-3/5 flex flex-col">
              <div className="flex justify-between items-start mb-3 text-xs text-accent-teal font-medium">
                <span className="text-[10px] font-black uppercase tracking-widest bg-urgent-red text-white px-3 py-1 rounded-full">ALERTA CRÍTICA</span>
                <span>hace 2 horas</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Buddy - Golden Retriever</h3>
              <p className="text-sm text-accent-teal mb-6">
                North Park, entrada Calle 5
              </p>
              <div className="mt-auto flex gap-3">
                <button className="flex-1 bg-primary hover:bg-primary/90 text-background-dark py-3 rounded-xl font-bold text-sm shadow-md transition-all">He visto a Buddy</button>
                <button className="px-4 border border-accent-teal/20 rounded-xl hover:bg-accent-teal/5 text-sm font-bold">Compartir</button>
              </div>
            </div>
          </div>
        </article>

        {/* Donation Campaign Card */}
        <article className="bg-white dark:bg-white/5 rounded-3xl p-8 shadow-sm border border-accent-teal/5">
          <div className="flex items-center gap-4 mb-6">
            <div>
              <h4 className="font-bold">Rescate Animal Centro</h4>
              <p className="text-xs text-accent-teal">Publicado hace 5 horas</p>
            </div>
            <span className="ml-auto bg-primary/10 text-accent-teal text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">AYUDA URGENTE</span>
          </div>
          <h3 className="text-xl font-bold mb-3">{MOCK_CAMPAIGNS[0].title}</h3>
          <p className="text-sm text-accent-teal/80 mb-8 leading-relaxed">{MOCK_CAMPAIGNS[0].description}</p>
          <div className="mb-8">
            <div className="flex justify-between text-xs font-bold mb-3">
              <span className="text-primary">${MOCK_CAMPAIGNS[0].raised} recaudados</span>
              <span className="text-accent-teal">Meta: ${MOCK_CAMPAIGNS[0].goal}</span>
            </div>
            <div className="h-3 w-full bg-accent-teal/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary shadow-[0_0_10px_#13ec5b]" 
                style={{ width: `${(MOCK_CAMPAIGNS[0].raised / MOCK_CAMPAIGNS[0].goal) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => handleDonateClick(MOCK_CAMPAIGNS[0])}
              className="flex-1 bg-primary text-background-dark py-4 rounded-2xl font-bold text-sm shadow-lg hover:opacity-90 transition-all"
            >
              Colaborar ahora
            </button>
            <button className="flex-1 border border-accent-teal/20 py-4 rounded-2xl font-bold text-sm hover:bg-accent-teal/5 transition-colors">
              Leer historia
            </button>
          </div>
        </article>

        {/* Success Story Card */}
        <article className="bg-white dark:bg-white/5 rounded-3xl overflow-hidden shadow-sm border border-accent-teal/5">
          <div className="aspect-[21/9] relative">
            <img src="https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover" alt="Success Story" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-8">
              <span className="bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block">Historias de Éxito</span>
              <h3 className="text-white text-3xl font-bold">El nuevo hogar de Luna</h3>
            </div>
          </div>
          <div className="p-8">
            <p className="text-base italic text-accent-teal/90 mb-6 leading-relaxed">
              "Después de 200 días en el refugio, Luna finalmente encontró a su familia ideal. ¡Ahora tiene un gran jardín y dos hermanos humanos para jugar!"
            </p>
          <div className="flex items-center justify-between">
              <div className="text-xs text-accent-teal">
                142 personas apoyaron esta historia · 18 comentarios
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* Right Column - Actions & Alerts */}
      <aside className="hidden lg:flex lg:col-span-4 xl:col-span-3 flex-col gap-6">
        <button 
          onClick={handleOpenReportModal}
          className="w-full bg-primary text-background-dark h-16 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all active:scale-95"
        >
          Reportar Mascota Perdida
        </button>

        <div className="bg-white dark:bg-white/5 rounded-3xl shadow-sm border border-accent-teal/5 overflow-hidden">
          <div className="p-6 border-b border-accent-teal/5 flex justify-between items-center">
            <h3 className="font-bold">
              Casos Destacados
            </h3>
          </div>
          <div className="p-4 space-y-2">
            {[
              { name: 'Oliver', breed: 'Gato Atigrado', location: 'West Hills', img: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=200&auto=format&fit=crop' },
              { name: 'Rex', breed: 'Fondo de Ayuda', location: '85% alcanzado', img: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?q=80&w=200&auto=format&fit=crop' },
              { name: 'Bella', breed: 'Beagle en Adopción', location: '2 años', img: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=200&auto=format&fit=crop' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 hover:bg-accent-teal/5 rounded-2xl cursor-pointer transition-colors group">
                <div className="size-14 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-sm truncate">{item.name}</p>
                  <p className="text-xs text-accent-teal">{item.location}</p>
                </div>
              </div>
            ))}
          </div>
          <a className="block text-center p-5 text-sm font-bold text-primary hover:bg-primary/5 border-t border-accent-teal/5 transition-colors" href="#">Ver todos los casos</a>
        </div>

        <div className="bg-slate-900 rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
          <div className="h-64 relative overflow-hidden">
            <iframe
              title="Mapa San Justo, Santa Fe, Argentina"
              src="https://www.google.com/maps?q=San+Justo+Santa+Fe+Argentina&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-300 leading-relaxed text-center">
              Mapa centrado en San Justo, Santa Fe, Argentina.
            </p>
          </div>
        </div>
      </aside>
      </div>
      </div>

      {/* Donation Modal */}
      <DonationModal
        campaign={selectedCampaign}
        isOpen={showDonationModal}
        onClose={handleCloseDonationModal}
        onDonate={handleDonation}
      />

      {/* Report Modal */}
      <ReportLostPetModal
        isOpen={showReportModal}
        onClose={handleCloseReportModal}
        onSubmit={handleReportSubmit}
      />
    </>
  );
};

export default Home;
