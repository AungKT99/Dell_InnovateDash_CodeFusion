import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Community from './components/Community';
import Challenges from './components/Challenges';
import WellnessDuo from './components/WellnessDuo';
import Profile from './components/Profile';
import FAQ from './components/FAQ';
import Index from './components/Index';
import Onboarding from './components/Onboarding';
import Persona from './components/Persona';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/community" element={<Community />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/wellness-duo" element={<WellnessDuo />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/persona" element={<Persona />} />
      </Routes>
    </Router>
  );
}

export default App; 