import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(username, password);
      localStorage.setItem('token', data.token);
      const userInfo = await import('../api/api').then((m) => m.getUserInfo());
      authLogin(data.token, userInfo);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Purple Header */}
      <div className="bg-purple-600 text-white px-6 py-8 text-center">
        <h1 className="text-2xl font-semibold mb-2">ExpertEase</h1>
        <p className="text-purple-100 text-sm">Healthcare at your fingertips</p>
      </div>

      {/* Login Form */}
      <div className="flex-1 px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-sm mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Welcome Back</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Username"
                required
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-purple-600 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Service Options */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm mb-4">Or continue as</p>
          <div className="space-y-3 max-w-sm mx-auto">
            <Link
              to="/worker-login"
              className="block w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Worker Login
            </Link>
            <Link
              to="/admin-login"
              className="block w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
