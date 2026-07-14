import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import { api, type User } from '../api';

interface AuthLayoutProps {
  onAuthSuccess: (user: User) => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Front-end Validation
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      setError('Only Gmail addresses (@gmail.com) are allowed.');
      return;
    }

    if (!isLogin && password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const response = await api.login(email, password);
        onAuthSuccess(response.user);
      } else {
        const response = await api.register(email, password, name || undefined);
        onAuthSuccess(response.user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">MRP Platform</h2>
        <p className="auth-subtitle">
          {isLogin 
            ? 'Access the Medical Research Paper RAG Model' 
            : 'Create an account to search and query medical studies'
          }
        </p>

        {error && (
          <div className="error-banner">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-container">
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <UserIcon className="input-icon" size={18} />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Gmail Address</label>
            <div className="input-container">
              <input
                id="email"
                type="email"
                required
                placeholder="yourname@gmail.com"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail className="input-icon" size={18} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock className="input-icon" size={18} />
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <button 
                className="auth-link" 
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => {
                  setIsLogin(false);
                  setError(null);
                }}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button 
                className="auth-link" 
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => {
                  setIsLogin(true);
                  setError(null);
                }}
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
