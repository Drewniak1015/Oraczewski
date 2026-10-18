// Frontend i API są na tej samej domenie (Vercel), więc adres jest pusty:
// fetch("/api/...") trafia do funkcji z folderu api/.
// Opcjonalnie VITE_API_URL, jeśli kiedyś API będzie gdzie indziej.
export const API_URL: string = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

// Klucze EmailJS są publiczne z założenia (formularz wysyła maila prosto
// z przeglądarki), więc mogą być wpisane w kodzie. Zmienne VITE_* w .env
// mają pierwszeństwo, jeśli są ustawione.
export const EMAILJS = {
  serviceId: (import.meta.env.VITE_EMAILJS_SERVICE_ID as string) || "service_49n9if1",
  templateId: (import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string) || "template_a2gtln6",
  publicKey: (import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string) || "feWGGEsrV-dtDXdsr",
};

// --- Token admina ---
const TOKEN_KEY = "adminToken";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const authHeaders = (): Record<string, string> => {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
};