import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import DoctorDetail from './pages/DoctorDetail';
import Appointments from './pages/Appointments';
import AiCare from './pages/AiCare';
import Profile from './pages/Profile';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:id" element={<DoctorDetail />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/ai-care" element={<AiCare />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
