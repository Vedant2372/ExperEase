import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, FlatList, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getDoctors, getSpecializations, searchDoctors } from '../api/api';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#1e293b' },
  subtitle: { color: '#64748b', marginTop: 4 },
  search: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginTop: 16,
    backgroundColor: 'white',
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  chipActive: { backgroundColor: '#0d9488', borderColor: '#0d9488' },
  chipText: { fontSize: 14 },
  chipTextActive: { color: 'white' },
  list: { padding: 16, paddingTop: 0 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0d948820',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { fontSize: 20, fontWeight: '700', color: '#0d9488' },
  info: { flex: 1 },
  name: { fontWeight: '600', fontSize: 16 },
  spec: { color: '#0d9488', fontSize: 13, marginTop: 2 },
  meta: { color: '#64748b', fontSize: 12, marginTop: 4 },
  empty: { padding: 40, alignItems: 'center' },
});

export default function DoctorsScreen({ navigation }) {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const isWorker = user?.is_worker;
  const pageTitle = isWorker ? 'Colleagues' : 'Find a Doctor';
  const subtitleText = isWorker ? `${doctors.length} healthcare professionals` : `${doctors.length} doctors available`;

  useEffect(() => {
    getSpecializations().then((d) => setSpecializations(d.specializations || [])).catch(() => {});
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

  function renderDoctor({ item: doc }) {
    return (
      <Pressable style={styles.card} onPress={() => navigation.navigate('DoctorDetail', { id: doc.id })}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{doc.name?.charAt(0) || doc.full_name?.charAt(0) || '?'}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{doc.name || doc.full_name}</Text>
          <Text style={styles.spec}>{doc.specialization || 'General Physician'}</Text>
          <Text style={styles.meta}>
            {doc.experience ?? doc.experience_years ?? 0} yrs · ★ {doc.rating || '—'}
            {isWorker && doc.id && ` · ID: ${doc.id}`}
          </Text>
          {isWorker && doc.service && (
            <Text style={styles.meta}>Service: {doc.service}</Text>
          )}
        </View>
        <Text style={{ fontSize: 20, color: '#94a3b8' }}>›</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{pageTitle}</Text>
        <Text style={styles.subtitle}>{subtitleText}</Text>
        <TextInput
          style={styles.search}
          placeholder={isWorker ? "Search colleagues..." : "Search doctors..."}
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips} contentContainerStyle={{ paddingRight: 16 }}>
        <Pressable style={[styles.chip, !selected && styles.chipActive]} onPress={() => setSelected(null)}>
          <Text style={[styles.chipText, !selected && styles.chipTextActive]}>All</Text>
        </Pressable>
        {specializations.map((spec) => (
          <Pressable key={spec} style={[styles.chip, selected === spec && styles.chipActive]} onPress={() => setSelected(spec)}>
            <Text style={[styles.chipText, selected === spec && styles.chipTextActive]}>{spec}</Text>
          </Pressable>
        ))}
      </ScrollView>
      {loading ? (
        <View style={styles.empty}><Text>Loading...</Text></View>
      ) : doctors.length === 0 ? (
        <View style={styles.empty}><Text>{isWorker ? 'No colleagues found' : 'No doctors found'}</Text></View>
      ) : (
        <FlatList data={doctors} renderItem={renderDoctor} keyExtractor={(d) => String(d.id)} contentContainerStyle={styles.list} />
      )}
    </View>
  );
}
