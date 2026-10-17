// DELETE /api/photos/delete?id=my_photos/abc123 – tylko admin
// (id w query, bo public_id zawiera "/")
import { allowMethod, cloudinary, envMissing, PHOTO_FOLDER, requireAuth } from "../_lib.js";

export default async function handler(req, res) {
  if (!allowMethod(req, res, "DELETE") || envMissing(res)) return;
  if (!requireAuth(req, res)) return;

  const publicId = typeof req.query.id === "string" ? req.query.id : "";
  if (!publicId.startsWith(`${PHOTO_FOLDER}/`)) {
    return res.status(400).json({ message: "Niepoprawny identyfikator zdjęcia" });
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, { invalidate: true });
    if (result.result === "ok") return res.status(200).json({ message: "Usunięto zdjęcie" });
    if (result.result === "not found")
      return res.status(404).json({ message: "Nie znaleziono pliku w Cloudinary" });
    return res.status(500).json({ message: "Nie udało się usunąć zdjęcia" });
  } catch (err) {
    console.error("Błąd usuwania zdjęcia:", err);
    res.status(500).json({ message: "Błąd usuwania zdjęcia" });
  }
}