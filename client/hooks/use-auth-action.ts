import { useAuth } from '@/contexts/auth-context';
import { useState } from 'react';

interface UseAuthActionOptions {
  onSuccess?: () => void;
  onAuthRequired?: () => void;
  requireAuth?: boolean;
}

export function useAuthAction(options: UseAuthActionOptions = {}) {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { 
    onSuccess, 
    onAuthRequired = () => setShowAuthModal(true), 
    requireAuth = true 
  } = options;

  /**
   * Ejecuta una acción que requiere autenticación
   * Si el usuario no está autenticado, muestra el modal de auth
   */
  const executeAction = (action: () => void | Promise<void>) => {
    if (requireAuth && !isAuthenticated) {
      onAuthRequired();
      return false;
    }
    
    action();
    onSuccess?.();
    return true;
  };

  /**
   * Verifica si el usuario puede realizar una acción
   */
  const canExecute = () => {
    return !requireAuth || isAuthenticated;
  };

  /**
   * Cierra el modal de autenticación
   */
  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  /**
   * Se ejecuta cuando el usuario se autentica exitosamente
   */
  const onAuthSuccess = () => {
    setShowAuthModal(false);
    onSuccess?.();
  };

  return {
    executeAction,
    canExecute,
    showAuthModal,
    closeAuthModal,
    onAuthSuccess,
    isAuthenticated
  };
}
