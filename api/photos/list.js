// GET /api/photos/list – publiczna lista zdjęć (Portfolio + panel)
import { allowMethod, cloudinary, envMissing, PHOTO_FOLDER } from "../_lib.js";

export default async function handler(req, res) {
  if (!allowMethod(req, res, "GET") || envMissing(res)) return;

  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      resource_type: "image",
      prefix: `${PHOTO_FOLDER}/`,
      max_results: 500, // domyślnie Cloudinary zwraca tylko 10
    });

    const photos = result.resources
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map((r) => ({ url: r.secure_url, public_id: r.public_id }));

    // Cache na CDN Vercela przez 60 s. Darmowy Cloudinary ma limit
    // ~500 zapytań Admin API na godzinę – bez cache każde wejście na
    // Portfolio zużywałoby jedno. Panel admina omija cache parametrem ?t=...
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.status(200).json(photos);
  } catch (err) {
    console.error("Błąd pobierania zdjęć:", err);
    res.status(500).json({ message: "Błąd pobierania zdjęć" });
  }
}