import { useState, useEffect } from 'react';
import { AuthLayout } from './components/AuthLayout';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { FileManager } from './components/FileManager';
import { AboutUs } from './components/AboutUs';
// FeedbackAdmin component not available in components directory.
// Provide a lightweight local fallback to avoid import errors.
const FeedbackAdmin = () => (
  <div style={{ padding: 20, color: '#cbd5e1' }}>Admin feedback panel is unavailable.</div>
);
import { api, type User } from './api';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentTab, setCurrentTab] = useState('chat');
  const [activeDoc, setActiveDoc] = useState<string | null>(null);

  // Check auth and initial active document status
  const checkAuth = async () => {
    const token = localStorage.getItem('mrp_token');
    if (!token) {
      setCheckingAuth(false);
      return;
    }
    
    try {
      const data = await api.me();
      setUser(data.user);
    } catch (err) {
      console.warn('Session check failed:', err);
    } finally {
      setCheckingAuth(false);
    }
  };

  const checkActiveDoc = async () => {
    try {
      const data = await api.currentDocument();
      setActiveDoc(data.filename);
    } catch (err) {
      console.error('Failed to get active document status', err);
    }
  };

  useEffect(() => {
    checkAuth();
    checkActiveDoc();
  }, []);

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    checkActiveDoc();
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
  };

  if (checkingAuth) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        background: '#080c14',
        color: '#f8fafc',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(255,255,255,0.05)',
          borderTopColor: '#00f2fe',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '16px'
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <span>Verifying secure credentials...</span>
      </div>
    );
  }

  if (!user) {
    return <AuthLayout onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="app-container">
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        onLogout={handleLogout}
        activeDoc={activeDoc}
      />
      
      <main className="main-content">
        {currentTab === 'chat' && (
          <ChatInterface activeDoc={activeDoc} onDocChange={checkActiveDoc} />
        )}
        {currentTab === 'files' && (
          <FileManager activeDoc={activeDoc} onDocChange={checkActiveDoc} />
        )}
        {currentTab === 'about' && (
          <AboutUs />
        )}
        {currentTab === 'feedback' && (
          <FeedbackAdmin />
        )}
      </main>
    </div>
  );
}

export default App;