import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Camera,
  Edit3,
  Save,
  X,
  Settings,
  Shield,
  Palette,
  Globe,
  Upload,
  Image as ImageIcon,
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

// Avatars anime por defecto
const DEFAULT_ANIME_AVATARS = [
  "🧙‍♂️", "🧙‍♀️", "🦸‍♂️", "🦸‍♀️", "👨‍🎤", "👩‍🎤", "🥷", "👺", "👹", "🤖",
  "👽", "🧚‍♂️", "🧚‍♀️", "🧝‍♂️", "🧝‍♀️", "🧞‍♂️", "🧞‍♀️", "🧛‍♂️", "🧛‍♀️", "🐱‍👤"
];

// Banners por defecto
const DEFAULT_BANNERS = [
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=300&fit=crop",
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=300&fit=crop&sat=-100",
  "https://images.unsplash.com/photo-1519681393784-d120c3b0c1d4?w=1200&h=300&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=300&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&h=300&fit=crop",
];

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showBannerPicker, setShowBannerPicker] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    displayName: user?.displayName || user?.username || "",
    username: user?.username || "",
    bio: user?.bio || "",
    contentFilter: user?.contentFilter || "all",
    themePreference: user?.themePreference || "auto",
    language: user?.language || "es",
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Debes iniciar sesión para ver tu perfil</p>
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
      displayName: user?.displayName || user?.username || "",
      username: user?.username || "",
      bio: user?.bio || "",
      contentFilter: user?.contentFilter || "all",
      themePreference: user?.themePreference || "auto",
      language: user?.language || "es",
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

  const handleBannerSelect = async (banner: string) => {
    try {
      await updateProfile({ banner });
      setShowBannerPicker(false);
      toast.success("Banner actualizado");
    } catch (error) {
      toast.error("Error al actualizar banner");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header con banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8"
        >
          <GlassCard className="overflow-hidden">
            {/* Banner */}
            <div 
              className="h-48 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 relative group cursor-pointer"
              style={{
                backgroundImage: user.banner ? `url(${user.banner})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              onClick={() => setShowBannerPicker(true)}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Información del perfil */}
            <div className="p-6 relative">
              {/* Avatar */}
              <div className="absolute -top-16 left-6">
                <div 
                  className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 p-1 shadow-lg group cursor-pointer relative"
                  onClick={() => setShowAvatarPicker(true)}
                >
                  <RobustAvatar
                    src={user.avatar}
                    fallback={getInitials(user.displayName || user.username)}
                    alt="Profile Avatar"
                    size="lg"
                    className="w-full h-full group-hover:opacity-80 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
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
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "outline" : "default"}
                  className="bg-anime-gradient hover:opacity-90"
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
        </motion.div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel principal */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">
                  <User className="w-4 h-4 mr-2" />
                  Perfil
                </TabsTrigger>
                <TabsTrigger value="preferences">
                  <Settings className="w-4 h-4 mr-2" />
                  Preferencias
                </TabsTrigger>
                <TabsTrigger value="privacy">
                  <Shield className="w-4 h-4 mr-2" />
                  Privacidad
                </TabsTrigger>
              </TabsList>

              {/* Tab de Perfil */}
              <TabsContent value="profile">
                <GlassCard className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Información Personal</h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="displayName">Nombre para mostrar</Label>
                        <Input
                          id="displayName"
                          value={formData.displayName}
                          onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                          disabled={!isEditing}
                          className="bg-glass/50"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="username">Nombre de usuario</Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                          disabled={!isEditing}
                          className="bg-glass/50"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio">Biografía</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="Cuéntanos sobre ti..."
                        className="bg-glass/50 min-h-[100px]"
                      />
                    </div>

                    <div>
                      <Label>Email</Label>
                      <Input
                        value={user.email}
                        disabled
                        className="bg-glass/30 text-muted-foreground"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        El email no se puede cambiar
                      </p>
                    </div>

                    {isEditing && (
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={handleSave}
                          disabled={isLoading}
                          className="bg-anime-gradient hover:opacity-90"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {isLoading ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                        >
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </TabsContent>

              {/* Tab de Preferencias */}
              <TabsContent value="preferences">
                <GlassCard className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Preferencias</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="theme">
                        <Palette className="w-4 h-4 inline mr-2" />
                        Tema
                      </Label>
                      <Select
                        value={formData.themePreference}
                        onValueChange={(value: any) => setFormData(prev => ({ ...prev, themePreference: value }))}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="bg-glass/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Claro</SelectItem>
                          <SelectItem value="dark">Oscuro</SelectItem>
                          <SelectItem value="auto">Automático</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="language">
                        <Globe className="w-4 h-4 inline mr-2" />
                        Idioma
                      </Label>
                      <Select
                        value={formData.language}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="bg-glass/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ja">日本語</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {isEditing && (
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={handleSave}
                          disabled={isLoading}
                          className="bg-anime-gradient hover:opacity-90"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {isLoading ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                        >
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </TabsContent>

              {/* Tab de Privacidad */}
              <TabsContent value="privacy">
                <GlassCard className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Filtro de Contenido</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="contentFilter">
                        <Shield className="w-4 h-4 inline mr-2" />
                        Nivel de filtro
                      </Label>
                      <Select
                        value={formData.contentFilter}
                        onValueChange={(value: any) => setFormData(prev => ({ ...prev, contentFilter: value }))}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="bg-glass/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="safe">Seguro - Solo contenido familiar</SelectItem>
                          <SelectItem value="all">Todo - Incluye contenido maduro</SelectItem>
                          <SelectItem value="mature">Maduro - Solo contenido para adultos</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Controla qué tipo de contenido quieres ver en la aplicación
                      </p>
                    </div>

                    {isEditing && (
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={handleSave}
                          disabled={isLoading}
                          className="bg-anime-gradient hover:opacity-90"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {isLoading ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                        >
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </TabsContent>
            </Tabs>
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            {/* Estadísticas */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Estadísticas</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Anime vistos</span>
                  <span className="font-semibold">42</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Manga leídos</span>
                  <span className="font-semibold">28</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Horas vistas</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Miembro desde</span>
                  <span className="font-semibold">2024</span>
                </div>
              </div>
            </GlassCard>

            {/* Géneros favoritos */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Géneros Favoritos</h3>
              <div className="flex flex-wrap gap-2">
                {["Acción", "Romance", "Comedia", "Drama", "Fantasía"].map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-anime-gradient text-white text-sm rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Modal de selección de avatar */}
        {showAvatarPicker && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Seleccionar Avatar</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAvatarPicker(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-5 gap-3 mb-4">
                {DEFAULT_ANIME_AVATARS.map((avatar, index) => (
                  <button
                    key={index}
                    onClick={() => handleAvatarSelect(avatar)}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xl hover:scale-110 transition-transform"
                  >
                    {avatar}
                  </button>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    // TODO: Implementar subida de imagen personalizada
                    toast.info("Función de subida de imagen próximamente");
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Subir imagen personalizada
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal de selección de banner */}
        {showBannerPicker && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Seleccionar Banner</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBannerPicker(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {DEFAULT_BANNERS.map((banner, index) => (
                  <button
                    key={index}
                    onClick={() => handleBannerSelect(banner)}
                    className="aspect-[3/1] rounded-lg overflow-hidden hover:scale-105 transition-transform"
                  >
                    <img
                      src={banner}
                      alt={`Banner ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              
              <div className="border-t pt-4 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleBannerSelect("")}
                >
                  Sin banner
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    // TODO: Implementar subida de imagen personalizada
                    toast.info("Función de subida de imagen próximamente");
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Subir personalizado
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
