import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDoctors, getWorkerAvailability, bookClinic, bookVideo } from '../api/api';
import './DoctorDetail.css';

export default function DoctorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [symptoms, setSymptoms] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [bookingType, setBookingType] = useState('clinic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getDoctors().then((d) => {
      const found = (d.doctors || []).find((doc) => String(doc.id) === String(id));
      setDoctor(found);
    });
  }, [id]);

  useEffect(() => {
    if (id && date) {
      getWorkerAvailability(Number(id), date)
        .then((d) => setAvailability(d.availability || []))
        .catch(() => setAvailability([]));
    } else {
      setAvailability([]);
    }
  }, [id, date]);

  async function handleBook(e) {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setError('');
    setLoading(true);
    try {
      if (bookingType === 'video') {
        const data = await bookVideo(
          user.user_id,
          Number(id),
          user.user_name,
          symptoms
        );
        setSuccess(`Video consultation requested! ID: ${data.appointment_id}`);
      } else {
        if (!date || !timeSlot) {
          setError('Select date and time slot');
          setLoading(false);
          return;
        }
        const data = await bookClinic(
          user.user_id,
          Number(id),
          user.user_name,
          symptoms,
          date,
          timeSlot
        );
        setSuccess(`Appointment booked! ID: ${data.appointment_id}`);
      }
      setTimeout(() => navigate('/appointments'), 2000);
    } catch (err) {
      setError(err.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  }

  if (!doctor) return <p className="loading">Loading...</p>;

  return (
    <div className="doctor-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="doctor-hero">
        <div className="doctor-avatar large">
          {doctor.name?.charAt(0) || doctor.full_name?.charAt(0) || '?'}
        </div>
        <h1>{doctor.name || doctor.full_name}</h1>
        <p className="spec">{doctor.specialization || 'General Physician'}</p>
        <p className="meta">★ {doctor.rating || '—'} · {doctor.experience ?? doctor.experience_years ?? 0} years experience</p>
        <p className="location">{doctor.clinic_location || 'Clinic'}</p>
      </div>

      <form onSubmit={handleBook} className="booking-form">
        <h2>Book Appointment</h2>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <div className="type-toggle">
          <button
            type="button"
            className={bookingType === 'clinic' ? 'active' : ''}
            onClick={() => setBookingType('clinic')}
          >
            Clinic
          </button>
          <button
            type="button"
            className={bookingType === 'video' ? 'active' : ''}
            onClick={() => setBookingType('video')}
          >
            Video
          </button>
        </div>

        <label>
          <span>Symptoms / Reason</span>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe your symptoms..."
            rows={3}
            required
          />
        </label>

        {bookingType === 'clinic' && (
          <>
            <label>
              <span>Date</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required={bookingType === 'clinic'}
              />
            </label>
            <label>
              <span>Time Slot</span>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                required={bookingType === 'clinic'}
              >
                <option value="">Select time</option>
                {availability.map((slot) => (
                  <option key={slot.id || slot.time_slot} value={slot.time_slot}>
                    {slot.time_slot}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
}
