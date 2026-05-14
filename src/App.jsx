import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { Toaster as Sonner } from 'sonner';
import Home from './pages/Home';
import BuildCV from './pages/BuildCV';
import Templates from './pages/Templates';
import SavedCVs from './pages/SavedCVs';
import Pro from './pages/Pro';
import CoverLetter from './pages/CoverLetter';
import InterviewPrep from './pages/InterviewPrep';
import Privacy from './pages/Privacy';
import RecruiterXRay from './pages/RecruiterXRay';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') return <UserNotRegisteredError />;
    else if (authError.type === 'auth_required') { navigateToLogin(); return null; }
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/build" element={<BuildCV />} />
      <Route path="/templates" element={<Templates />} />
      <Route path="/saved" element={<SavedCVs />} />
      <Route path="/pro" element={<Pro />} />
      <Route path="/cover-letter" element={<CoverLetter />} />
      <Route path="/interview" element={<InterviewPrep />} />
      <Route path="/x-ray" element={<RecruiterXRay />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
        <Sonner position="top-center" richColors />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;