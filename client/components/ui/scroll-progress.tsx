import { useState, useEffect } from 'react';
import { Progress } from './progress';

export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollTop = document.documentElement.scrollTop;
      
      const maxScroll = scrollHeight - clientHeight;
      const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress(); // Initial calculation

    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-background/20 backdrop-blur-sm">
      <div
        className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 transition-all duration-300 ease-out relative"
        style={{
          width: `${scrollProgress}%`,
          boxShadow: scrollProgress > 0 ? '0 0 10px rgba(124, 58, 237, 0.5)' : 'none'
        }}
      >
        {/* Glowing effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 opacity-50 blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500" />
      </div>
    </div>
  );
}
