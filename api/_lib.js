// Wspólne funkcje dla wszystkich endpointów.
// Plik zaczyna się od "_", więc Vercel NIE robi z niego osobnego adresu.
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";

export const PHOTO_FOLDER = "my_photos";

const REQUIRED = [
  "ADMIN_USERNAME",
  "ADMIN_PASSWORD",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

// Zwraca true, jeśli czegoś brakuje (i od razu odpowiada błędem 500)
export function envMissing(res) {
  const missing = REQUIRED.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error("Brak zmiennych środowiskowych:", missing.join(", "));
    res.status(500).json({ message: "Serwer nie jest skonfigurowany" });
    return true;
  }
  return false;
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

// Dozwolona metoda HTTP, inaczej 405
export function allowMethod(req, res, method) {
  if (req.method !== method) {
    res.setHeader("Allow", method);
    res.status(405).json({ message: "Method not allowed" });
    return false;
  }
  return true;
}

export function signToken() {
  return jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "8h" });
}

// Sprawdza nagłówek "Authorization: Bearer <token>". Zwraca true gdy OK.
export function requireAuth(req, res) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    res.status(401).json({ message: "Brak tokenu" });
    return false;
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch {
    res.status(401).json({ message: "Sesja wygasła – zaloguj się ponownie" });
    return false;
  }
}