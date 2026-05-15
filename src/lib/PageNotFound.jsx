import { Link, useLocation } from 'react-router-dom';

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1) || 'unknown';

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full text-center space-y-6 bg-white border border-border rounded-3xl p-8 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-7xl font-light text-muted-foreground/40">404</h1>
          <div className="h-0.5 w-16 bg-border mx-auto" />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-foreground">Page not found</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The page <span className="font-medium text-foreground">"/{pageName}"</span> is not available in HireReady.
          </p>
        </div>

        <div className="bg-primary/5 rounded-2xl p-4 text-left">
          <p className="text-xs font-semibold text-foreground mb-1">No problem.</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Go back home and continue building your CV, cover letter, or interview prep. No login check is needed.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-primary-foreground bg-primary rounded-xl hover:opacity-90 transition-opacity"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
