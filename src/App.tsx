// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './pages/SignupPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import MyOrdersPage from './pages/MyOrdersPage.tsx';
import LandingPage from './pages/LandingPage.tsx'; // Import the new page
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} /> {/* Set LandingPage as the default */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
