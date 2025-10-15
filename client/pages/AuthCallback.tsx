import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/auth-context";
import { AuthLoading } from "@/components/auth-loading";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Procesando autenticación...");
  const [sessionProcessed, setSessionProcessed] = useState(false);

  useEffect(() => {
    console.log("🔵 AuthCallback: Iniciando procesamiento de OAuth callback");
    console.log("🔵 AuthCallback: URL completa:", window.location.href);
    
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const handleCallback = async () => {
      try {
        setStatus("Procesando código de autenticación...");
        
        // Usar el método correcto de Supabase para intercambiar el código por una sesión
        console.log("🔵 Intercambiando código por sesión...");
        const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.search);
        
        if (error) {
          console.error("❌ AuthCallback: Error intercambiando código:", error);
          setError(error.message);
          setStatus("Error en la autenticación");
          timeoutId = setTimeout(() => {
            if (mounted) navigate("/", { replace: true });
          }, 3000);
          return;
        }

        if (data.session) {
          console.log("✅ AuthCallback: Sesión obtenida exitosamente");
          console.log("✅ Usuario:", data.session.user.email);
          setStatus("¡Autenticación exitosa! Configurando perfil...");
          setSessionProcessed(true);
          
          // No redirigir aquí, esperar a que el auth context procese el usuario
        } else {
          console.log("⚠️ AuthCallback: No se pudo obtener sesión");
          setError("No se pudo completar la autenticación");
          setStatus("Error en la autenticación");
          timeoutId = setTimeout(() => {
            if (mounted) navigate("/", { replace: true });
          }, 3000);
        }
      } catch (err: any) {
        console.error("❌ AuthCallback: Error inesperado:", err);
        setError(err.message);
        setStatus("Error inesperado");
        timeoutId = setTimeout(() => {
          if (mounted) navigate("/", { replace: true });
        }, 3000);
      }
    };

    // Verificar si hay parámetros de OAuth en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const hasOAuthParams = urlParams.has('code') || urlParams.has('access_token') || urlParams.has('error');
    
    if (hasOAuthParams) {
      console.log("🔵 Parámetros OAuth detectados, procesando...");
      handleCallback();
    } else {
      console.log("⚠️ No hay parámetros OAuth, redirigiendo a home...");
      if (mounted) navigate("/", { replace: true });
    }

    // Cleanup
    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [navigate]);

  // Efecto separado para manejar la redirección cuando el usuario esté listo
  useEffect(() => {
    if (sessionProcessed && !isLoading && user) {
      console.log("✅ AuthCallback: Usuario procesado completamente, redirigiendo...");
      setStatus("¡Completado! Redirigiendo...");
      
      const redirectTimeout = setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);

      return () => clearTimeout(redirectTimeout);
    }
  }, [sessionProcessed, isLoading, user, navigate]);

  // Emergency timeout only as last resort (60 seconds)
  useEffect(() => {
    const emergencyTimeout = setTimeout(() => {
      if (!user && !error) {
        console.log("🚨 Emergency timeout after 60 seconds - redirecting...");
        navigate("/", { replace: true });
      }
    }, 60000); // 60 segundos como último recurso

    return () => clearTimeout(emergencyTimeout);
  }, [user, error, navigate]);

  // Show error state if there's an error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-red-900 dark:to-gray-900">
        <div className="text-center p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-red-200">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Error de Autenticación
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error}
          </p>
          
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Redirigiendo al inicio en breve...
          </p>
        </div>
      </div>
    );
  }

  // Show success state if user is loaded
  if (sessionProcessed && user) {
    return (
      <AuthLoading message={`¡Bienvenido de vuelta, ${user.displayName || user.username}! 🎉`} />
    );
  }

  // Show loading state
  return (
    <AuthLoading message={status} />
  );
}
