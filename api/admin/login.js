// POST /api/admin/login  { username, password }  ->  { token }
import { allowMethod, envMissing, signToken } from "../_lib.js";

export default function handler(req, res) {
  if (!allowMethod(req, res, "POST") || envMissing(res)) return;

  const { username, password } = req.body || {};
  if (
    typeof username === "string" &&
    typeof password === "string" &&
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.status(200).json({ message: "Zalogowano pomyślnie!", token: signToken() });
  }
  return res.status(401).json({ message: "Niepoprawny login lub hasło" });
}