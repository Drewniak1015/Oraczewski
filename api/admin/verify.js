// GET /api/admin/verify – czy token jest ważny
import { allowMethod, envMissing, requireAuth } from "../_lib.js";

export default function handler(req, res) {
  if (!allowMethod(req, res, "GET") || envMissing(res)) return;
  if (!requireAuth(req, res)) return;
  res.status(200).json({ valid: true });
}