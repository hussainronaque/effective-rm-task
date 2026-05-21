import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/"        element={<App />} />
          <Route path="/login"   element={<LoginPage />} />
          <Route path="/signup"  element={<SignupPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
