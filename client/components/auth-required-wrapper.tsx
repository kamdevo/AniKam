import React from "react";
import { AuthModal } from "./auth-modal";
import { useAuthAction } from "@/hooks/use-auth-action";

interface AuthRequiredWrapperProps {
  children: (props: {
    executeAction: (action: () => void | Promise<void>) => boolean;
    canExecute: () => boolean;
    isAuthenticated: boolean;
  }) => React.ReactNode;
  onSuccess?: () => void;
}

export function AuthRequiredWrapper({
  children,
  onSuccess,
}: AuthRequiredWrapperProps) {
  const {
    executeAction,
    canExecute,
    showAuthModal,
    closeAuthModal,
    onAuthSuccess,
    isAuthenticated,
  } = useAuthAction({ onSuccess });

  return (
    <>
      {children({ executeAction, canExecute, isAuthenticated })}

      <AuthModal
        isOpen={showAuthModal}
        onClose={closeAuthModal}
        onSuccess={onAuthSuccess}
      />
    </>
  );
}
