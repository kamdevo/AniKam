import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Github,
  Chrome,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassCard } from "@/components/ui/glass-card";
import { CustomModal } from "@/components/custom-modal";
import { useAuth, DEMO_CREDENTIALS } from "@/contexts/auth-context";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const { login, register, loginWithDemo, signInWithOAuth, isLoading } = useAuth();

  // Form states
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (isRegister: boolean = false) => {
    const newErrors: FormErrors = {};

    if (isRegister) {
      if (!registerForm.username.trim()) {
        newErrors.username = "Username is required";
      } else if (registerForm.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters";
      }

      if (!validateEmail(registerForm.email)) {
        newErrors.email = "Please enter a valid email";
      }

      if (registerForm.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      if (registerForm.password !== registerForm.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    } else {
      if (!validateEmail(loginForm.email)) {
        newErrors.email = "Please enter a valid email";
      }

      if (!loginForm.password) {
        newErrors.password = "Password is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(false)) return;

    try {
      await login(loginForm);
      toast.success("Welcome back!");
      onSuccess?.();
      onClose();
      // Reset form
      setLoginForm({ email: "", password: "" });
      setErrors({});
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(true)) return;

    try {
      await register(registerForm);
      toast.success("Account created successfully! Welcome to AniKam!");
      onSuccess?.();
      onClose();
      // Reset form
      setRegisterForm({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Registration failed"
      );
    }
  };

  const handleDemoLogin = async () => {
    try {
      await loginWithDemo();
      toast.success("Welcome to the demo!");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("Demo login failed");
    }
  };

  const handleSocialAuth = async (provider: "google" | "github") => {
    console.log("🔵 handleSocialAuth called with provider:", provider);
    
    try {
      await signInWithOAuth(provider);
      // The user will be redirected to the OAuth provider
      // After authentication, they'll be redirected back to /auth/callback
      // No need to close modal here as user will be redirected
    } catch (error: any) {
      console.error(`❌ ${provider} auth error:`, error);
      toast.error(error.message || `Failed to sign in with ${provider}`);
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } },
  };

  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <GlassCard className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-anime-gradient opacity-5">
          <motion.div
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="w-full h-full bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20"
          />
        </div>

        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 z-10 hover:bg-white/10"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="relative p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="w-16 h-16 bg-anime-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <span className="text-white font-bold text-2xl">🧩</span>
            </motion.div>
            <h2 className="text-2xl font-bold gradient-text mb-2">
              Welcome to AniKam
            </h2>
            <p className="text-muted-foreground text-sm">
              Your ultimate anime companion
            </p>
          </motion.div>

          {/* Demo Login Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <Button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Try Demo Account
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-1">
              Email: {DEMO_CREDENTIALS.email} | Password:{" "}
              {DEMO_CREDENTIALS.password}
            </p>
          </motion.div>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-glass-border/50" />
            <span className="px-3 text-xs text-muted-foreground">or</span>
            <div className="flex-1 border-t border-glass-border/50" />
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as any)}
          >
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              {/* Login Form */}
              <TabsContent value="login" className="space-y-4">
                <motion.form
                  key="login"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onSubmit={handleLogin}
                  className="space-y-4"
                >
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <motion.div
                        variants={inputVariants}
                        whileFocus="focus"
                        initial="blur"
                      >
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="your@email.com"
                          value={loginForm.email}
                          onChange={(e) => {
                            setLoginForm((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }));
                            if (errors.email)
                              setErrors((prev) => ({
                                ...prev,
                                email: undefined,
                              }));
                          }}
                          className={cn(
                            "pl-10 bg-glass/50 border-glass-border/50 focus:bg-glass/80 transition-all",
                            errors.email && "border-red-500"
                          )}
                          required
                        />
                      </motion.div>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-xs mt-1"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <motion.div
                        variants={inputVariants}
                        whileFocus="focus"
                        initial="blur"
                      >
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Your password"
                          value={loginForm.password}
                          onChange={(e) => {
                            setLoginForm((prev) => ({
                              ...prev,
                              password: e.target.value,
                            }));
                            if (errors.password)
                              setErrors((prev) => ({
                                ...prev,
                                password: undefined,
                              }));
                          }}
                          className={cn(
                            "pl-10 pr-10 bg-glass/50 border-glass-border/50 focus:bg-glass/80 transition-all",
                            errors.password && "border-red-500"
                          )}
                          required
                        />
                      </motion.div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      {errors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-xs mt-1"
                        >
                          {errors.password}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-between text-sm"
                  >
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-glass-border/50"
                      />
                      <span className="text-muted-foreground">Remember me</span>
                    </label>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-primary text-sm"
                    >
                      Forgot password?
                    </Button>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Button
                      type="submit"
                      className="w-full bg-anime-gradient hover:opacity-90 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Signing in...
                        </div>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </motion.div>
                </motion.form>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register" className="space-y-4">
                <motion.form
                  key="register"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onSubmit={handleRegister}
                  className="space-y-4"
                >
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="register-username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <motion.div
                        variants={inputVariants}
                        whileFocus="focus"
                        initial="blur"
                      >
                        <Input
                          id="register-username"
                          type="text"
                          placeholder="Your username"
                          value={registerForm.username}
                          onChange={(e) => {
                            setRegisterForm((prev) => ({
                              ...prev,
                              username: e.target.value,
                            }));
                            if (errors.username)
                              setErrors((prev) => ({
                                ...prev,
                                username: undefined,
                              }));
                          }}
                          className={cn(
                            "pl-10 bg-glass/50 border-glass-border/50 focus:bg-glass/80 transition-all",
                            errors.username && "border-red-500"
                          )}
                          required
                        />
                      </motion.div>
                      {errors.username && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-xs mt-1"
                        >
                          {errors.username}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <motion.div
                        variants={inputVariants}
                        whileFocus="focus"
                        initial="blur"
                      >
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="your@email.com"
                          value={registerForm.email}
                          onChange={(e) => {
                            setRegisterForm((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }));
                            if (errors.email)
                              setErrors((prev) => ({
                                ...prev,
                                email: undefined,
                              }));
                          }}
                          className={cn(
                            "pl-10 bg-glass/50 border-glass-border/50 focus:bg-glass/80 transition-all",
                            errors.email && "border-red-500"
                          )}
                          required
                        />
                      </motion.div>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-xs mt-1"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <motion.div
                        variants={inputVariants}
                        whileFocus="focus"
                        initial="blur"
                      >
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={registerForm.password}
                          onChange={(e) => {
                            setRegisterForm((prev) => ({
                              ...prev,
                              password: e.target.value,
                            }));
                            if (errors.password)
                              setErrors((prev) => ({
                                ...prev,
                                password: undefined,
                              }));
                          }}
                          className={cn(
                            "pl-10 pr-10 bg-glass/50 border-glass-border/50 focus:bg-glass/80 transition-all",
                            errors.password && "border-red-500"
                          )}
                          required
                        />
                      </motion.div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      {errors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-xs mt-1"
                        >
                          {errors.password}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="register-confirm-password">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <motion.div
                        variants={inputVariants}
                        whileFocus="focus"
                        initial="blur"
                      >
                        <Input
                          id="register-confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={registerForm.confirmPassword}
                          onChange={(e) => {
                            setRegisterForm((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }));
                            if (errors.confirmPassword)
                              setErrors((prev) => ({
                                ...prev,
                                confirmPassword: undefined,
                              }));
                          }}
                          className={cn(
                            "pl-10 pr-10 bg-glass/50 border-glass-border/50 focus:bg-glass/80 transition-all",
                            errors.confirmPassword && "border-red-500"
                          )}
                          required
                        />
                      </motion.div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      {errors.confirmPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-xs mt-1"
                        >
                          {errors.confirmPassword}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="text-xs text-muted-foreground"
                  >
                    By signing up, you agree to our{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-xs text-primary"
                    >
                      Terms of Service
                    </Button>{" "}
                    and{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-xs text-primary"
                    >
                      Privacy Policy
                    </Button>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Button
                      type="submit"
                      className="w-full bg-anime-gradient hover:opacity-90 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Creating account...
                        </div>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </motion.div>
                </motion.form>
              </TabsContent>
            </AnimatePresence>
          </Tabs>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-glass-border/50" />
            <span className="px-4 text-sm text-muted-foreground">
              Or continue with
            </span>
            <div className="flex-1 border-t border-glass-border/50" />
          </div>

          {/* Social Auth */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 gap-3"
          >
            <Button
              variant="outline"
              onClick={() => handleSocialAuth("google")}
              disabled={isLoading}
              className="bg-glass/30 border-glass-border/50 hover:bg-glass/50 transition-all"
            >
              <Chrome className="w-4 h-4 mr-2" />
              Google
            </Button>
            
          </motion.div>

          {/* Switch between login/register */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-6 text-sm text-muted-foreground"
          >
            {activeTab === "login" ? (
              <>
                Don't have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-primary font-medium"
                  onClick={() => setActiveTab("register")}
                >
                  Sign up here
                </Button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-primary font-medium"
                  onClick={() => setActiveTab("login")}
                >
                  Sign in here
                </Button>
              </>
            )}
          </motion.div>
        </div>
      </GlassCard>
    </CustomModal>
  );
}
