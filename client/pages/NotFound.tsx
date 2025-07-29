import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <GlassCard className="p-12 space-y-6">
          <div className="text-8xl">😵</div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-bold gradient-text">404</h1>
            <h2 className="text-xl font-semibold">Page Not Found</h2>
            <p className="text-muted-foreground">
              Looks like this page got lost in another dimension. Even our best anime detectives couldn't find it!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link to="/" className="gap-2">
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </Button>
            
            <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
