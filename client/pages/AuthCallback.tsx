import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("🔵 AuthCallback: Iniciando procesamiento de OAuth callback");
    
    // Get the code from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    console.log("🔵 AuthCallback: Code encontrado:", code ? "Sí" : "No");

    if (code) {
      // Exchange the code for a session
      supabase.auth.exchangeCodeForSession(code)
        .then(({ data, error }) => {
          if (error) {
            console.error("❌ AuthCallback: Error al intercambiar código:", error);
            setError(error.message);
            // Redirect to home even on error
            setTimeout(() => navigate("/", { replace: true }), 2000);
          } else if (data.session) {
            console.log("✅ AuthCallback: Sesión obtenida exitosamente");
            console.log("✅ Usuario:", data.session.user.email);
            // Redirect to home after successful authentication
            navigate("/", { replace: true });
          } else {
            console.log("⚠️ AuthCallback: No se obtuvo sesión");
            navigate("/", { replace: true });
          }
        })
        .catch((err) => {
          console.error("❌ AuthCallback: Error inesperado:", err);
          setError(err.message);
          setTimeout(() => navigate("/", { replace: true }), 2000);
        });
    } else {
      console.log("⚠️ AuthCallback: No hay código en la URL, redirigiendo...");
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">
          {error ? `Error: ${error}` : "Verificando autenticación..."}
        </p>
        {error && (
          <p className="text-sm text-gray-500 mt-2">Redirigiendo en breve...</p>
        )}
      </div>
    </div>
  );
}
