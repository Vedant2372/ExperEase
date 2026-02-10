import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOtp } from '../../api/api';
import './Auth.css';

export default function VerifyOtp() {
  const { state } = useLocation();
  const email = state?.email || '';
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyOtp(email, otp);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Verify Email</h1>
        <p className="auth-subtitle">Enter OTP sent to {email}</p>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          <label><span>OTP</span>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit code" required />
          </label>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      </div>
    </div>
  );
}
