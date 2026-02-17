import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  fetchPendingDonationCampaignReports,
  fetchApprovedDonationCampaignReports,
  approveDonationCampaignReport,
  rejectDonationCampaignReport,
} from '../../services/donationCampaignsService';
import type { DonationCampaignReportRow } from '../../types';

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

const typeLabel: Record<string, string> = {
  medical: 'Medico',
  food: 'Alimentacion',
  infrastructure: 'Infraestructura',
};

const AdminDonationCampaigns: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<DonationCampaignReportRow[]>([]);
  const [approvedReports, setApprovedReports] = useState<DonationCampaignReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingApproved, setLoadingApproved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acting, setActing] = useState<string | null>(null);
  const [showApproved, setShowApproved] = useState(false);
  
  // Modal de detalles
  const [selectedReport, setSelectedReport] = useState<DonationCampaignReportRow | null>(null);
  
  // Modales de confirmacion
  const [confirmAction, setConfirmAction] = useState<{
    type: 'approve' | 'reject' | 'delete';
    reportId: string;
    reportName: string;
  } | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchPendingDonationCampaignReports().then(({ data, error: e }) => {
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
    fetchApprovedDonationCampaignReports().then(({ data, error: e }) => {
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
    const { error: e } = await approveDonationCampaignReport(reportId, user.id);
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
    const { error: e } = await rejectDonationCampaignReport(reportId, user.id);
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
                Donaciones
              </h1>
              <p className="text-sm font-medium mt-1" style={{ color: COLORS.bgLight }}>
                {reports.length} campanha{reports.length !== 1 ? 's' : ''} pendiente{reports.length !== 1 ? 's' : ''}
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
                No hay donaciones pendientes
              </h2>
              <p style={{ color: COLORS.bgLight }}>
                Las nuevas donaciones apareceran aqui.
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
                      alt={r.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Info minima */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold truncate" style={{ color: COLORS.bg }}>
                        {r.title}
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
                      {typeLabel[r.type]} - Meta: ${r.goal.toLocaleString('es-AR')}
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
                    ? `${approvedReports.length} campanha${approvedReports.length !== 1 ? 's' : ''} activa${approvedReports.length !== 1 ? 's' : ''}`
                    : 'Ver campanhas activas'}
                </p>
              </div>
              <div 
                className="w-10 h-6 rounded-full p-1 transition-colors"
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
                    No hay campanhas activas
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ backgroundColor: `${COLORS.bg}05` }}>
                        <th className="text-left p-3 font-semibold" style={{ color: COLORS.bgLight }}>Campanha</th>
                        <th className="text-left p-3 font-semibold hidden sm:table-cell" style={{ color: COLORS.bgLight }}>Tipo</th>
                        <th className="text-left p-3 font-semibold hidden md:table-cell" style={{ color: COLORS.bgLight }}>Meta</th>
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
                                  alt={r.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-bold" style={{ color: COLORS.bg }}>{r.title}</p>
                                <p className="text-xs" style={{ color: COLORS.bgLight }}>{r.pet_name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 hidden sm:table-cell" style={{ color: COLORS.bg }}>
                            {typeLabel[r.type]}
                          </td>
                          <td className="p-3 hidden md:table-cell" style={{ color: COLORS.bg }}>
                            ${r.goal.toLocaleString('es-AR')}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteApproved(r.id, r.title)}
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
              Detalles de la campanha
            </h2>
            <div className="w-16" />
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
                  alt={selectedReport.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Titulo y tipo */}
              <div className="bg-white rounded-xl p-5 shadow-sm border" style={{ borderColor: `${COLORS.bg}15` }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-black" style={{ color: COLORS.bg }}>
                    {selectedReport.title}
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
                    <p className="font-semibold" style={{ color: COLORS.bgLight }}>Tipo</p>
                    <p style={{ color: COLORS.bg }}>{typeLabel[selectedReport.type]}</p>
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: COLORS.bgLight }}>Meta</p>
                    <p style={{ color: COLORS.bg }}>${selectedReport.goal.toLocaleString('es-AR')}</p>
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: COLORS.bgLight }}>Fecha limite</p>
                    <p style={{ color: COLORS.bg }}>{selectedReport.deadline}</p>
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: COLORS.bgLight }}>Mascota</p>
                    <p style={{ color: COLORS.bg }}>{selectedReport.pet_name}</p>
                  </div>
                </div>
              </div>

              {/* Descripcion */}
              <div className="bg-white rounded-xl p-5 shadow-sm border" style={{ borderColor: `${COLORS.bg}15` }}>
                <h4 className="font-bold mb-3" style={{ color: COLORS.bg }}>Descripcion</h4>
                <p className="text-sm" style={{ color: COLORS.bg }}>{selectedReport.description}</p>
              </div>

              {/* Datos bancarios */}
              <div className="bg-white rounded-xl p-5 shadow-sm border" style={{ borderColor: `${COLORS.bg}15` }}>
                <h4 className="font-bold mb-3" style={{ color: COLORS.bg }}>Datos bancarios</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold" style={{ color: COLORS.bgLight }}>Titular:</span>{' '}
                    <span style={{ color: COLORS.bg }}>{selectedReport.account_holder}</span>
                  </p>
                  <p>
                    <span className="font-semibold" style={{ color: COLORS.bgLight }}>CBU:</span>{' '}
                    <span style={{ color: COLORS.bg }}>{selectedReport.cbu}</span>
                  </p>
                  <p>
                    <span className="font-semibold" style={{ color: COLORS.bgLight }}>Alias:</span>{' '}
                    <span style={{ color: COLORS.bg }}>{selectedReport.alias}</span>
                  </p>
                </div>
              </div>

              {/* Responsable */}
              <div className="bg-white rounded-xl p-5 shadow-sm border" style={{ borderColor: `${COLORS.bg}15` }}>
                <h4 className="font-bold mb-3" style={{ color: COLORS.bg }}>Responsable</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold" style={{ color: COLORS.bgLight }}>Nombre:</span>{' '}
                    <span style={{ color: COLORS.bg }}>{selectedReport.responsible_name}</span>
                  </p>
                  <p>
                    <span className="font-semibold" style={{ color: COLORS.bgLight }}>Contacto:</span>{' '}
                    <span style={{ color: COLORS.bg }}>{selectedReport.contact_info}</span>
                  </p>
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
                reportName: selectedReport.title 
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
                reportName: selectedReport.title 
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
                ? 'Aprobar campanha' 
                : confirmAction.type === 'delete'
                  ? 'Eliminar campanha'
                  : 'Rechazar campanha'}
            </h3>
            <p className="text-sm mb-6" style={{ color: COLORS.bgLight }}>
              {confirmAction.type === 'approve' 
                ? `¿Estas seguro que deseas aprobar a campanha "${confirmAction.reportName}"?` 
                : confirmAction.type === 'delete'
                  ? `¿Estas seguro que deseas eliminar a campanha "${confirmAction.reportName}"? Esta accion no se puede deshacer.`
                  : `¿Estas seguro que deseas rechazar a campanha "${confirmAction.reportName}"?`}
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
                    const { error: e } = await rejectDonationCampaignReport(confirmAction.reportId, user.id);
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

export default AdminDonationCampaigns;
