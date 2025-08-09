import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Library,
  Compass,
  Home,
  Moon,
  Sun,
  Menu,
  User,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { AuthModal } from "./auth-modal";
import { UserProfile } from "./user-profile";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NavigationProps {
  onSearch?: (query: string) => void;
  isDark?: boolean;
  onThemeToggle?: () => void;
}

export function Navigation({
  onSearch,
  isDark,
  onThemeToggle,
}: NavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const { isAuthenticated, user } = useAuth();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/catalog", label: "Catalog", icon: Compass },
    { href: "/library", label: "Library", icon: Library },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to catalog with search query
      navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
      onSearch?.(searchQuery);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-anime-gradient rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-lg">🧩</span>
            </div>
            <span className="gradient-text font-bold text-xl">AniKam</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-white/10",
                  location.pathname === href
                    ? "text-primary bg-primary/10 font-medium"
                    : "text-foreground/80 hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search anime, manga..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-glass/50 border-glass-border/50 focus:bg-glass/80 transition-all"
                />
              </div>
            </form>
          </div>

          {/* Theme Toggle, Auth & Mobile Menu */}
          <div className="flex items-center space-x-2">
            {/* Login/Profile Button */}
            {!isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden md:flex border-primary/20 hover:bg-primary/5"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            ) : (
              <div className="hidden md:block">
                <UserProfile />
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={onThemeToggle}
              className="w-9 h-9 p-0 hover:bg-white/10"
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden w-9 h-9 p-0 hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-fade-in">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search anime, manga..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-glass/50 border-glass-border/50 focus:bg-glass/80"
                />
              </div>
            </form>

            {/* Mobile Navigation Links */}
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                  location.pathname === href
                    ? "text-primary bg-primary/10 font-medium"
                    : "text-foreground/80 hover:text-foreground hover:bg-white/10"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            ))}

            {/* Mobile Auth Button */}
            {!isAuthenticated ? (
              <Button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-anime-gradient hover:opacity-90 text-white"
              >
                <User className="w-5 h-5 mr-2" />
                Sign In
              </Button>
            ) : (
              <div className="px-4 py-3 border-t border-glass-border/50 mt-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-anime-gradient rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {user?.avatar || user?.username?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{user?.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <UserProfile />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      </div>
    </nav>
  );
}
