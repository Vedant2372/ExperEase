import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Purple Header */}
      <header className="bg-purple-600 text-white px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">ExpertEase</h1>
            <p className="text-purple-100 text-sm">Healthcare at your fingertips</p>
          </div>
          {user && (
            <button
              onClick={handleLogout}
              className="text-purple-100 hover:text-white transition-colors"
            >
              Logout
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation - Mobile Style */}
      {user && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="flex justify-around items-center h-16">
            <Link
              to="/"
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive('/') ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1h2a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3z" />
              </svg>
              <span className="text-xs">Home</span>
            </Link>

            <Link
              to="/ai-care"
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive('/ai-care') ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="text-xs">AI Care</span>
            </Link>

            <Link
              to="/doctors"
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive('/doctors') ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 4M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-xs">Doctors</span>
            </Link>

            <Link
              to="/appointments"
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive('/appointments') ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs">Appointments</span>
            </Link>

            <Link
              to="/profile"
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive('/profile') ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs">Profile</span>
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}
