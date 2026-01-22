import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";

export default function DonacionesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-sky-950/20 dark:via-black dark:to-emerald-950/20">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-sky-100 text-sky-800 px-6 py-3 rounded-full text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-sky-600 rounded-full animate-pulse"></div>
            <span>Asistencia Activa</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            Ayuda
            <span className="block text-sky-600 font-bold">Comunitaria</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Coordinamos donaciones y asistencia veterinaria para garantizar el bienestar 
            de mascotas vulnerables y apoyar a sus cuidadores en momentos difíciles.
          </p>
        </div>

        {/* Emergency Banner */}
        <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-3xl p-8 mb-12 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Emergencia Activa</h3>
              <p className="text-red-100">3 casos urgentes necesitan asistencia veterinaria inmediata</p>
            </div>
            <button className="bg-white text-red-600 px-8 py-4 rounded-2xl font-bold hover:bg-red-50 transition-colors">
              Ver Emergencias
            </button>
          </div>
        </div>

        {/* Help Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border-2 border-sky-200 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-sky-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-xl">$</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Donaciones Económicas</h3>
            <p className="text-gray-600 text-sm">Apoyo directo para tratamientos veterinarios</p>
          </div>
          
          <div className="bg-white border-2 border-emerald-200 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-xl">+</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Voluntariado</h3>
            <p className="text-gray-600 text-sm">Tiempo y transporte para ayudar a las mascotas</p>
          </div>
          
          <div className="bg-white border-2 border-rose-200 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-rose-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-xl">🏥</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Asistencia Veterinaria</h3>
            <p className="text-gray-600 text-sm">Descuentos y atención preferencial</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-gradient-to-br from-sky-50 to-sky-100 border-2 border-sky-200 rounded-3xl p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Tipo de Ayuda</label>
              <select className="w-full px-4 py-3 border border-sky-200 rounded-xl bg-white focus:ring-2 focus:ring-sky-500 focus:border-transparent">
                <option>Todos</option>
                <option>Emergencias</option>
                <option>Tratamientos</option>
                <option>Alimentos</option>
                <option>Transporte</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Urgencia</label>
              <select className="w-full px-4 py-3 border border-sky-200 rounded-xl bg-white focus:ring-2 focus:ring-sky-500 focus:border-transparent">
                <option>Todas</option>
                <option>Críticas</option>
                <option>Urgentes</option>
                <option>Programadas</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Ubicación</label>
              <input 
                type="text" 
                placeholder="Ciudad o barrio"
                className="w-full px-4 py-3 border border-sky-200 rounded-xl bg-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Results Stats */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-gray-600">
            <span className="font-semibold">12</span> casos necesitan ayuda
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Ordenar por:</span>
            <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm">
              <option>Urgencia</option>
              <option>Reciente</option>
              <option>Cercanía</option>
            </select>
          </div>
        </div>

        {/* Grid de solicitudes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => {
            const urgencyLevel = i <= 2 ? 'critical' : i <= 4 ? 'urgent' : 'scheduled';
            const urgencyColors = {
              critical: 'bg-red-500 text-white',
              urgent: 'bg-orange-500 text-white', 
              scheduled: 'bg-sky-500 text-white'
            };
            const urgencyLabels = {
              critical: 'Emergencia Crítica',
              urgent: 'Urgente',
              scheduled: 'Programada'
            };

            return (
              <div key={i} className="bg-white border-2 border-sky-200 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                {/* Status Badge */}
                <div className={`${urgencyColors[urgencyLevel]} px-6 py-3 text-center font-bold text-sm`}>
                  {urgencyLabels[urgencyLevel]}
                </div>
                
                <div className="p-8">
                  {/* Amount needed */}
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-gray-900">
                      ${5000 * i}
                    </div>
                    <div className="text-sm text-gray-500">necesitados</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-sky-500 h-2 rounded-full" 
                        style={{width: `${30 + i * 10}%`}}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{30 + i * 10}% recaudado</div>
                  </div>
                  
                  {/* Case Info */}
                  <h3 className="font-bold text-xl mb-4 text-gray-900">
                    {i === 1 ? "Cirugía de Emergencia" :
                     i === 2 ? "Tratamiento Crónico" :
                     i === 3 ? "Vacunación y Castración" :
                     `Caso de Asistencia #${i}`}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                    {i <= 2 ? 
                      "Mascota herida en accidente necesita intervención quirúrgica inmediata. El veterinario confirma que el pronóstico es bueno con tratamiento rápido." :
                      i <= 4 ?
                      "Rescatado de la calle con desnutrición severa y parásitos. Necesita tratamiento completo y plan de recuperación." :
                      "Colonia de gatos callejeros necesita vacunación masiva y programa de castración para controlar la sobrepoblación."
                    }
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-500 mb-6">
                    <p><span className="font-semibold">Mascota:</span> {i % 2 === 0 ? "Gata" : "Perro"} - {2 + i} años</p>
                    <p><span className="font-semibold">Ubicación:</span> San Justo, {i % 3 === 0 ? "Centro" : i % 3 === 1 ? "Norte" : "Sur"}</p>
                    <p><span className="font-semibold">Publicado:</span> {i === 1 ? "Hoy" : `Hace ${i} días`}</p>
                  </div>
                  
                  <button className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-2xl font-bold transition-all duration-200 hover:scale-105">
                    Ofrecer Ayuda
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Help CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-sky-500 to-emerald-500 rounded-3xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">¿Quieres ser un colaborador permanente?</h3>
          <p className="text-xl mb-8 text-sky-100">
            Únete a nuestra red de voluntarios y profesionales que marcan la diferencia
          </p>
          <button className="bg-white text-sky-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-sky-50 transition-colors">
            Ser Voluntario
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}