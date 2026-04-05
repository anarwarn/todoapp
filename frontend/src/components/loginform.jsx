import { useState } from 'react';
import './loginform.css';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? '/users/register' : '/users/login';
    setLoading(true);
    
    try {
      const res = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage(data.message);
        setUser(data.username);
        setUsername('');
        setPassword('');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:3000/users/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (res.ok) {
        setUser(null);
        setMessage('Logged out successfully');
      }
    } catch (error) {
      setMessage('Logout error: ' + error.message);
    }
  };

  if (user) {
    return (
      <div className="welcome-container">
        <div className="welcome-card">
          <div className="welcome-icon">👤</div>
          <h1>Welcome back, <span className="username">{user}</span>!</h1>
          <p>You're successfully logged in</p>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      
      <div className="auth-card" style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
        <div className="auth-header">
          <h2 className="auth-title">{isRegister ? '✨ Create Account' : '🔐 Login'}</h2>
          <p className="auth-subtitle">{isRegister ? 'Join us today' : 'Welcome back'}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="auth-input"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? '⏳ Processing...' : isRegister ? '✅ Sign Up' : '→ Login'}
          </button>
        </form>

        <button
          onClick={() => { setIsRegister(!isRegister); setMessage(''); }}
          className="toggle-btn"
        >
          {isRegister ? '👤 Already have account? Login' : '✨ Create new account'}
        </button>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </div>

      <div className="background-decoration"></div>
    </div>
  );
}
