import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserAppointments, getDoctors } from '../api/api';

export default function Home() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [appointmentsData, doctorsData] = await Promise.all([
          getUserAppointments(),
          getDoctors()
        ]);
        setAppointments(appointmentsData.slice(0, 3));
        setDoctors(doctorsData.slice(0, 3));
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-purple-600 text-white px-6 py-8 text-center">
          <h1 className="text-2xl font-semibold mb-2">ExpertEase</h1>
          <p className="text-purple-100 text-sm">Healthcare at your fingertips</p>
        </div>
        <div className="flex-1 px-6 py-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome to ExpertEase</h2>
            <p className="text-gray-600 mb-8">Please login to access healthcare services</p>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Hello, {user.name || user.user_name || 'Jane'}!</h1>
            <p className="text-purple-100 text-sm">How can we help you today?</p>
          </div>
          <div className="text-purple-100 text-sm">
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-6 pb-24">
        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link
            to="/doctors"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 4M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Find Doctor</h3>
              <p className="text-xs text-gray-600">Browse specialists</p>
            </div>
          </Link>

          <Link
            to="/ai-care"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">AI Care</h3>
              <p className="text-xs text-gray-600">Get health guidance</p>
            </div>
          </Link>

          <Link
            to="/appointments"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Appointments</h3>
              <p className="text-xs text-gray-600">Manage bookings</p>
            </div>
          </Link>

          <Link
            to="/profile"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Profile</h3>
              <p className="text-xs text-gray-600">Your account</p>
            </div>
          </Link>
        </div>

        {/* Recent Activity Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          {loading ? (
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : appointments.length > 0 ? (
            <div className="space-y-3">
              {appointments.map((apt) => (
                <div key={apt.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium mr-2 ${
                          apt.appointment_type === 'clinic' ? 'bg-blue-100 text-blue-700' :
                          apt.appointment_type === 'video' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {apt.appointment_type || 'clinic'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{apt.doctor_name}</h4>
                      <p className="text-sm text-gray-600 mb-1">{apt.specialization}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(apt.booking_date).toLocaleDateString()}
                        <span className="mx-2">•</span>
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {apt.time_slot}
                      </div>
                      {apt.patient_symptoms && (
                        <p className="text-sm text-gray-500 mt-2">
                          <span className="font-medium">Symptoms:</span> {apt.patient_symptoms}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 text-center text-gray-500">
              <p>No recent activity</p>
              <Link
                to="/doctors"
                className="text-purple-600 font-medium text-sm mt-2 inline-block"
              >
                Find a doctor
              </Link>
            </div>
          )}
        </div>

        {/* Health Tips Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Health Tips</h2>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Stay Hydrated</h4>
                  <p className="text-sm text-gray-600">Drink at least 8 glasses of water daily for optimal health.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Regular Exercise</h4>
                  <p className="text-sm text-gray-600">30 minutes of moderate activity can improve your overall health.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Sleep Well</h4>
                  <p className="text-sm text-gray-600">Aim for 7-9 hours of quality sleep each night.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
