import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Image,
  Shield,
  Palette,
  Globe,
  Bell,
  Lock,
  Trash2,
  Save,
  Camera,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { GlassCard } from "@/components/ui/glass-card";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { RobustAvatar, getInitials } from "@/components/robust-avatar";
import { FileUpload } from "@/components/file-upload";
import { useAvatarUpload, useBannerUpload } from "@/hooks/use-file-upload";

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para formularios
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || "",
    bio: user?.bio || "",
    contentFilter: user?.contentFilter || "all",
    themePreference: user?.themePreference || "auto",
    language: user?.language || "es"
  });

  // Hooks para subida de archivos
  const avatarUpload = useAvatarUpload();
  const bannerUpload = useBannerUpload();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Acceso Requerido</h2>
          <p className="text-muted-foreground">Debes iniciar sesión para acceder a la configuración.</p>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      await updateProfile(profileData);
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar el perfil");
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    const result = await avatarUpload.uploadFile(file, `avatar-${user.id}`);
    if (result.url) {
      await updateProfile({ avatar: result.url });
      toast.success("Avatar actualizado correctamente");
    }
    return result;
  };

  const handleBannerUpload = async (file: File) => {
    const result = await bannerUpload.uploadFile(file, `banner-${user.id}`);
    if (result.url) {
      await updateProfile({ banner: result.url });
      toast.success("Banner actualizado correctamente");
    }
    return result;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-primary mb-2">Configuración</h1>
          <p className="text-muted-foreground">
            Personaliza tu experiencia en AniKam
          </p>
        </motion.div>

        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
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
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Privacidad
            </TabsTrigger>
          </TabsList>


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
                    value={profileData.themePreference}
                    onValueChange={(value) => setProfileData(prev => ({ ...prev, themePreference: value as any }))}
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

                <Separator />

                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={isLoading}>
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
                    value={profileData.contentFilter}
                    onValueChange={(value) => setProfileData(prev => ({ ...prev, contentFilter: value as any }))}
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

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    ℹ️ Información sobre Filtros
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li><strong>Seguro:</strong> Solo anime y manga apropiados para todas las edades</li>
                    <li><strong>Todo:</strong> Contenido general, excluyendo material explícito</li>
                    <li><strong>Maduro:</strong> Incluye todo el contenido, incluyendo series para adultos</li>
                  </ul>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={isLoading}>
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
                    value={profileData.language}
                    onValueChange={(value) => setProfileData(prev => ({ ...prev, language: value }))}
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

                <Separator />

                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </div>
              </div>
            </GlassCard>
          </TabsContent>

          {/* Privacidad Tab */}
          <TabsContent value="privacy">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Privacidad y Seguridad
              </h3>
              
              <div className="space-y-6">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                    🔒 Tu Privacidad es Importante
                  </h4>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    AniKam respeta tu privacidad. Tus datos personales están protegidos y nunca se comparten con terceros sin tu consentimiento.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Perfil Público</h4>
                      <p className="text-sm text-muted-foreground">
                        Permite que otros usuarios vean tu perfil básico
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Lista de Anime Pública</h4>
                      <p className="text-sm text-muted-foreground">
                        Permite que otros vean tu lista de anime
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notificaciones por Email</h4>
                      <p className="text-sm text-muted-foreground">
                        Recibe actualizaciones sobre nuevos episodios
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium text-red-600 dark:text-red-400">Zona de Peligro</h4>
                  
                  <div className="border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <h5 className="font-medium mb-2">Eliminar Cuenta</h5>
                    <p className="text-sm text-muted-foreground mb-4">
                      Esta acción eliminará permanentemente tu cuenta y todos tus datos. No se puede deshacer.
                    </p>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar Cuenta
                    </Button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
