import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("🔵 AuthCallback: Iniciando procesamiento de OAuth callback");
    console.log("🔵 AuthCallback: URL completa:", window.location.href);
    
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const handleCallback = async () => {
      try {
        // Extraer el código de la URL
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        
        console.log("🔵 Código OAuth encontrado:", code ? "Sí" : "No");

        if (!code) {
          console.log("⚠️ No hay código OAuth, redirigiendo a home...");
          if (mounted) navigate("/", { replace: true });
          return;
        }

        // Esperar a que Supabase procese el código automáticamente
        // El SDK maneja esto internamente cuando hay un código en la URL
        console.log("🔵 Esperando procesamiento de código OAuth...");
        
        // Dar tiempo a Supabase para procesar
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("❌ AuthCallback: Error al obtener sesión:", sessionError);
          setError(sessionError.message);
          timeoutId = setTimeout(() => {
            if (mounted) navigate("/", { replace: true });
          }, 2000);
          return;
        }

        if (session) {
          console.log("✅ AuthCallback: Sesión obtenida exitosamente");
          console.log("✅ Usuario:", session.user.email);
          if (mounted) navigate("/", { replace: true });
        } else {
          console.log("⚠️ AuthCallback: No se pudo obtener sesión después de procesar código");
          console.log("⚠️ Redirigiendo a home de todos modos...");
          if (mounted) navigate("/", { replace: true });
        }
      } catch (err: any) {
        console.error("❌ AuthCallback: Error inesperado:", err);
        setError(err.message);
        timeoutId = setTimeout(() => {
          if (mounted) navigate("/", { replace: true });
        }, 2000);
      }
    };

    // Ejecutar el callback
    handleCallback();

    // Timeout de seguridad: si después de 5 segundos no se ha redirigido, forzar redirección
    const safetyTimeout = setTimeout(() => {
      console.log("⏰ Timeout de seguridad alcanzado, forzando redirección...");
      if (mounted) navigate("/", { replace: true });
    }, 5000);

    // Cleanup
    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      clearTimeout(safetyTimeout);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600 mb-2">
          {error ? `Error: ${error}` : "Verificando autenticación..."}
        </p>
        {error && (
          <p className="text-sm text-gray-500">Redirigiendo en breve...</p>
        )}
        {!error && (
          <p className="text-xs text-gray-400 mt-4">
            Esto solo debería tomar unos segundos
          </p>
        )}
      </div>
    </div>
  );
}
