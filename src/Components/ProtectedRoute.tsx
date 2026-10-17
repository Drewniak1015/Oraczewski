import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { API_URL, authHeaders, clearToken, getToken } from "../config";

interface ProtectedRouteProps {
  children: ReactElement;
}

// Wcześniej wystarczyło wpisać w konsoli localStorage.setItem("adminToken","x")
// żeby wejść do panelu. Teraz token jest weryfikowany przez serwer.
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [status, setStatus] = useState<"checking" | "ok" | "denied">(
    getToken() ? "checking" : "denied"
  );

  useEffect(() => {
    if (status !== "checking") return;
    fetch(`${API_URL}/api/admin/verify`, { headers: authHeaders() })
      .then((res) => {
        if (res.ok) setStatus("ok");
        else {
          clearToken();
          setStatus("denied");
        }
      })
      .catch(() => setStatus("denied"));
  }, [status]);

  if (status === "checking")
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
        Sprawdzanie sesji…
      </div>
    );

  return status === "ok" ? children : <Navigate to="/AdminLogin" replace />;
};

export default ProtectedRoute;