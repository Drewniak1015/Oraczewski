// Frontend i API są na tej samej domenie (Vercel), więc adres jest pusty:
// fetch("/api/...") trafia do funkcji z folderu api/.
// Opcjonalnie VITE_API_URL, jeśli kiedyś API będzie gdzie indziej.
export const API_URL: string = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export const EMAILJS = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID as string,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string,
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