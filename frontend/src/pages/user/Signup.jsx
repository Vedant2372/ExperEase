import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../../api/api';
import './Auth.css';

export default function Signup() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(name, username, email, password);
      navigate('/verify-otp', { state: { email } });
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p className="auth-subtitle">ExpertEase - Healthcare at your fingertips</p>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          <label><span>Full Name</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. John Doe" required />
          </label>
          <label><span>Username</span>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" required />
          </label>
          <label><span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="doctor@example.com" required />
          </label>
          <label><span>Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </label>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
