import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL, setToken } from "../config";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.token) {
        setToken(data.token);
        navigate("/panel");
      } else {
        setError(data.message || "Niepoprawny login lub hasło");
      }
    } catch {
      setError(
        "Brak połączenia z serwerem. Sprawdź internet i spróbuj ponownie."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition";

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-[#f9f7f1] flex items-center justify-center px-4 py-12">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-1">
          Panel Administratora
        </h2>
        <p className="text-center text-gray-600 text-sm mb-8">
          Zaloguj się, aby uzyskać dostęp do panelu
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block font-semibold mb-1">
              Nazwa użytkownika
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              placeholder="Wpisz nazwę użytkownika"
              className={inputClass}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block font-semibold mb-1">
              Hasło
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Wpisz hasło"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-semibold bg-black hover:bg-gray-800 disabled:bg-gray-500 disabled:cursor-not-allowed transition"
          >
            {loading ? "Logowanie..." : "Zaloguj się"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;