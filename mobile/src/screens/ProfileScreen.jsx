import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#64748b', marginTop: 4 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0d948820',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: { fontSize: 24, fontWeight: '700', color: '#0d9488' },
  userName: { fontSize: 18, fontWeight: '600' },
  username: { color: '#64748b', marginTop: 4 },
  authReq: { padding: 40, alignItems: 'center' },
  btnPrimary: { backgroundColor: '#0d9488', padding: 12, borderRadius: 8, marginTop: 16 },
  btnText: { color: 'white', fontWeight: '600' },
  logout: {
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ef4444',
    marginTop: 24,
  },
  logoutText: { color: '#ef4444', fontWeight: '600' },
});

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.authReq}>
          <Text>You are not logged in</Text>
          <Pressable style={styles.btnPrimary} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.btnText}>Sign In</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>{user.user_name}</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.user_name?.charAt(0) || '?'}</Text>
        </View>
        <View>
          <Text style={styles.userName}>{user.user_name}</Text>
          <Text style={styles.username}>@{user.username}</Text>
        </View>
      </View>
      <Pressable style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </Pressable>
    </View>
  );
}
