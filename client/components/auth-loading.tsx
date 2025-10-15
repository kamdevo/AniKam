import { motion } from "framer-motion";
import { Loader2, Shield, User } from "lucide-react";

interface AuthLoadingProps {
  message?: string;
}

export function AuthLoading({ message = "Verificando autenticación..." }: AuthLoadingProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background-secondary to-background z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-20 h-20 bg-anime-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl"
            >
              <span className="text-white font-bold text-3xl">🧩</span>
            </motion.div>
            
            {/* Pulsing ring */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.2, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 w-20 h-20 border-4 border-purple-400 rounded-full mx-auto"
            />
          </div>
        </motion.div>

        {/* Loading Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold gradient-text">AniKam</h2>
          
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-5 h-5" />
            </motion.div>
            <span className="text-lg">{message}</span>
          </div>

          {/* Loading steps animation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Conectando</span>
            </motion.div>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, duration: 0.3 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 bg-blue-500 rounded-full"
              />
              <span>Verificando</span>
            </motion.div>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5, duration: 0.3 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  backgroundColor: ["#8b5cf6", "#06b6d4", "#8b5cf6"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-purple-500 rounded-full"
              />
              <span>Cargando perfil</span>
            </motion.div>
          </div>

          {/* Animated dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex justify-center gap-1 mt-4"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 bg-anime-gradient rounded-full"
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="text-xs text-muted-foreground mt-8 max-w-md mx-auto"
        >
          Tu experiencia anime personalizada está siendo preparada...
        </motion.p>
      </div>
    </div>
  );
}

// Variante más simple para usar en componentes
export function SimpleAuthLoading({ message = "Cargando..." }: AuthLoadingProps) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 bg-anime-gradient rounded-full flex items-center justify-center mx-auto"
        >
          <span className="text-white font-bold text-xl">🧩</span>
        </motion.div>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-4 h-4" />
          </motion.div>
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
}
