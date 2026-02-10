import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getUserAppointments } from '../api/api';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '700', color: '#1e293b' },
  subtitle: { color: '#64748b', marginTop: 4 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  authReq: { padding: 40, alignItems: 'center' },
  btnPrimary: { backgroundColor: '#0d9488', padding: 12, borderRadius: 8, marginTop: 16 },
  btnText: { color: 'white', fontWeight: '600' },
});

export default function AppointmentsScreen({ navigation }) {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (user) {
      getUserAppointments()
        .then((d) => setAppointments(d.appointments || []))
        .catch(() => setAppointments([]));
    }
  }, [user]);

  const upcoming = (appointments || []).filter((a) => !['rejected', 'completed'].includes(a.status));
  const past = (appointments || []).filter((a) => a.status === 'completed');

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.authReq}>
          <Text>Sign in to view appointments</Text>
          <Pressable style={styles.btnPrimary} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.btnText}>Sign In</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <Text style={styles.title}>My Appointments</Text>
        <Text style={styles.subtitle}>{upcoming.length} upcoming</Text>
      </View>
      {upcoming.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming</Text>
          {upcoming.map((apt) => (
            <View key={apt.id} style={styles.card}>
              <Text style={{ fontWeight: '600' }}>{new Date(apt.booking_date).toLocaleDateString()} · {apt.time_slot}</Text>
              <Text style={{ color: '#0d9488', marginTop: 4 }}>{apt.appointment_type}</Text>
              {apt.patient_symptoms ? <Text style={{ color: '#64748b', marginTop: 4 }}>{apt.patient_symptoms}</Text> : null}
            </View>
          ))}
        </View>
      )}
      {past.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Past</Text>
          {past.map((apt) => (
            <View key={apt.id} style={[styles.card, { opacity: 0.8 }]}>
              <Text>{new Date(apt.booking_date).toLocaleDateString()} · {apt.time_slot}</Text>
              <Text style={{ color: '#64748b', marginTop: 4 }}>Completed</Text>
            </View>
          ))}
        </View>
      )}
      {appointments.length === 0 && (
        <View style={styles.authReq}>
          <Text>No appointments yet</Text>
          <Pressable style={styles.btnPrimary} onPress={() => navigation.navigate('Doctors')}>
            <Text style={styles.btnText}>Find Doctors</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}
