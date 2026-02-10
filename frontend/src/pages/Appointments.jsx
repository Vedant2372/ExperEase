import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserAppointments } from '../api/api';

export default function Appointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getUserAppointments();
        setAppointments(data.appointments || []);
      } catch (error) {
        console.error('Failed to load appointments:', error);
        setAppointments([]);
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

  const upcoming = (appointments || []).filter(
    (a) => !['rejected', 'completed'].includes(a.status)
  );
  const past = (appointments || []).filter((a) => a.status === 'completed');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-purple-600 text-white px-6 py-6">
          <h1 className="text-xl font-semibold">My Appointments</h1>
        </div>
        <div className="flex-1 px-6 py-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Please login to view your appointments</p>
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
          <h1 className="text-xl font-semibold">My Appointments</h1>
          <div className="text-purple-100 text-sm">
            {upcoming.length} upcoming
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-6 pb-24">
        {loading ? (
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : (
          <>
            {/* Upcoming Appointments */}
            {upcoming.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming</h2>
                <div className="space-y-3">
                  {upcoming.map((apt) => (
                    <div key={apt.id} className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
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
              </div>
            )}

            {/* Past Appointments */}
            {past.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Past</h2>
                <div className="space-y-3">
                  {past.map((apt) => (
                    <div key={apt.id} className="bg-white rounded-xl p-4 shadow-sm opacity-75">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium mr-2 ${
                              apt.appointment_type === 'clinic' ? 'bg-blue-100 text-blue-700' :
                              apt.appointment_type === 'video' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {apt.appointment_type || 'clinic'}
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                              completed
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
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {appointments.length === 0 && (
              <div className="bg-white rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments yet</h3>
                <p className="text-gray-600 mb-6">Book your first appointment with a doctor</p>
                <Link
                  to="/doctors"
                  className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Find Doctors
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
