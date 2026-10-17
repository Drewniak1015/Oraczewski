// GET /api/health – test czy funkcje działają
export default function handler(req, res) {
  res.status(200).json({ status: "ok" });
}