const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;
const MAX_PASSWORD = 72;

export interface LoginErrors {
  email?: string;
  password?: string;
  form?: string;
}

export function validateEmail(value: string): string | undefined {
  const t = value.trim();
  if (!t) return 'El email es obligatorio.';
  if (!EMAIL_REGEX.test(t)) return 'Introduce un email válido.';
  if (t.length > 254) return 'Email demasiado largo.';
  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (!value) return 'La contraseña es obligatoria.';
  if (value.length < MIN_PASSWORD) return `Mínimo ${MIN_PASSWORD} caracteres.`;
  if (value.length > MAX_PASSWORD) return `Máximo ${MAX_PASSWORD} caracteres.`;
  return undefined;
}

export function validateLoginForm(email: string, password: string): LoginErrors {
  const errors: LoginErrors = {};
  const e = validateEmail(email);
  const p = validatePassword(password);
  if (e) errors.email = e;
  if (p) errors.password = p;
  return errors;
}

const RATE_LIMIT_KEY = 'admin_login_failures';
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 min
const MAX_ATTEMPTS = 5;

export interface RateLimitState {
  blocked: boolean;
  remainingMs?: number;
}

export function getRateLimitState(): RateLimitState {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) return { blocked: false };
    const { count, firstAttempt } = JSON.parse(raw) as {
      count: number;
      firstAttempt: number;
    };
    const elapsed = Date.now() - firstAttempt;
    if (elapsed > RATE_LIMIT_WINDOW_MS) {
      localStorage.removeItem(RATE_LIMIT_KEY);
      return { blocked: false };
    }
    if (count >= MAX_ATTEMPTS) {
      return { blocked: true, remainingMs: Math.max(0, RATE_LIMIT_WINDOW_MS - elapsed) };
    }
    return { blocked: false };
  } catch {
    return { blocked: false };
  }
}

export function recordFailedAttempt(): void {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const now = Date.now();
    let data: { count: number; firstAttempt: number } = raw
      ? JSON.parse(raw)
      : { count: 0, firstAttempt: now };
    const elapsed = now - data.firstAttempt;
    if (elapsed > RATE_LIMIT_WINDOW_MS) data = { count: 0, firstAttempt: now };
    data.count += 1;
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
  } catch {
    /* noop */
  }
}

export function clearRateLimit(): void {
  try {
    localStorage.removeItem(RATE_LIMIT_KEY);
  } catch {
    /* noop */
  }
}
