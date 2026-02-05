import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  fetchPendingAdoptionPetReports,
  approveAdoptionPetReport,
  rejectAdoptionPetReport,
} from '../../services/adoptionPetsService';
import type { AdoptionPetReportRow } from '../../types';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const AdminAdoptionPets: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<AdoptionPetReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acting, setActing] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ id: string; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

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

  const handleApprove = async (id: string) => {
    if (!user?.id) return;
    setActing(id);
    const { error: e } = await approveAdoptionPetReport(id, user.id);
    setActing(null);
    if (e) {
      setError(e.message);
      return;
    }
    setReports(prev => prev.filter(r => r.id !== id));
  };

  const handleRejectClick = (r: AdoptionPetReportRow) => {
    setRejectModal({ id: r.id, name: r.pet_name });
    setRejectReason('');
  };

  const handleRejectConfirm = async () => {
    if (!rejectModal || !user?.id) return;
    setActing(rejectModal.id);
    const { error: e } = await rejectAdoptionPetReport(
      rejectModal.id,
      user.id,
      rejectReason || undefined
    );
    setActing(null);
    setRejectModal(null);
    setRejectReason('');
    if (e) {
      setError(e.message);
      return;
    }
    setReports(prev => prev.filter(r => r.id !== rejectModal.id));
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              AdopciÃ³n (pendientes)
            </h1>
            <p className="text-accent-teal font-medium mt-1">
              Revisa y aprueba o rechaza publicaciones. Solo las aprobadas se muestran en el sitio.
            </p>
          </div>
          <Link
            to="/admin"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent-teal/10 dark:bg-accent-teal/20 text-accent-teal font-bold hover:bg-accent-teal/20 dark:hover:bg-accent-teal/30 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
            Volver al panel
          </Link>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-center gap-2 p-4 rounded-xl bg-urgent-red/10 dark:bg-urgent-red/20 border border-urgent-red/30 text-urgent-red mb-6"
          >
            <span className="material-symbols-outlined text-xl flex-shrink-0">error</span>
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <span className="material-symbols-outlined text-5xl text-primary animate-pulse">pets</span>
            <p className="text-accent-teal font-medium">Cargando publicaciones pendientesâ€¦</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-accent-teal/10 p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-accent-teal mb-4">check_circle</span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              No hay publicaciones pendientes
            </h2>
            <p className="text-accent-teal">
              Las nuevas publicaciones aparecerÃ¡n aquÃ­. Revisa mÃ¡s tarde.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reports.map(r => (
              <div
                key={r.id}
                className="bg-white dark:bg-slate-900/80 rounded-2xl border border-accent-teal/10 overflow-hidden shadow-sm"
              >
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  <div className="flex-shrink-0 w-full md:w-48 aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img src={r.image_url} alt={r.pet_name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">{r.pet_name}</h2>
                      <span className="text-sm text-accent-teal font-medium">
                        {r.breed} â€¢ {r.gender === 'male' ? 'Macho' : 'Hembra'}
                        {r.age && ` â€¢ ${r.age}`}
                      </span>
                    </div>
                    <p className="text-sm text-accent-teal mb-2">
                      <span className="font-semibold">UbicaciÃ³n:</span> {r.location}
                    </p>
                    {r.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                        {r.description}
                      </p>
                    )}
                    {r.med_status && r.med_status.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {r.med_status.map((status, idx) => (
                          <span
                            key={`${r.id}-med-${idx}`}
                            className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-bold"
                          >
                            {status}
                          </span>
                        ))}
                      </div>
                    )}
                    {r.adoption_requirements && (
                      <p className="text-xs text-slate-500 dark:text-slate-500 mb-2">
                        <span className="font-semibold">Requisitos:</span> {r.adoption_requirements}
                      </p>
                    )}
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      Contacto: {r.contact_name} â€¢ {r.contact_phone}
                      {r.contact_email && ` â€¢ ${r.contact_email}`}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      Enviado {formatDate(r.submitted_at)}
                    </p>
                  </div>
                  <div className="flex md:flex-col gap-2 md:gap-3 flex-shrink-0">
                    <button
                      onClick={() => handleApprove(r.id)}
                      disabled={!!acting}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-background-dark font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {acting === r.id ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-lg">
                            progress_activity
                          </span>
                          Aprobandoâ€¦
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-lg">check_circle</span>
                          Aprobar
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleRejectClick(r)}
                      disabled={!!acting}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-urgent-red/10 dark:bg-urgent-red/20 text-urgent-red font-bold hover:bg-urgent-red/20 dark:hover:bg-urgent-red/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-lg">cancel</span>
                      Rechazar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {rejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-md w-full p-6"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Rechazar publicaciÃ³n: {rejectModal.name}
              </h3>
              <p className="text-sm text-accent-teal mb-4">
                Opcional: indica un motivo para el responsable.
              </p>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="Ej: Foto poco clara, datos incompletos..."
                className="w-full px-4 py-3 rounded-xl border border-accent-teal/20 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows={3}
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setRejectModal(null);
                    setRejectReason('');
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-accent-teal/20 text-accent-teal font-bold hover:bg-accent-teal/10 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRejectConfirm}
                  disabled={!!acting}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-urgent-red text-white font-bold hover:bg-urgent-red/90 transition-colors disabled:opacity-50"
                >
                  {acting ? 'Rechazandoâ€¦' : 'Rechazar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAdoptionPets;
