import { useState, useCallback, useEffect, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "El email es requerido";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Ingresa un email válido";
  return undefined;
}

function validatePassword(password: string): string | undefined {
  if (!password) return "La contraseña es requerida";
  if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres";
  return undefined;
}

function validateConfirmPassword(password: string, confirm: string): string | undefined {
  if (!confirm) return "Confirma tu contraseña";
  if (password !== confirm) return "Las contraseñas no coinciden";
  return undefined;
}

interface SignUpErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function SignUp() {
  const navigate = useNavigate();
  const { signUp, isAuthenticated, loading: authLoading } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate("/mi-cuenta", { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setFormError(null);
      setFormSuccess(null);
      setErrors({});

      const emailError = validateEmail(email);
      const passwordError = validatePassword(password);
      const confirmError = validateConfirmPassword(password, confirmPassword);

      if (emailError || passwordError || confirmError) {
        setErrors({
          email: emailError,
          password: passwordError,
          confirmPassword: confirmError,
        });
        return;
      }

      setSubmitting(true);
      try {
        const { error } = await signUp(email.trim(), password);
        if (error) {
          setFormError(error.message);
          return;
        }
        setFormSuccess("¡Cuenta creada! Por favor, verificá tu email para activar la cuenta (revisa la bandeja de spam).");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } catch {
        setFormError("Error al crear la cuenta. Inténtalo de nuevo más tarde.");
      } finally {
        setSubmitting(false);
      }
    },
    [email, password, confirmPassword, signUp],
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <p className="text-accent-teal font-medium">Cargando…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#203553] px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-[#f1e4cc] rounded-2xl shadow-xl border border-[#203553]/20 p-8">
          <div className="flex flex-col items-center gap-2 mb-8">
            <img
              src="/assets/LyM-logo.png"
              alt="LyM Desarrollo Web"
              className="w-20 h-20"
            />
            <h1 className="text-2xl font-black text-center text-slate-900">
              Crear Cuenta
            </h1>
            <p className="text-base text-center text-slate-600 font-medium">
              Regístrate para publicar y gestionar tus mascotas
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {formError && (
              <div
                role="alert"
                className="flex items-center gap-2 p-3 rounded-xl bg-urgent-red/10 dark:bg-urgent-red/20 border border-urgent-red/30 text-urgent-red text-sm"
              >
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div
                role="alert"
                className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-700 text-sm"
              >
                <span>{formSuccess}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="signup-email"
                className="block text-sm font-bold text-slate-700 mb-1.5"
              >
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email)
                    setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                disabled={submitting}
                className={`w-full px-4 py-3 rounded-xl bg-[#ecdbbd] focus:outline-none focus:ring-2 focus:ring-[#203553] focus:border-[#203553] ${
                  errors.email ? "border-urgent-red" : "border-[#203553]/30"
                }`}
                placeholder="tu@email.com"
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
                htmlFor="signup-password"
                className="block text-sm font-bold text-slate-700 mb-1.5"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  disabled={submitting}
                  className={`w-full px-4 py-3 pr-12 rounded-xl bg-[#ecdbbd] focus:outline-none focus:ring-2 focus:ring-[#203553] focus:border-[#203553] ${
                    errors.password
                      ? "border-urgent-red"
                      : "border-[#203553]/30"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg text-slate-500 text-xs font-bold"
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

            <div>
              <label
                htmlFor="signup-confirm-password"
                className="block text-sm font-bold text-slate-700 mb-1.5"
              >
                Confirmar Contraseña
              </label>
              <input
                id="signup-confirm-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword)
                    setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                disabled={submitting}
                className={`w-full px-4 py-3 rounded-xl bg-[#ecdbbd] focus:outline-none focus:ring-2 focus:ring-[#203553] focus:border-[#203553] ${
                  errors.confirmPassword
                    ? "border-urgent-red"
                    : "border-[#203553]/30"
                }`}
                placeholder="••••••••"
                aria-invalid={errors.confirmPassword ? "true" : "false"}
                aria-describedby={
                  errors.confirmPassword ? "confirm-password-error" : undefined
                }
              />
              {errors.confirmPassword && (
                <p
                  id="confirm-password-error"
                  className="mt-1.5 text-sm text-urgent-red"
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-[#203553] text-[#ecdbbd] font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Creando cuenta…" : "Crear Cuenta"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="font-bold text-[#203553] hover:underline">
              Iniciar sesión
            </Link>
          </p>

          <p className="mt-4 text-center">
            <Link to="/" className="text-sm font-medium text-slate-500 hover:text-[#203553]">
              ← Volver al inicio
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
