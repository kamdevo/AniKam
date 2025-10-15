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
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold gradient-text mb-2">Mi Perfil</h1>
          <p className="text-muted-foreground">
            Personaliza tu perfil y configuraciones
          </p>
        </motion.div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Apariencia
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Contenido
            </TabsTrigger>
            <TabsTrigger value="language" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Idioma
            </TabsTrigger>
          </TabsList>

          {/* Perfil Tab - Customización completa */}
          <TabsContent value="profile">
            <div className="space-y-6">
              {/* Banner y Avatar */}
              <GlassCard className="relative overflow-hidden">
                {/* Banner */}
                <div className="relative h-48 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500">
                  {user.banner && (
                    <img
                      src={user.banner}
                      alt="Banner"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Información del perfil */}
                <div className="p-6 relative">
                  {/* Avatar */}
                  <div className="absolute -top-16 left-6">
                    <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 p-1 shadow-lg">
                      <RobustAvatar
                        src={user.avatar}
                        fallback={getInitials(user.displayName || user.username)}
                        alt="Profile Avatar"
                        size="lg"
                        className="w-full h-full"
                      />
                    </div>
                  </div>

                  {/* Información básica */}
                  <div className="ml-32 flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold gradient-text">
                        {user.displayName || user.username}
                      </h1>
                      <p className="text-muted-foreground">@{user.username}</p>
                      {user.bio && (
                        <p className="text-sm text-muted-foreground mt-2 max-w-md">
                          {user.bio}
                        </p>
                      )}
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
                </div>
              </GlassCard>

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
                      <GlassCard className="p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Upload className="w-5 h-5" />
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
                      <GlassCard className="p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <User className="w-5 h-5" />
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
                          <Label className="text-sm font-medium mb-3 block">O elige un avatar predeterminado:</Label>
                          <div className="grid grid-cols-10 gap-2">
                            {DEFAULT_ANIME_AVATARS.map((avatar, index) => (
                              <button
                                key={index}
                                onClick={() => handleAvatarSelect(avatar)}
                                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-lg transition-colors"
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
                      <GlassCard className="p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Edit3 className="w-5 h-5" />
                          Editar Información
                        </h3>
                        
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="displayName">Nombre para mostrar</Label>
                            <Input
                              id="displayName"
                              value={formData.displayName}
                              onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                              placeholder="Tu nombre completo"
                            />
                          </div>

                          <div>
                            <Label htmlFor="bio">Biografía</Label>
                            <Textarea
                              id="bio"
                              value={formData.bio}
                              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                              placeholder="Cuéntanos sobre ti..."
                              rows={3}
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                          <Button variant="outline" onClick={handleCancel}>
                            Cancelar
                          </Button>
                          <Button onClick={handleSave} disabled={isLoading}>
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
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Preferencias de Apariencia
              </h3>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Tema</Label>
                  <Select
                    value={formData.themePreference}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, themePreference: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">🌞 Claro</SelectItem>
                      <SelectItem value="dark">🌙 Oscuro</SelectItem>
                      <SelectItem value="auto">🔄 Automático</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
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
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Filtros de Contenido
              </h3>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Nivel de Filtro</Label>
                  <Select
                    value={formData.contentFilter}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, contentFilter: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="safe">🛡️ Seguro - Solo contenido familiar</SelectItem>
                      <SelectItem value="all">🌟 Todo - Contenido general</SelectItem>
                      <SelectItem value="mature">🔞 Maduro - Incluye contenido para adultos</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
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
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Configuración de Idioma
              </h3>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Idioma de la Interfaz</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">🇪🇸 Español</SelectItem>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="ja">🇯🇵 日本語</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
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
