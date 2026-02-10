import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-purple-600 text-white px-6 py-6">
          <h1 className="text-xl font-semibold">Profile</h1>
        </div>
        <div className="flex-1 px-6 py-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">You are not logged in</p>
            <Link
              to="/login"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Purple Header */}
      <div className="bg-purple-600 text-white px-6 py-6">
        <h1 className="text-xl font-semibold">Profile</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-6 pb-24">
        {/* Profile Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl font-semibold text-purple-600">
                {(user.name || user.user_name || 'Jane').charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user.name || user.user_name || 'Jane Doe'}</h2>
              <p className="text-gray-600">@{user.username || 'jane'}</p>
              <p className="text-sm text-gray-500">{user.email || 'jane@example.com'}</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600">Member Since</span>
              <span className="font-medium text-gray-900">January 2024</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Account Type</span>
              <span className="font-medium text-gray-900">Patient</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600 mb-1">12</div>
            <p className="text-xs text-gray-600">Appointments</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600 mb-1">5</div>
            <p className="text-xs text-gray-600">Doctors</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600 mb-1">8</div>
            <p className="text-xs text-gray-600">Months Active</p>
          </div>
        </div>

        {/* Menu Options */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <Link
            to="/appointments"
            className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-medium text-gray-900">My Appointments</span>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <Link
            to="/medical-records"
            className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-medium text-gray-900">Medical Records</span>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <Link
            to="/settings"
            className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="font-medium text-gray-900">Settings</span>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <Link
            to="/help"
            className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-medium text-gray-900">Help & Support</span>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors w-full text-left"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <span className="font-medium text-red-600">Sign Out</span>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* App Version */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">ExpertEase v1.0.0</p>
          <p className="text-xs text-gray-400 mt-1">© 2024 ExpertEase Healthcare</p>
        </div>
      </div>
    </div>
  );
}
