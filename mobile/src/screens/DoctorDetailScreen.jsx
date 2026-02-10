import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getDoctors, getWorkerAvailability, bookClinic, bookVideo } from '../api/api';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  back: { color: '#0d9488', fontSize: 16, marginBottom: 16 },
  hero: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0d948820',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 32, fontWeight: '700', color: '#0d9488' },
  name: { fontSize: 20, fontWeight: '700' },
  spec: { color: '#0d9488', marginTop: 4 },
  form: { backgroundColor: 'white', borderRadius: 16, padding: 20 },
  formTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  toggle: { flexDirection: 'row', marginBottom: 16 },
  toggleBtn: { flex: 1, padding: 12, alignItems: 'center', borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  toggleActive: { backgroundColor: '#0d9488', borderColor: '#0d9488' },
  label: { marginBottom: 8, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  btn: { backgroundColor: '#0d9488', padding: 16, borderRadius: 8, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: '600', fontSize: 16 },
  error: { backgroundColor: '#fee2e2', padding: 12, borderRadius: 8, marginBottom: 12 },
  success: { backgroundColor: '#d1fae5', padding: 12, borderRadius: 8, marginBottom: 12 },
});

export default function DoctorDetailScreen({ route, navigation }) {
  const { id } = route.params;
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
      getWorkerAvailability(Number(id), date).then((d) => setAvailability(d.availability || [])).catch(() => setAvailability([]));
    } else setAvailability([]);
  }, [id, date]);

  async function handleBook() {
    if (!user) {
      navigation.navigate('Login');
      return;
    }
    setError('');
    setLoading(true);
    try {
      if (bookingType === 'video') {
        const data = await bookVideo(user.user_id, Number(id), user.user_name, symptoms);
        setSuccess(`Video requested! ID: ${data.appointment_id}`);
      } else {
        if (!date || !timeSlot) {
          setError('Select date and time');
          setLoading(false);
          return;
        }
        const data = await bookClinic(user.user_id, Number(id), user.user_name, symptoms, date, timeSlot);
        setSuccess(`Booked! ID: ${data.appointment_id}`);
      }
      setTimeout(() => navigation.navigate('Main', { screen: 'Appointments' }), 2000);
    } catch (err) {
      setError(err.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  }

  if (!doctor) return <View style={styles.container}><ActivityIndicator /></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Back</Text>
      </Pressable>
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{doctor.name?.charAt(0) || doctor.full_name?.charAt(0) || '?'}</Text>
        </View>
        <Text style={styles.name}>{doctor.name || doctor.full_name}</Text>
        <Text style={styles.spec}>{doctor.specialization || 'General Physician'}</Text>
        <Text style={{ color: '#64748b', marginTop: 4 }}>★ {doctor.rating || '—'} · {doctor.experience ?? doctor.experience_years ?? 0} yrs</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.formTitle}>Book Appointment</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? <Text style={styles.success}>{success}</Text> : null}
        <View style={styles.toggle}>
          <Pressable style={[styles.toggleBtn, bookingType === 'clinic' && styles.toggleActive]} onPress={() => setBookingType('clinic')}>
            <Text style={{ color: bookingType === 'clinic' ? 'white' : '#1e293b', fontWeight: '600' }}>Clinic</Text>
          </Pressable>
          <Pressable style={[styles.toggleBtn, { marginLeft: 8 }, bookingType === 'video' && styles.toggleActive]} onPress={() => setBookingType('video')}>
            <Text style={{ color: bookingType === 'video' ? 'white' : '#1e293b', fontWeight: '600' }}>Video</Text>
          </Pressable>
        </View>
        <Text style={styles.label}>Symptoms</Text>
        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
          value={symptoms}
          onChangeText={setSymptoms}
          placeholder="Describe your symptoms..."
          multiline
        />
        {bookingType === 'clinic' && (
          <>
            <Text style={styles.label}>Date</Text>
            <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />
            <Text style={styles.label}>Time Slot</Text>
            <TextInput
              style={styles.input}
              value={timeSlot}
              onChangeText={setTimeSlot}
              placeholder="Select time"
            />
            {availability.length > 0 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {availability.map((s) => (
                  <Pressable key={s.time_slot} onPress={() => setTimeSlot(s.time_slot)} style={{ padding: 8, backgroundColor: '#f1f5f9', borderRadius: 8 }}>
                    <Text>{s.time_slot}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </>
        )}
        <Pressable style={styles.btn} onPress={handleBook} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnText}>Book Appointment</Text>}
        </Pressable>
      </View>
    </ScrollView>
  );
}
