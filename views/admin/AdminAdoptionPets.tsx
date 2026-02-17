import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  fetchPendingAdoptionPetReports,
  approveAdoptionPetReport,
  rejectAdoptionPetReport,
} from '../../services/adoptionPetsService';
import type { AdoptionPetReportRow } from '../../types';

// Colores de marca
const COLORS = {
  bg: '#203553',
  bgLight: '#2a4266',
  text: '#ecdbbd',
  textMuted: '#ecdbbd/70',
  accent: '#ecdbbd',
  urgent: '#dc2626',
  success: '#22c55e',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDateOnly(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const speciesLabel: Record<string, string> = {
  dog: 'Perro',
  cat: 'Gato',
  bird: 'Ave',
  other: 'Otro',
};

const sizeLabel: Record<string, string> = {
  small: 'Chico',
  medium: 'Mediano',
  large: 'Grande',
};

const AdminAdoptionPets: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<AdoptionPetReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acting, setActing] = useState<string | null>(null);
  
  // Modal de detalles
  const [selectedReport, setSelectedReport] = useState<AdoptionPetReportRow | null>(null);
  
  // Modales de confirmación
  const [confirmAction, setConfirmAction] = useState<{
    type: 'approve' | 'reject';
    reportId: string;
    reportName: string;
  } | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchPendingAdoptionPetReports().then(({ data, error: e }) => {
      setLoading(false);
      if (e) {
        setError(e.message);
        return;
      }
      setReports(data);
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleApprove = async () => {
    if (!confirmAction || !user?.id) return;
    const { reportId } = confirmAction;
    setActing(reportId);
    const { error: e } = await approveAdoptionPetReport(reportId, user.id);
    setActing(null);
    setConfirmAction(null);
    if (e) {
      setError(e.message);
      return;
    }
    setReports(prev => prev.filter(r => r.id !== reportId));
    setSelectedReport(null);
  };

  const handleReject = async () => {
    if (!confirmAction || !user?.id) return;
    const { reportId } = confirmAction;
    setActing(reportId);
    const { error: e } = await rejectAdoptionPetReport(reportId, user.id);
    setActing(null);
    setConfirmAction(null);
    if (e) {
      setError(e.message);
      return;
    }
    setReports(prev => prev.filter(r => r.id !== reportId));
    setSelectedReport(null);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f6f2' }}>
      <div className="p-4 md:p-6 lg:p-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-black" style={{ color: COLORS.bg }}>
                Adopcion
              </h1>
              <p className="text-sm font-medium mt-1" style={{ color: COLORS.bgLight }}>
                {reports.length} publicacion{reports.length !== 1 ? 'es' : ''} pendiente{reports.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Link
              to="/admin"
              type="button"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-bold text-sm transition-colors"
              style={{ 
                backgroundColor: `${COLORS.bg}15`, 
                color: COLORS.bg 
              }}
            >
              Volver
            </Link>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-center gap-2 p-4 rounded-xl mb-6"
              style={{ 
                backgroundColor: `${COLORS.urgent}10`, 
                color: COLORS.urgent 
              }}
            >
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div 
                className="w-8 h-8 border-4 rounded-full animate-spin"
                style={{ borderColor: COLORS.bg, borderTopColor: 'transparent' }}
              />
              <p className="font-medium" style={{ color: COLORS.bgLight }}>
                Cargando...
              </p>
            </div>
          ) : reports.length === 0 ? (
            <div 
              className="rounded-2xl border p-12 text-center"
              style={{ borderColor: `${COLORS.bg}15` }}
            >
              <h2 className="text-xl font-bold mb-2" style={{ color: COLORS.bg }}>
                No hay publicaciones pendientes
              </h2>
              <p style={{ color: COLORS.bgLight }}>
                Las nuevas publicaciones apareceran aqui.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map(r => (
                <div
                  key={r.id}
                  className="flex items-center gap-4 p-4 rounded-xl border shadow-sm"
                  style={{ 
                    backgroundColor: 'white', 
                    borderColor: `${COLORS.bg}15` 
                  }}
                >
                  {/* Thumbnail */}
                  <div 
                    className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden"
                    style={{ backgroundColor: `${COLORS.bg}10` }}
                  >
                    <img
                      src={r.image_url}
                      alt={r.pet_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Info minima */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold truncate" style={{ color: COLORS.bg }}>
                        {r.pet_name}
                      </h3>
                    </div>
                    <p className="text-sm truncate" style={{ color: COLORS.bgLight }}>
                      {r.breed} - {r.location}
                    </p>
                  </div>

                  {/* Boton ver solicitud */}
                  <button
                    type="button"
                    onClick={() => setSelectedReport(r)}
                    className="flex-shrink-0 px-4 py-2 rounded-lg font-bold text-sm transition-colors"
                    style={{ 
                      backgroundColor: COLORS.bg, 
                      color: COLORS.text 
                    }}
                  >
                    Ver solicitud
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Fullscreen */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: '#f8f6f2' }}>
          {/* Header del modal */}
          <div 
            className="flex items-center justify-between px-4 py-4 border-b"
            style={{ 
              backgroundColor: COLORS.bg, 
              borderColor: `${COLORS.text}30` 
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedReport(null)}
              className="font-bold text-sm"
              style={{ color: COLORS.text }}
            >
              ← Volver
            </button>
            <h2 className="font-bold" style={{ color: COLORS.text }}>
              Detalles de la solicitud
            </h2>
            <div className="w-16" /> {/* Spacer para centrar */}
          </div>

          {/* Contenido scrolleable */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-xl mx-auto space-y-6">
              {/* Imagen */}
              <div 
                className="aspect-video rounded-xl overflow-hidden"
                style={{ backgroundColor: `${COLORS.bg}10` }}
              >
                <img
                  src={selectedReport.image_url}
                  alt={selectedReport.pet_name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info del mascota */}
              <div className="bg-white rounded-xl p-5 shadow-sm border" style={{ borderColor: `${COLORS.bg}15` }}>
                <h3 className="text-xl font-black mb-4" style={{ color: COLORS.bg }}>
                  {selectedReport.pet_name}
                </h3>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold" style={{ color: COLORS.bgLight }}>Especie</p>
                    <p style={{ color: COLORS.bg }}>{speciesLabel[selectedReport.species]}</p>
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: COLORS.bgLight }}>Raza</p>
                    <p style={{ color: COLORS.bg }}>{selectedReport.breed}</p>
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: COLORS.bgLight }}>Genero</p>
                    <p style={{ color: COLORS.bg }}>{selectedReport.gender === 'male' ? 'Macho' : 'Hembra'}</p>
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: COLORS.bgLight }}>Edad</p>
                    <p style={{ color: COLORS.bg }}>{selectedReport.age || 'No especificada'}</p>
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: COLORS.bgLight }}>Tamaño</p>
                    <p style={{ color: COLORS.bg }}>{selectedReport.size ? sizeLabel[selectedReport.size] : 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: COLORS.bgLight }}>Color</p>
                    <p style={{ color: COLORS.bg }}>{selectedReport.color}</p>
                  </div>
                </div>
              </div>

              {/* Descripcion */}
              {selectedReport.description && (
                <div className="bg-white rounded-xl p-5 shadow-sm border" style={{ borderColor: `${COLORS.bg}15` }}>
                  <h4 className="font-bold mb-3" style={{ color: COLORS.bg }}>Descripcion</h4>
                  <p className="text-sm" style={{ color: COLORS.bg }}>{selectedReport.description}</p>
                </div>
              )}

              {/* Estado medico */}
              {selectedReport.med_status && selectedReport.med_status.length > 0 && (
                <div className="bg-white rounded-xl p-5 shadow-sm border" style={{ borderColor: `${COLORS.bg}15` }}>
                  <h4 className="font-bold mb-3" style={{ color: COLORS.bg }}>Estado medico</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedReport.med_status.map((status, idx) => (
                      <span
                        key={`${selectedReport.id}-med-${idx}`}
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{ 
                          backgroundColor: `${COLORS.bg}15`, 
                          color: COLORS.bg 
                        }}
                      >
                        {status}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Requisitos de adopcion */}
              {selectedReport.adoption_requirements && (
                <div className="bg-white rounded-xl p-5 shadow-sm border" style={{ borderColor: `${COLORS.bg}15` }}>
                  <h4 className="font-bold mb-3" style={{ color: COLORS.bg }}>Requisitos de adopcion</h4>
                  <p className="text-sm" style={{ color: COLORS.bg }}>{selectedReport.adoption_requirements}</p>
                </div>
              )}

              {/* Ubicacion */}
              <div className="bg-white rounded-xl p-5 shadow-sm border" style={{ borderColor: `${COLORS.bg}15` }}>
                <h4 className="font-bold mb-3" style={{ color: COLORS.bg }}>Ubicacion</h4>
                <p className="text-sm" style={{ color: COLORS.bg }}>{selectedReport.location}</p>
              </div>

              {/* Contacto */}
              <div className="bg-white rounded-xl p-5 shadow-sm border" style={{ borderColor: `${COLORS.bg}15` }}>
                <h4 className="font-bold mb-3" style={{ color: COLORS.bg }}>Contacto</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold" style={{ color: COLORS.bgLight }}>Nombre:</span>{' '}
                    <span style={{ color: COLORS.bg }}>{selectedReport.contact_name}</span>
                  </p>
                  <p>
                    <span className="font-semibold" style={{ color: COLORS.bgLight }}>Telefono:</span>{' '}
                    <a 
                      href={`tel:${selectedReport.contact_phone}`} 
                      style={{ color: COLORS.bg }}
                    >
                      {selectedReport.contact_phone}
                    </a>
                  </p>
                  {selectedReport.contact_email && (
                    <p>
                      <span className="font-semibold" style={{ color: COLORS.bgLight }}>Email:</span>{' '}
                      <span style={{ color: COLORS.bg }}>{selectedReport.contact_email}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Meta */}
              <p className="text-xs text-center" style={{ color: COLORS.bgLight }}>
                Enviado el {formatDate(selectedReport.submitted_at)}
              </p>
            </div>
          </div>

          {/* Footer con acciones */}
          <div 
            className="flex gap-3 p-4 border-t"
            style={{ 
              backgroundColor: 'white', 
              borderColor: `${COLORS.bg}15` 
            }}
          >
            <button
              type="button"
              onClick={() => setConfirmAction({ 
                type: 'reject', 
                reportId: selectedReport.id, 
                reportName: selectedReport.pet_name 
              })}
              disabled={!!acting}
              className="flex-1 py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
              style={{ 
                backgroundColor: `${COLORS.urgent}10`, 
                color: COLORS.urgent 
              }}
            >
              Rechazar
            </button>
            <button
              type="button"
              onClick={() => setConfirmAction({ 
                type: 'approve', 
                reportId: selectedReport.id, 
                reportName: selectedReport.pet_name 
              })}
              disabled={!!acting}
              className="flex-1 py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
              style={{ 
                backgroundColor: COLORS.bg, 
                color: COLORS.text 
              }}
            >
              Aprobar
            </button>
          </div>
        </div>
      )}

      {/* Mini modal de confirmacion */}
      {confirmAction && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <div 
            className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-2" style={{ color: COLORS.bg }}>
              {confirmAction.type === 'approve' ? 'Aprobar publicacion' : 'Rechazar publicacion'}
            </h3>
            <p className="text-sm mb-6" style={{ color: COLORS.bgLight }}>
              {confirmAction.type === 'approve' 
                ? `¿Estas seguro que deseas aprobar la publicacion de "${confirmAction.reportName}"? La mascota aparecera en el sitio.` 
                : `¿Estas seguro que deseas rechazar la publicacion de "${confirmAction.reportName}"? El responsable sera notificado.`}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm border transition-colors"
                style={{ 
                  borderColor: `${COLORS.bg}20`, 
                  color: COLORS.bg 
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmAction.type === 'approve' ? handleApprove : handleReject}
                disabled={!!acting}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white transition-colors disabled:opacity-50"
                style={{ 
                  backgroundColor: confirmAction.type === 'approve' ? COLORS.success : COLORS.urgent 
                }}
              >
                {acting ? 'Procesando...' : confirmAction.type === 'approve' ? 'Aprobar' : 'Rechazar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAdoptionPets;
