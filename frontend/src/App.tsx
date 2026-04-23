import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import SwipePage from './pages/SwipePage';
import SavedPage from './pages/SavedPage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';
import { api } from './api';

type Page = 'login' | 'signup' | 'profile' | 'swipe' | 'saved' | 'settings' | 'admin';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      checkProfile();
    }
  }, []);

  const checkProfile = async () => {
    try {
      await api.getProfile();
      setHasProfile(true);
      setCurrentPage('swipe');
    } catch {
      setHasProfile(false);
      setCurrentPage('profile');
    }
  };

  const handleLogin = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    checkProfile();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setHasProfile(false);
    setCurrentPage('login');
  };

  const handleProfileCreated = () => {
    setHasProfile(true);
    setCurrentPage('swipe');
  };

  if (!isAuthenticated) {
    return currentPage === 'signup' ? (
      <SignupPage onSignup={handleLogin} onSwitchToLogin={() => setCurrentPage('login')} />
    ) : (
      <LoginPage onLogin={handleLogin} onSwitchToSignup={() => setCurrentPage('signup')} />
    );
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">💊 Trial Matcher</div>
        <div className="nav-links">
          <button onClick={() => setCurrentPage('swipe')} className={currentPage === 'swipe' ? 'active' : ''}>
            Discover
          </button>
          <button onClick={() => setCurrentPage('saved')} className={currentPage === 'saved' ? 'active' : ''}>
            Saved
          </button>
          <button onClick={() => setCurrentPage('settings')} className={currentPage === 'settings' ? 'active' : ''}>
            Settings
          </button>
          <button onClick={() => setCurrentPage('admin')} className={currentPage === 'admin' ? 'active' : ''}>
            Analytics
          </button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <main className="main-content">
        {!hasProfile && currentPage !== 'profile' ? (
          <ProfilePage onProfileCreated={handleProfileCreated} />
        ) : (
          <>
            {currentPage === 'profile' && <ProfilePage onProfileCreated={handleProfileCreated} />}
            {currentPage === 'swipe' && <SwipePage />}
            {currentPage === 'saved' && <SavedPage />}
            {currentPage === 'settings' && <SettingsPage />}
            {currentPage === 'admin' && <AdminPage />}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
