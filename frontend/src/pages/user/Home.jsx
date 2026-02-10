import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserAppointments, getDoctors, getSpecializations } from '../../api/api';
import './Home.css';

const SPEC_ICONS = {
  General: '🩺',
  Cardiology: '❤️',
  Dermatology: '💆',
  Pediatrics: '👶',
  Orthopedics: '🦴',
  Dentist: '🦷',
  'Eye Specialist': '👁️',
  ENT: '👂',
  default: '🏥',
};

export default function Home() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);

  useEffect(() => {
    if (user) {
      getUserAppointments()
        .then((d) => setAppointments(d.appointments || []))
        .catch(() => setAppointments([]));
    }
    getDoctors().then((d) => setDoctors(d.doctors || [])).catch(() => setDoctors([]));
    getSpecializations().then((d) => setSpecializations(d.specializations || [])).catch(() => setSpecializations([]));
  }, [user]);

  const greeting = user?.user_name ? `Welcome back 👋` : 'Welcome back 👋';
  const topDoctors = doctors.slice(0, 5);
  const specs = specializations.slice(0, 8);

  return (
    <div className="home-page">
      <header className="home-header">
        <div>
          <p className="home-greeting">{greeting}</p>
          <h1>{user?.user_name || 'Guest'}</h1>
        </div>
        <div className="home-search-wrap">
          <input type="search" placeholder="Search doctors, specializations..." className="home-search" />
        </div>
      </header>

      <section className="section">
        <div className="section-header">
          <h2>Specializations</h2>
          <Link to="/explore" className="view-all">View All &gt;</Link>
        </div>
        <div className="spec-grid">
          {specs.map((spec) => (
            <Link key={spec} to={`/explore?spec=${encodeURIComponent(spec)}`} className="spec-card">
              <span className="spec-icon">{SPEC_ICONS[spec] || SPEC_ICONS.default}</span>
              <span>{spec}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Top Doctors</h2>
          <Link to="/explore" className="view-all">See All &gt;</Link>
        </div>
        <div className="doctor-list">
          {topDoctors.map((doc) => (
            <div key={doc.id} className="doctor-card">
              <div className="doctor-avatar">
                {(doc.name || doc.full_name || '?').charAt(0)}
              </div>
              <div className="doctor-info">
                <strong>Dr. {doc.name || doc.full_name}</strong>
                <span className="doc-spec">{doc.specialization || 'General Physician'}</span>
                <span className="doc-meta">★ {doc.rating || '—'} · {doc.experience ?? doc.experience_years ?? 0} yrs</span>
                <span className="doc-loc">📍 {doc.clinic_location || 'Clinic'}</span>
              </div>
              <div className="doctor-actions">
                <span className="doc-price">₹500 / visit</span>
                <Link to={`/doctor/${doc.id}`} className="book-btn">Book Now</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
