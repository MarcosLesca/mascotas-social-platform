import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  fetchUserAdoptionPetReports,
  deleteAdoptionPetReport,
} from "../../services/adoptionPetsService";
import type { AdoptionPetReportRow } from "../../types";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusBadge(status: string) {
  const styles = {
    pending: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
    approved: "bg-green-500/20 text-green-700 border-green-500/30",
    rejected: "bg-red-500/20 text-red-700 border-red-500/30",
  };
  const labels = {
    pending: "Pendiente",
    approved: "Aprobado",
    rejected: "Rechazado",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || styles.pending}`}>
      {labels[status as keyof typeof labels] || status}
    </span>
  );
}

export default function UserAdoption() {
  const { user } = useAuth();
  const [reports, setReports] = useState<AdoptionPetReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    const { data, error: fetchError } = await fetchUserAdoptionPetReports(user.id);
    
    if (fetchError) {
      setError("Error al cargar las publicaciones. La columna user_id necesita ser agregada a la tabla.");
      setReports([]);
    } else {
      setReports(data);
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta publicación?")) return;
    
    setDeleting(id);
    const { error: deleteError } = await deleteAdoptionPetReport(id);
    
    if (deleteError) {
      alert("Error al eliminar la publicación");
    } else {
      setReports((prev) => prev.filter((r) => r.id !== id));
    }
    setDeleting(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[#203553] font-medium">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-red-700 font-medium">{error}</p>
        <p className="text-red-600 text-sm mt-2">
          Ejecuta la migración SQL en Supabase para agregar la columna user_id.
        </p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="material-symbols-outlined text-4xl text-slate-400">pets</span>
        <p className="mt-4 text-slate-600 font-medium">
          No tienes mascotas en adopción registradas
        </p>
        <p className="text-slate-500 text-sm mt-1">
          Publica una desde la sección de adopción
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-[#203553]">Mis Mascotas en Adopción</h2>
      
      <div className="grid gap-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
          >
            <div className="flex gap-4 p-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                {report.image_url ? (
                  <img
                    src={report.image_url}
                    alt={report.pet_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl text-slate-400">pets</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900">{report.pet_name}</h3>
                    <p className="text-sm text-slate-600">
                      {report.breed} • {report.species}
                    </p>
                  </div>
                  {getStatusBadge(report.status)}
                </div>
                
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                  <span>📍 {report.location}</span>
                  <span>📅 {formatDate(report.submitted_at)}</span>
                </div>
                
                {report.status === "rejected" && report.rejection_reason && (
                  <p className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg">
                    Razón: {report.rejection_reason}
                  </p>
                )}
              </div>
            </div>
            
            <div className="bg-slate-50 px-4 py-2 flex justify-end">
              <button
                type="button"
                onClick={() => handleDelete(report.id)}
                disabled={deleting === report.id}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {deleting === report.id ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
