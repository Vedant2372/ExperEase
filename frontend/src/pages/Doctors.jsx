import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDoctors, getSpecializations, searchDoctors } from '../api/api';
import './Doctors.css';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSpecializations()
      .then((d) => setSpecializations(d.specializations || []))
      .catch(() => setSpecializations([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    if (search) {
      searchDoctors(search)
        .then((d) => setDoctors(d.doctors || []))
        .catch(() => setDoctors([]))
        .finally(() => setLoading(false));
    } else {
      getDoctors(selected || undefined)
        .then((d) => setDoctors(d.doctors || []))
        .catch(() => setDoctors([]))
        .finally(() => setLoading(false));
    }
  }, [selected, search]);

  return (
    <div className="doctors-page">
      <header className="doctors-header">
        <h1>Find a Doctor</h1>
        <p>{doctors.length} doctors available</p>
      </header>

      <input
        type="search"
        placeholder="Search doctors..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <div className="chips">
        <button
          className={`chip ${!selected ? 'active' : ''}`}
          onClick={() => setSelected(null)}
        >
          All
        </button>
        {specializations.map((spec) => (
          <button
            key={spec}
            className={`chip ${selected === spec ? 'active' : ''}`}
            onClick={() => setSelected(spec)}
          >
            {spec}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : doctors.length === 0 ? (
        <p className="empty">No doctors found</p>
      ) : (
        <div className="doctor-list">
          {doctors.map((doc) => (
            <Link to={`/doctors/${doc.id}`} key={doc.id} className="doctor-card">
              <div className="doctor-avatar">
                {doc.name?.charAt(0) || doc.full_name?.charAt(0) || '?'}
              </div>
              <div className="doctor-info">
                <strong>{doc.name || doc.full_name}</strong>
                <span className="spec">{doc.specialization || 'General Physician'}</span>
                <span className="meta">
                  {doc.experience ?? doc.experience_years ?? 0} yrs · ★ {doc.rating || '—'}
                </span>
                <span className="location">{doc.clinic_location || 'Clinic'}</span>
              </div>
              <span className="chevron">›</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
