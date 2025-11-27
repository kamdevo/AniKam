import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Edit3,
  Save,
  X,
  Camera,
  Upload,
  Settings,
  Shield,
  Palette,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassCard } from "@/components/ui/glass-card";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { RobustAvatar, getInitials } from "@/components/robust-avatar";
import { FileUpload } from "@/components/file-upload";
import { useAvatarUpload, useBannerUpload } from "@/hooks/use-file-upload";
import { useImageUploadFallback } from "@/hooks/use-image-upload-fallback";

// Avatars anime por defecto
const DEFAULT_ANIME_AVATARS = [
  "🧙‍♂️", "🧙‍♀️", "🦸‍♂️", "🦸‍♀️", "👨‍🎤", "👩‍🎤", "🥷", "👺", "👹", "🤖",
  "👽", "🧚‍♂️", "🧚‍♀️", "🧝‍♂️", "🧝‍♀️", "🧞‍♂️", "🧞‍♀️", "🧛‍♂️", "🧛‍♀️", "🐱‍👤"
];

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  
  // Hooks para subida de archivos
  const avatarUpload = useAvatarUpload();
  const bannerUpload = useBannerUpload();
  const fallbackUpload = useImageUploadFallback();

  // Form state
  const [formData, setFormData] = useState({
    displayName: user?.displayName || user?.username || "",
    bio: user?.bio || "",
    contentFilter: user?.contentFilter || "all",
    themePreference: user?.themePreference || "auto",
    language: user?.language || "es",
  });

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || user.username || "",
        bio: user.bio || "",
        contentFilter: user.contentFilter || "all",
        themePreference: user.themePreference || "auto",
        language: user.language || "es",
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Acceso Requerido</h2>
          <p className="text-muted-foreground">Debes iniciar sesión para ver tu perfil</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar el perfil");
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: user.displayName || user.username || "",
      bio: user.bio || "",
      contentFilter: user.contentFilter || "all",
      themePreference: user.themePreference || "auto",
      language: user.language || "es",
    });
    setIsEditing(false);
  };

  const handleAvatarSelect = async (avatar: string) => {
    try {
      await updateProfile({ avatar });
      setShowAvatarPicker(false);
      toast.success("Avatar actualizado");
    } catch (error) {
      toast.error("Error al actualizar avatar");
    }
  };

  // Funciones de upload con fallback
  const handleAvatarUpload = async (file: File) => {
    console.log("🔄 Intentando subir avatar...");
    
    // Intentar Supabase Storage primero
    let result = await avatarUpload.uploadFile(file, `avatar-${user.id}`);
    
    // Si falla por bucket no encontrado, usar fallback base64
    if (result.error && result.error.includes('Bucket not found')) {
      console.log("📦 Storage no disponible, usando fallback base64...");
      result = await fallbackUpload.convertToBase64(file);
    }
    
    if (result.url) {
      await updateProfile({ avatar: result.url });
      toast.success("Avatar actualizado correctamente");
    }
    return result;
  };

  const handleBannerUpload = async (file: File) => {
    console.log("🔄 Intentando subir banner...");
    
    // Intentar Supabase Storage primero
    let result = await bannerUpload.uploadFile(file, `banner-${user.id}`);
    
    // Si falla por bucket no encontrado, usar fallback base64
    if (result.error && result.error.includes('Bucket not found')) {
      console.log("📦 Storage no disponible, usando fallback base64...");
      result = await fallbackUpload.convertToBase64(file);
    }
    
    if (result.url) {
      await updateProfile({ banner: result.url });
      toast.success("Banner actualizado correctamente");
    }
    return result;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-background-secondary h-12">
            <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-background-elevated data-[state=active]:shadow-sm">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2 data-[state=active]:bg-background-elevated data-[state=active]:shadow-sm">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Apariencia</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2 data-[state=active]:bg-background-elevated data-[state=active]:shadow-sm">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Contenido</span>
            </TabsTrigger>
            <TabsTrigger value="language" className="flex items-center gap-2 data-[state=active]:bg-background-elevated data-[state=active]:shadow-sm">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Idioma</span>
            </TabsTrigger>
          </TabsList>

          {/* Perfil Tab - Customización completa */}
          <TabsContent value="profile">
            <div className="space-y-6">
              {/* Banner y Avatar - Improved Structure */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <GlassCard className="relative overflow-hidden bg-background-elevated border-0 shadow-lg">
                  {/* Banner */}
                  <div className="relative h-32 sm:h-48 bg-gradient-to-br from-primary via-secondary to-accent">
                    {user.banner && (
                      <img
                        src={user.banner}
                        alt="Banner"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  {/* Profile Info Section */}
                  <div className="relative px-4 sm:px-6 pb-6">
                    {/* Avatar */}
                    <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-16">
                      <div className="relative">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-background-elevated p-1.5 shadow-xl ring-4 ring-background">
                          <RobustAvatar
                            src={user.avatar}
                            fallback={getInitials(user.displayName || user.username)}
                            alt="Profile Avatar"
                            size="lg"
                            className="w-full h-full rounded-xl"
                          />
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="flex-1 sm:mb-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                              {user.displayName || user.username}
                            </h1>
                            <p className="text-foreground-secondary text-sm sm:text-base">@{user.username}</p>
                          </div>
                          <Button
                            onClick={() => {
                              if (isEditing) {
                                handleCancel();
                              } else {
                                setIsEditing(true);
                              }
                            }}
                            variant={isEditing ? "outline" : "default"}
                            className="w-full sm:w-auto"
                          >
                            {isEditing ? (
                              <>
                                <X className="w-4 h-4 mr-2" />
                                Cancelar
                              </>
                            ) : (
                              <>
                                <Edit3 className="w-4 h-4 mr-2" />
                                Editar Perfil
                              </>
                            )}
                          </Button>
                        </div>
                        
                        {user.bio && (
                          <p className="text-foreground-secondary mt-3 text-sm sm:text-base max-w-2xl">
                            {user.bio}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-6 pt-6 border-t border-border">
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-primary">
                          {user.stats?.animeWatched || 0}
                        </div>
                        <div className="text-xs sm:text-sm text-foreground-tertiary mt-1">
                          Anime
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-secondary">
                          {user.stats?.mangaRead || 0}
                        </div>
                        <div className="text-xs sm:text-sm text-foreground-tertiary mt-1">
                          Manga
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-accent">
                          {user.stats?.totalRatings || 0}
                        </div>
                        <div className="text-xs sm:text-sm text-foreground-tertiary mt-1">
                          Valoraciones
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Secciones de Edición - Solo aparecen cuando isEditing es true */}
              <AnimatePresence>
                {isEditing && (
                  <>
                    {/* Subida de Banner */}
                    <motion.div
                      initial={{ opacity: 0, y: -20, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -20, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <GlassCard className="p-6 bg-background-elevated border-0 shadow-md">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                          <Upload className="w-5 h-5 text-primary" />
                          Banner de Perfil
                        </h3>
                        <FileUpload
                          variant="banner"
                          currentImageUrl={user.banner || undefined}
                          onFileSelect={() => {}}
                          onUpload={handleBannerUpload}
                          isUploading={bannerUpload.isUploading}
                          uploadProgress={bannerUpload.uploadProgress}
                          maxSize={5}
                        />
                      </GlassCard>
                    </motion.div>

                    {/* Subida de Avatar */}
                    <motion.div
                      initial={{ opacity: 0, y: -20, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -20, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut", delay: 0.1 }}
                    >
                      <GlassCard className="p-6 bg-background-elevated border-0 shadow-md">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                          <Camera className="w-5 h-5 text-primary" />
                          Avatar de Perfil
                        </h3>
                        <div className="flex items-center gap-6 mb-6">
                          <RobustAvatar
                            src={user.avatar}
                            fallback={getInitials(user.displayName || user.username)}
                            alt="Current Avatar"
                            size="lg"
                            className="w-24 h-24"
                          />
                          <div className="flex-1">
                            <FileUpload
                              variant="avatar"
                              currentImageUrl={user.avatar?.startsWith('http') ? user.avatar : undefined}
                              onFileSelect={() => {}}
                              onUpload={handleAvatarUpload}
                              isUploading={avatarUpload.isUploading}
                              uploadProgress={avatarUpload.uploadProgress}
                              maxSize={2}
                              className="max-w-xs"
                            />
                          </div>
                        </div>

                        {/* Avatars predeterminados */}
                        <div>
                          <Label className="text-sm font-medium mb-3 block text-foreground">O elige un avatar predeterminado:</Label>
                          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                            {DEFAULT_ANIME_AVATARS.map((avatar, index) => (
                              <button
                                key={index}
                                onClick={() => handleAvatarSelect(avatar)}
                                className="w-10 h-10 rounded-xl bg-background-secondary hover:bg-background-tertiary flex items-center justify-center text-lg transition-all hover:scale-110 border border-border"
                              >
                                {avatar}
                              </button>
                            ))}
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>

                    {/* Información Personal */}
                    <motion.div
                      initial={{ opacity: 0, y: -20, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -20, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut", delay: 0.2 }}
                    >
                      <GlassCard className="p-6 bg-background-elevated border-0 shadow-md">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                          <Edit3 className="w-5 h-5 text-primary" />
                          Editar Información
                        </h3>
                        
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="displayName" className="text-foreground">Nombre para mostrar</Label>
                            <Input
                              id="displayName"
                              value={formData.displayName}
                              onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                              placeholder="Tu nombre completo"
                              className="bg-background-secondary border-border focus:bg-background-tertiary"
                            />
                          </div>

                          <div>
                            <Label htmlFor="bio" className="text-foreground">Biografía</Label>
                            <Textarea
                              id="bio"
                              value={formData.bio}
                              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                              placeholder="Cuéntanos sobre ti..."
                              rows={3}
                              className="bg-background-secondary border-border focus:bg-background-tertiary"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
                          <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
                            Cancelar
                          </Button>
                          <Button onClick={handleSave} disabled={isLoading} className="w-full sm:w-auto">
                            <Save className="w-4 h-4 mr-2" />
                            {isLoading ? "Guardando..." : "Guardar Cambios"}
                          </Button>
                        </div>
                      </GlassCard>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>

          {/* Apariencia Tab */}
          <TabsContent value="appearance">
            <GlassCard className="p-6 bg-background-elevated border-0 shadow-md">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                <Palette className="w-5 h-5 text-primary" />
                Preferencias de Apariencia
              </h3>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block text-foreground">Tema</Label>
                  <Select
                    value={formData.themePreference}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, themePreference: value as any }))}
                  >
                    <SelectTrigger className="bg-background-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">🌞 Claro</SelectItem>
                      <SelectItem value="dark">🌙 Oscuro</SelectItem>
                      <SelectItem value="auto">🔄 Automático</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-foreground-tertiary mt-2">
                    El tema automático cambia según la configuración de tu sistema
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </div>
              </div>
            </GlassCard>
          </TabsContent>

          {/* Contenido Tab */}
          <TabsContent value="content">
            <GlassCard className="p-6 bg-background-elevated border-0 shadow-md">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                <Shield className="w-5 h-5 text-primary" />
                Filtros de Contenido
              </h3>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block text-foreground">Nivel de Filtro</Label>
                  <Select
                    value={formData.contentFilter}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, contentFilter: value as any }))}
                  >
                    <SelectTrigger className="bg-background-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="safe">🛡️ Seguro - Solo contenido familiar</SelectItem>
                      <SelectItem value="all">🌟 Todo - Contenido general</SelectItem>
                      <SelectItem value="mature">🔞 Maduro - Incluye contenido para adultos</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-foreground-tertiary mt-2">
                    Controla qué tipo de contenido anime y manga se muestra
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </div>
              </div>
            </GlassCard>
          </TabsContent>

          {/* Idioma Tab */}
          <TabsContent value="language">
            <GlassCard className="p-6 bg-background-elevated border-0 shadow-md">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                <Globe className="w-5 h-5 text-primary" />
                Configuración de Idioma
              </h3>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block text-foreground">Idioma de la Interfaz</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger className="bg-background-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">🇪🇸 Español</SelectItem>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="ja">🇯🇵 日本語</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-foreground-tertiary mt-2">
                    Idioma principal de la aplicación
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </div>
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
