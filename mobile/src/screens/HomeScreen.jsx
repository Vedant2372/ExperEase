import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getUserAppointments, getWorkerAppointments, getDoctors } from '../api/api';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '700', color: '#1e293b' },
  subtitle: { color: '#64748b', marginTop: 4 },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  quickBtn: {
    width: '47%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  quickIcon: { fontSize: 28, marginBottom: 8 },
  quickLabel: { fontSize: 14, fontWeight: '500', color: '#1e293b' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1e293b', marginBottom: 12 },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0d948820',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { fontSize: 18, fontWeight: '700', color: '#0d9488' },
  empty: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#64748b', marginTop: 8 },
  btnPrimary: { backgroundColor: '#0d9488', padding: 12, borderRadius: 8, marginTop: 16, alignSelf: 'center' },
  btnText: { color: 'white', fontWeight: '600' },
});

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    if (user) {
      if (user.is_worker) {
        // For workers, get their appointments (as doctor)
        getWorkerAppointments(user.user_id)
          .then((d) => setAppointments(d.appointments || []))
          .catch(() => setAppointments([]));
        getDoctors()
          .then((d) => setDoctors(d.doctors || []))
          .catch(() => setDoctors([]));
      } else {
        // For users, get their appointments
        getUserAppointments()
          .then((d) => setAppointments(d.appointments || []))
          .catch(() => setAppointments([]));
        getDoctors()
          .then((d) => setDoctors(d.doctors || []))
          .catch(() => setDoctors([]));
      }
    }
  }, [user]);

  const upcoming = (appointments || []).filter((a) => !['rejected', 'completed'].includes(a.status));
  const recentDoctors = (doctors || []).slice(0, 3);
  
  // Dynamic greeting based on user type
  let greeting;
  if (user?.is_worker) {
    greeting = `Hello, ${user.service || 'Healthcare Provider'}!`;
  } else {
    greeting = user?.user_name ? `Hello, ${user.user_name.split(' ')[0]}!` : 'Hello!';
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <Text style={styles.title}>{greeting}</Text>
        <Text style={styles.subtitle}>Healthcare at your fingertips</Text>
      </View>

      <View style={styles.quickRow}>
        <Pressable style={styles.quickBtn} onPress={() => navigation.navigate('Doctors')}>
          <Text style={styles.quickIcon}>🩺</Text>
          <Text style={styles.quickLabel}>{user?.is_worker ? 'Colleagues' : 'Find Doctor'}</Text>
        </Pressable>
        <Pressable style={styles.quickBtn} onPress={() => navigation.navigate('Appointments')}>
          <Text style={styles.quickIcon}>📅</Text>
          <Text style={styles.quickLabel}>Appointments</Text>
        </Pressable>
        <Pressable style={styles.quickBtn} onPress={() => navigation.navigate('AiCare')}>
          <Text style={styles.quickIcon}>💊</Text>
          <Text style={styles.quickLabel}>AI Care</Text>
        </Pressable>
      </View>

      {upcoming.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{user?.is_worker ? 'Your Appointments' : 'Upcoming'}</Text>
          {upcoming.slice(0, 3).map((apt) => (
            <View key={apt.id} style={styles.card}>
              <Text>{new Date(apt.booking_date).toLocaleDateString()} · {apt.time_slot}</Text>
              <Text style={{ color: '#64748b', marginTop: 4 }}>
                {user?.is_worker ? `Patient: ${apt.user_name}` : apt.appointment_type}
              </Text>
            </View>
          ))}
        </View>
      )}

      {recentDoctors.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{user?.is_worker ? 'Featured Colleagues' : 'Featured Doctors'}</Text>
          {recentDoctors.map((doc) => (
            <Pressable key={doc.id} style={styles.doctorCard} onPress={() => navigation.navigate('DoctorDetail', { id: doc.id })}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{doc.name?.charAt(0) || doc.full_name?.charAt(0) || '?'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '600' }}>{doc.name || doc.full_name}</Text>
                <Text style={{ color: '#0d9488', fontSize: 13 }}>{doc.specialization || 'General'}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}

      {upcoming.length === 0 && recentDoctors.length === 0 && (
        <View style={styles.empty}>
          <Text>🏥 {user?.is_worker ? 'Welcome to Your Dashboard' : 'Get Started'}</Text>
          <Text style={styles.emptyText}>
            {user?.is_worker ? 'View your appointments and connect with colleagues' : 'Find a doctor or book your first appointment'}
          </Text>
          <Pressable style={styles.btnPrimary} onPress={() => navigation.navigate('Doctors')}>
            <Text style={styles.btnText}>{user?.is_worker ? 'View Colleagues' : 'Find Doctors'}</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}
