// POST /api/photos/sign – tylko admin.
// Zwraca jednorazowy podpis, dzięki któremu przeglądarka wysyła zdjęcie
// PROSTO do Cloudinary. Plik nie przechodzi przez Vercel, więc nie
// obowiązuje limit 4.5 MB na funkcję. Sekret Cloudinary nie opuszcza serwera.
import { allowMethod, cloudinary, envMissing, PHOTO_FOLDER, requireAuth } from "../_lib.js";

export default function handler(req, res) {
  if (!allowMethod(req, res, "POST") || envMissing(res)) return;
  if (!requireAuth(req, res)) return;

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = { folder: PHOTO_FOLDER, timestamp };
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET
  );

  res.status(200).json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder: PHOTO_FOLDER,
    timestamp,
    signature,
  });
}