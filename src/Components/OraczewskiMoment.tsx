import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL, authHeaders, clearToken } from "../config";

interface Photo {
  url: string;
  public_id: string;
}

export default function OraczewskiMoment() {
  const [files, setFiles] = useState<Photo[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [listLoading, setListLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const logout = () => {
    clearToken();
    navigate("/AdminLogin", { replace: true });
  };

  // Gdy token wygaśnie, serwer zwróci 401 -> wylogowujemy
  const handleUnauthorized = (res: Response) => {
    if (res.status === 401) {
      alert("Sesja wygasła – zaloguj się ponownie.");
      logout();
      return true;
    }
    return false;
  };

  const showMessage = (type: "ok" | "err", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const fetchFiles = async () => {
    setListLoading(true);
    try {
      // ?t=... omija 60-sekundowy cache, żeby panel zawsze widział aktualny stan
      const res = await fetch(`${API_URL}/api/photos/list?t=${Date.now()}`);
      if (!res.ok) throw new Error();
      setFiles(await res.json());
    } catch {
      showMessage("err", "Nie udało się pobrać listy zdjęć");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Podgląd przez URL.createObjectURL (lżejsze niż base64 z FileReader)
  useEffect(() => {
    if (!selectedFile) return setPreview(null);
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const resetSelection = () => {
    setSelectedFile(null);
    if (fileInput.current) fileInput.current.value = "";
  };

  const MAX_MB = 10;

  // Upload w 2 krokach:
  // 1) nasz serwer (Vercel) daje podpis – tylko dla zalogowanego admina,
  // 2) przeglądarka wysyła plik prosto do Cloudinary z tym podpisem.
  const handleUpload = async () => {
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith("image/"))
      return showMessage("err", "Wybierz plik graficzny (JPG, PNG, WEBP)");
    if (selectedFile.size > MAX_MB * 1024 * 1024)
      return showMessage("err", `Plik jest za duży (max ${MAX_MB} MB)`);

    setUploading(true);
    try {
      // krok 1 – podpis
      const signRes = await fetch(`${API_URL}/api/photos/sign`, {
        method: "POST",
        headers: authHeaders(),
      });
      if (handleUnauthorized(signRes)) return;
      if (!signRes.ok) throw new Error("Nie udało się przygotować wysyłki");
      const { cloudName, apiKey, folder, timestamp, signature } = await signRes.json();

      // krok 2 – wysyłka do Cloudinary
      const fd = new FormData();
      fd.append("file", selectedFile);
      fd.append("api_key", apiKey);
      fd.append("timestamp", String(timestamp));
      fd.append("folder", folder);
      fd.append("signature", signature);

      const upRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: fd }
      );
      const data = await upRes.json().catch(() => ({}));
      if (!upRes.ok) throw new Error(data?.error?.message || "Błąd dodawania zdjęcia");

      // dopisz od razu na górę listy
      setFiles((prev) => [{ url: data.secure_url, public_id: data.public_id }, ...prev]);
      resetSelection();
      showMessage("ok", "Zdjęcie dodane (na stronie Portfolio pojawi się w ciągu ok. minuty)");
    } catch (err) {
      showMessage("err", err instanceof Error ? err.message : "Błąd dodawania zdjęcia");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (publicId: string) => {
    if (!confirm("Czy na pewno chcesz usunąć to zdjęcie?")) return;
    setDeletingId(publicId);

    try {
      const res = await fetch(
        `${API_URL}/api/photos/delete?id=${encodeURIComponent(publicId)}`,
        { method: "DELETE", headers: authHeaders() }
      );
      if (handleUnauthorized(res)) return;

      if (res.ok) {
        setFiles((prev) => prev.filter((f) => f.public_id !== publicId));
        showMessage("ok", "Zdjęcie usunięte");
      } else showMessage("err", "Nie udało się usunąć zdjęcia");
    } catch {
      showMessage("err", "Brak połączenia z serwerem");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-[#f9f7f1]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Nagłówek */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Galeria portfolio</h1>
            <p className="text-gray-600 mt-1">
              Zdjęcia dodane tutaj pojawiają się na stronie <b>Portfolio</b>.
            </p>
          </div>
          <button
            onClick={logout}
            className="self-start sm:self-auto border border-red-500 text-red-600 hover:bg-red-500 hover:text-white px-5 py-2 rounded-lg transition"
          >
            Wyloguj
          </button>
        </div>

        {/* Komunikat */}
        {message && (
          <div
            className={`mb-6 rounded-lg p-3 text-sm border ${
              message.type === "ok"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Upload */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-10">
          <h2 className="font-semibold text-lg mb-4">Dodaj nowe zdjęcie</h2>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <label
              htmlFor="photo-input"
              className="flex-1 w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-black rounded-xl p-8 cursor-pointer transition text-center"
            >
              <span className="text-4xl mb-2">📷</span>
              <span className="font-medium">
                {selectedFile ? selectedFile.name : "Kliknij, aby wybrać zdjęcie"}
              </span>
              <span className="text-sm text-gray-500 mt-1">
                JPG, PNG, WEBP – max 10 MB
              </span>
              <input
                ref={fileInput}
                id="photo-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </label>

            {preview && (
              <img
                src={preview}
                alt="Podgląd"
                className="w-full md:w-48 h-48 object-cover rounded-xl border"
              />
            )}
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
              className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {uploading ? "Wysyłanie..." : "Dodaj zdjęcie"}
            </button>
            {selectedFile && !uploading && (
              <button
                onClick={resetSelection}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Anuluj
              </button>
            )}
          </div>
        </div>

        {/* Lista */}
        <h2 className="font-semibold text-lg mb-4">
          Zdjęcia w galerii {!listLoading && <span className="text-gray-500">({files.length})</span>}
        </h2>

        {listLoading ? (
          <p className="text-gray-500">Ładowanie…</p>
        ) : files.length === 0 ? (
          <p className="text-gray-500">Brak zdjęć – dodaj pierwsze powyżej.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file) => (
              <div
                key={file.public_id}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200"
              >
                <img
                  src={file.url}
                  alt=""
                  loading="lazy"
                  className="w-full h-40 object-cover"
                />
                {/* Przycisk zawsze widoczny – na telefonie nie ma hovera */}
                <button
                  onClick={() => handleDelete(file.public_id)}
                  disabled={deletingId === file.public_id}
                  className="w-full py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 transition"
                >
                  {deletingId === file.public_id ? "Usuwanie..." : "Usuń"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
