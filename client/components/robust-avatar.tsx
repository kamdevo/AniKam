import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RobustAvatarProps {
  src?: string | null;
  fallback: string;
  alt?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function RobustAvatar({ 
  src, 
  fallback, 
  alt = "Avatar", 
  className = "",
  size = "md" 
}: RobustAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10", 
    lg: "h-22 w-22"
  };

  // Reset error state when src changes
  useEffect(() => {
    console.log("🖼️ RobustAvatar - src changed:", src);
    if (src) {
      setImageError(false);
      setImageLoaded(false);
    }
  }, [src]);

  const handleImageError = () => {
    console.log("❌ Avatar image failed to load:", src);
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log("✅ Avatar image loaded successfully:", src);
    setImageLoaded(true);
    setImageError(false);
  };

  // Check if we should show the image - PRIORIDAD a picture de Google
  const shouldShowImage = src && 
                         src.startsWith('http') && 
                         !imageError &&
                         src.trim() !== "";

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {shouldShowImage && (
        <AvatarImage
          src={src}
          alt={alt}
          className="object-cover"
          onError={handleImageError}
          onLoad={handleImageLoad}
          // Add cache busting for Google images
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      )}
      <AvatarFallback className="bg-primary text-white text-sm font-medium">
        {/* Show emoji if it's not a URL, otherwise show initials */}
        {src && !src.startsWith('http') ? src : fallback}
      </AvatarFallback>
    </Avatar>
  );
}

// Helper function to get initials
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
