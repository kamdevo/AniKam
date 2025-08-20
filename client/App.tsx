import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navigation } from "./components/navigation";
import { ScrollProgress } from "./components/ui/scroll-progress";
import { NetworkStatusNotification } from "./components/ui/network-status";
import { ProtectedRoute } from "./components/protected-route";
import { AuthProvider } from "./contexts/auth-context";
import { Toaster } from "sonner";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import Library from "./pages/Library";
import AnimeDetails from "./pages/AnimeDetails";
import NotFound from "./pages/NotFound";
import Tracker from "@openreplay/tracker";

const tracker = new Tracker({
  projectKey: "Oa7Tm6o3GOFjRutwamQS",
});
tracker.start();

function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const handleThemeToggle = () => {
    setIsDark(!isDark);
  };

  const handleSearch = (query: string) => {
    // TODO: Implement global search functionality
    console.log("Searching for:", query);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background">
          <ScrollProgress />
          <Navigation
            onSearch={handleSearch}
            isDark={isDark}
            onThemeToggle={handleThemeToggle}
          />

          <main>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/library" element={<Library />} />
              <Route path="/anime/:id" element={<AnimeDetails />} />
              <Route
                path="/manga/:id"
                element={<AnimeDetails type="manga" />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={4000}
          />

          {/* Network Status */}
          <NetworkStatusNotification />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
