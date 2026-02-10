import { Link, useLocation } from 'react-router-dom';
import { colors } from '../theme';
import './NavBar.css';

const navItems = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/ai-care', label: 'AI Care', icon: '🤖' },
  { path: '/doctors', label: 'Doctors', icon: '🔍' },
  { path: '/appointments', label: 'Appointments', icon: '📅' },
  { path: '/profile', label: 'Profile', icon: '👤' },
];

export default function NavBar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {isActive && <span className="nav-dot" />}
          </Link>
        );
      })}
    </nav>
  );
}
