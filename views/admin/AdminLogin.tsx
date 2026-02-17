import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  validateLoginForm,
  getRateLimitState,
  recordFailedAttempt,
  clearRateLimit,
  type LoginErrors,
} from "../../lib/validation";

function formatRemaining(ms: number): string {
  const m = Math.floor(ms / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  if (m > 0) return `${m} min ${s} s`;
  return `${s} s`;
}

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isAuthenticated, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [rateLimit, setRateLimit] = useState(getRateLimitState());

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ??
    "/admin";

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      clearRateLimit();
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, from]);

  useEffect(() => {
    if (!rateLimit.blocked) return;
    const interval = setInterval(() => {
      const next = getRateLimitState();
      setRateLimit(next);
      if (!next.blocked) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [rateLimit.blocked]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFormError(null);
      setErrors({});

      const next = getRateLimitState();
      if (next.blocked) {
        setRateLimit(next);
        return;
      }
      setRateLimit(next);

      const validation = validateLoginForm(email, password);
      if (Object.keys(validation).length > 0) {
        setErrors(validation);
        return;
      }

      setSubmitting(true);
      try {
        const { error } = await signIn(email.trim(), password);
        if (error) {
          recordFailedAttempt();
          setRateLimit(getRateLimitState());
          setFormError("Credenciales inválidas. Revisa email y contraseña.");
          return;
        }
        clearRateLimit();
        navigate(from, { replace: true });
      } catch {
        recordFailedAttempt();
        setRateLimit(getRateLimitState());
        setFormError("Error al iniciar sesión. Inténtalo de nuevo más tarde.");
      } finally {
        setSubmitting(false);
      }
    },
    [email, password, signIn, navigate, from],
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <p className="text-accent-teal font-medium">Cargando…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900/80 rounded-2xl shadow-xl border border-accent-teal/10 p-8">
          <div className="flex flex-col items-center gap-2 mb-8">
            <img
              src="https://lymdesarrolloweb.com.ar/assets/img/MyL.png"
              alt="LyM Desarrollo Web"
              className="w-16 h-16"
            />
            <h1 className="text-2xl font-black text-center text-slate-900 dark:text-white">
              Admin LyM desarrollo web
            </h1>
            <p className="text-sm text-center text-red-500 font-bold ">
              Acceso exclusivo para administradores autorizados
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {rateLimit.blocked && rateLimit.remainingMs != null && (
              <div
                role="alert"
                className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-sm"
              >
                <span>
                  Demasiados intentos. Podrás intentar de nuevo en{" "}
                  <strong>{formatRemaining(rateLimit.remainingMs)}</strong>.
                </span>
              </div>
            )}
            {formError && (
              <div
                role="alert"
                className="flex items-center gap-2 p-3 rounded-xl bg-urgent-red/10 dark:bg-urgent-red/20 border border-urgent-red/30 text-urgent-red text-sm"
              >
                <span>{formError}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="admin-email"
                className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email)
                    setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                disabled={submitting || rateLimit.blocked}
                className={`w-full px-4 py-3 rounded-xl ${
                  errors.email ? "border-urgent-red" : "border-accent-teal/20"
                }`}
                placeholder="lymdesarrolloweb@gmail.com"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1.5 text-sm text-urgent-red">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  disabled={submitting || rateLimit.blocked}
                  className={`w-full px-4 py-3 pr-12 rounded-xl ${
                    errors.password
                      ? "border-urgent-red"
                      : "border-accent-teal/20"
                  }`}
                  placeholder="••••••••"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs font-bold"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? "Ocultar" : "Ver"}
                </button>
              </div>
              {errors.password && (
                <p
                  id="password-error"
                  className="mt-1.5 text-sm text-urgent-red"
                >
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || rateLimit.blocked}
              className="w-full py-3.5 rounded-xl bg-[#203553] hover:bg-primary/90 text-[#ecdbbd] font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
            >
              {submitting ? (
                <span className="inline-flex items-center justify-center gap-2">
                  Iniciando sesión…
                </span>
              ) : rateLimit.blocked ? (
                "Espera antes de intentar"
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>

          <p className="mt-6 text-center">
            <Link to="/" className="text-sm font-medium ">
              ← Volver al inicio
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
