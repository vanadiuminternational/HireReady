import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { Toaster as Sonner } from 'sonner';
import Home from './pages/Home';
import BuildCV from './pages/BuildCV';
import Templates from './pages/Templates';
import SavedCVs from './pages/SavedCVs';
import CoverLetter from './pages/CoverLetter';
import InterviewPrep from './pages/InterviewPrep';
import Privacy from './pages/Privacy';
import RecruiterXRay from './pages/RecruiterXRay';

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/build" element={<BuildCV />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/saved" element={<SavedCVs />} />
          <Route path="/cover-letter" element={<CoverLetter />} />
          <Route path="/interview" element={<InterviewPrep />} />
          <Route path="/x-ray" element={<RecruiterXRay />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
      <Toaster />
      <Sonner position="top-center" richColors />
    </QueryClientProvider>
  );
}

export default App;
