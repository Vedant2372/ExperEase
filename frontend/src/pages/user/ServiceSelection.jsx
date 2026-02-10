import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './ServiceSelection.css';

const services = [
  { id: 'healthcare', icon: '🩺', label: 'Healthcare', active: true },
  { id: 'housekeeping', icon: '🏠', label: 'Housekeeping', active: false },
  { id: 'resource', icon: '📦', label: 'Resource Management', active: false },
  { id: 'car', icon: '🚗', label: 'Car Services', active: false },
  { id: 'money', icon: '💰', label: 'Money Management', active: false },
];

export default function ServiceSelection() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleService(service) {
    if (service.id === 'healthcare') {
      navigate('/home');
    } else {
      alert(`${service.label} coming soon!`);
    }
  }

  return (
    <div className="service-page">
      <div className="service-header">
        <h1>Select Your Service</h1>
        <p>Choose the service you want to provide</p>
      </div>
      <div className="service-grid">
        {services.map((s) => (
          <button
            key={s.id}
            className="service-card"
            onClick={() => handleService(s)}
          >
            <div className="service-icon-wrap">
              <span className="service-icon">{s.icon}</span>
            </div>
            <span className="service-label">{s.label}</span>
          </button>
        ))}
      </div>
      <button className="logout-link" onClick={() => { logout(); navigate('/'); }}>
        Logout
      </button>
    </div>
  );
}
