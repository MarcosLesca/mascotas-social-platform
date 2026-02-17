import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  fetchPendingLostPetReports,
  fetchApprovedLostPetReports,
  approveLostPetReport,
  rejectLostPetReport,
} from '../../services/lostPetsService';
import type { LostPetReportRow } from '../../types';

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

const AdminLostPets: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<LostPetReportRow[]>([]);
  const [approvedReports, setApprovedReports] = useState<LostPetReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingApproved, setLoadingApproved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acting, setActing] = useState<string | null>(null);
  const [showApproved, setShowApproved] = useState(false);
  
  // Modal de detalles
  const [selectedReport, setSelectedReport] = useState<LostPetReportRow | null>(null);
  
  // Modales de confirmación
  const [confirmAction, setConfirmAction] = useState<{
    type: 'approve' | 'reject' | 'delete';
    reportId: string;
    reportName: string;
  } | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchPendingLostPetReports().then(({ data, error: e }) => {
      setLoading(false);
      if (e) {
        setError(e.message);
        return;
      }
      setReports(data);
    });
  }, []);

  const loadApproved = useCallback(() => {
    setLoadingApproved(true);
    fetchApprovedLostPetReports().then(({ data, error: e }) => {
      setLoadingApproved(false);
      if (e) {
        setError(e.message);
        return;
      }
      setApprovedReports(data);
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleApprove = async () => {
    if (!confirmAction || !user?.id) return;
    const { reportId } = confirmAction;
    setActing(reportId);
    const { error: e } = await approveLostPetReport(reportId, user.id);
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
    const { error: e } = await rejectLostPetReport(reportId, user.id);
    setActing(null);
    setConfirmAction(null);
    if (e) {
      setError(e.message);
      return;
    }
    setReports(prev => prev.filter(r => r.id !== reportId));
    setSelectedReport(null);
  };

  const handleDeleteApproved = async (id: string, name: string) => {
    if (!user?.id) return;
    setConfirmAction({
      type: 'delete',
      reportId: id,
      reportName: name,
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f6f2' }}>
      <div className="p-4 md:p-6 lg:p-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-black" style={{ color: COLORS.bg }}>
                Mascotas Perdidas
              </h1>
              <p className="text-sm font-medium mt-1" style={{ color: COLORS.bgLight }}>
                {reports.length} reporte{reports.length !== 1 ? 's' : ''} pendiente{reports.length !== 1 ? 's' : ''}
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
                No hay reportes pendientes
              </h2>
              <p style={{ color: COLORS.bgLight }}>
                Los nuevos reportes apareceran aqui.
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
                      {r.urgency && (
                        <span 
                          className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: COLORS.urgent }}
                        >
                          URGENTE
                        </span>
                      )}
                    </div>
                    <p className="text-sm truncate" style={{ color: COLORS.bgLight }}>
                      {r.breed} - {r.last_seen_location}
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

          {/* Toggle ver aprobadas */}
          <div className="mt-8 pt-6" style={{ borderTop: `1px solid ${COLORS.bg}15` }}>
            <button
              type="button"
              onClick={() => {
                if (!showApproved) {
                  loadApproved();
                }
                setShowApproved(!showApproved);
              }}
              className="flex items-center justify-between w-full p-4 rounded-xl border shadow-sm transition-colors"
              style={{ 
                backgroundColor: 'white', 
                borderColor: `${COLORS.bg}15` 
              }}
            >
              <div className="text-left">
                <h2 className="font-bold" style={{ color: COLORS.bg }}>
                  Aprobadas
                </h2>
                <p className="text-sm" style={{ color: COLORS.bgLight }}>
                  {showApproved 
                    ? `${approvedReports.length} publicacion${approvedReports.length !== 1 ? 'es' : ''} activa${approvedReports.length !== 1 ? 's' : ''}`
                    : 'Ver publicaciones activas'}
                </p>
              </div>
              <div 
                className={`w-10 h-6 rounded-full p-1 transition-colors ${showApproved ? '' : ''}`}
                style={{ 
                  backgroundColor: showApproved ? COLORS.bg : `${COLORS.bg}20` 
                }}
              >
                <div 
                  className="w-4 h-4 rounded-full transition-transform"
                  style={{ 
                    backgroundColor: showApproved ? COLORS.text : COLORS.bgLight,
                    transform: showApproved ? 'translateX(100%)' : 'translateX(0)'
                  }}
                />
              </div>
            </button>

            {/* Tabla de aprobadas */}
            {showApproved && (
              <div className="mt-4 rounded-xl border overflow-hidden" style={{ borderColor: `${COLORS.bg}15` }}>
                {loadingApproved ? (
                  <div className="p-8 text-center">
                    <div 
                      className="w-6 h-6 border-3 rounded-full animate-spin mx-auto"
                      style={{ borderColor: COLORS.bg, borderTopColor: 'transparent' }}
                    />
                  </div>
                ) : approvedReports.length === 0 ? (
                  <div className="p-8 text-center" style={{ color: COLORS.bgLight }}>
                    No hay publicaciones activas
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ backgroundColor: `${COLORS.bg}05` }}>
                        <th className="text-left p-3 font-semibold" style={{ color: COLORS.bgLight }}>Mascota</th>
                        <th className="text-left p-3 font-semibold hidden sm:table-cell" style={{ color: COLORS.bgLight }}>Ubicacion</th>
                        <th className="text-left p-3 font-semibold hidden md:table-cell" style={{ color: COLORS.bgLight }}>Aprobado</th>
                        <th className="text-right p-3 font-semibold" style={{ color: COLORS.bgLight }}>Accion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvedReports.map(r => (
                        <tr 
                          key={r.id} 
                          className="border-t"
                          style={{ borderColor: `${COLORS.bg}10` }}
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
                                style={{ backgroundColor: `${COLORS.bg}10` }}
                              >
                                <img 
                                  src={r.image_url} 
                                  alt={r.pet_name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-bold" style={{ color: COLORS.bg }}>{r.pet_name}</p>
                                <p className="text-xs" style={{ color: COLORS.bgLight }}>{r.breed}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 hidden sm:table-cell" style={{ color: COLORS.bg }}>
                            {r.last_seen_location}
                          </td>
                          <td className="p-3 hidden md:table-cell text-xs" style={{ color: COLORS.bgLight }}>
                            {r.reviewed_at ? formatDate(r.reviewed_at) : '-'}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteApproved(r.id, r.pet_name)}
                              disabled={!!acting}
                              className="px-3 py-1.5 rounded-lg font-medium text-xs transition-colors disabled:opacity-50"
                              style={{ 
                                backgroundColor: `${COLORS.urgent}10`, 
                                color: COLORS.urgent 
                              }}
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-black" style={{ color: COLORS.bg }}>
                    {selectedReport.pet_name}
                  </h3>
                  {selectedReport.urgency && (
                    <span 
                      className="text-xs font-bold px-3 py-1 rounded-full text-white"
                      style={{ backgroundColor: COLORS.urgent }}
                    >
                      URGENTE
                    </span>
                  )}
                </div>
                
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
                  {selectedReport.distinctive_features && (
                    <div className="col-span-2">
                      <p className="font-semibold" style={{ color: COLORS.bgLight }}>Marcas distintivas</p>
                      <p style={{ color: COLORS.bg }}>{selectedReport.distinctive_features}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Ubicacion */}
              <div className="bg-white rounded-xl p-5 shadow-sm border" style={{ borderColor: `${COLORS.bg}15` }}>
                <h4 className="font-bold mb-3" style={{ color: COLORS.bg }}>Ubicacion</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold" style={{ color: COLORS.bgLight }}>Donde se perdio</p>
                    <p style={{ color: COLORS.bg }}>{selectedReport.last_seen_location}</p>
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: COLORS.bgLight }}>Fecha</p>
                    <p style={{ color: COLORS.bg }}>{formatDateOnly(selectedReport.last_seen_date)}</p>
                  </div>
                </div>
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

              {/* Info adicional */}
              {selectedReport.additional_info && (
                <div className="bg-white rounded-xl p-5 shadow-sm border" style={{ borderColor: `${COLORS.bg}15` }}>
                  <h4 className="font-bold mb-3" style={{ color: COLORS.bg }}>Informacion adicional</h4>
                  <p className="text-sm" style={{ color: COLORS.bg }}>{selectedReport.additional_info}</p>
                </div>
              )}

              {/* Recompensa */}
              {selectedReport.has_reward && (
                <div 
                  className="rounded-xl p-5 border"
                  style={{ 
                    backgroundColor: `${COLORS.success}15`, 
                    borderColor: COLORS.success 
                  }}
                >
                  <p className="font-bold" style={{ color: COLORS.success }}>
                    Recompensa: {selectedReport.reward_amount || 'A convenir'}
                  </p>
                </div>
              )}

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
              {confirmAction.type === 'approve' 
                ? 'Aprobar reporte' 
                : confirmAction.type === 'delete'
                  ? 'Eliminar publicacion'
                  : 'Rechazar reporte'}
            </h3>
            <p className="text-sm mb-6" style={{ color: COLORS.bgLight }}>
              {confirmAction.type === 'approve' 
                ? `¿Estas seguro que deseas aprobar el reporte de "${confirmAction.reportName}"? La mascota aparecera en el sitio.` 
                : confirmAction.type === 'delete'
                  ? `¿Estas seguro que deseas eliminar la publicacion de "${confirmAction.reportName}"? Esta accion no se puede deshacer.`
                  : `¿Estas seguro que deseas rechazar el reporte de "${confirmAction.reportName}"? El reportante sera notificado.`}
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
                onClick={async () => {
                  if (confirmAction.type === 'delete') {
                    if (!user?.id) return;
                    setActing(confirmAction.reportId);
                    const { error: e } = await rejectLostPetReport(confirmAction.reportId, user.id);
                    setActing(null);
                    setConfirmAction(null);
                    if (e) {
                      setError(e.message);
                      return;
                    }
                    setApprovedReports(prev => prev.filter(r => r.id !== confirmAction.reportId));
                  } else if (confirmAction.type === 'approve') {
                    handleApprove();
                  } else {
                    handleReject();
                  }
                }}
                disabled={!!acting}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white transition-colors disabled:opacity-50"
                style={{ 
                  backgroundColor: confirmAction.type === 'approve' 
                    ? COLORS.success 
                    : COLORS.urgent 
                }}
              >
                {acting 
                  ? 'Procesando...' 
                  : confirmAction.type === 'approve' 
                    ? 'Aprobar' 
                    : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLostPets;
