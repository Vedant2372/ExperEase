import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { login, getUserInfo, workerLogin } from '../api/api';
import { setStoredToken } from '../api/api';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#0d9488',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  subtitle: {
    color: '#64748b',
    marginTop: 4,
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#0d9488',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    marginTop: 16,
    textAlign: 'center',
    color: '#64748b',
  },
  linkText: {
    color: '#0d9488',
    fontWeight: '600',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleActive: {
    backgroundColor: '#0d9488',
  },
  toggleText: {
    fontWeight: '600',
    color: '#64748b',
  },
  toggleTextActive: {
    color: 'white',
  },
});

export default function LoginScreen({ navigation }) {
  const [loginType, setLoginType] = useState('user'); // 'user' or 'worker'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();

  async function handleSubmit() {
    setError('');
    setLoading(true);
    try {
      if (loginType === 'user') {
        // User login flow
        const data = await login(username, password);
        await setStoredToken(data.token);
        const userInfo = await getUserInfo();
        authLogin(data.token, userInfo);
      } else {
        // Worker login flow
        const data = await workerLogin(username); // Using username as email for workers
        await setStoredToken(data.token || 'worker_token'); // Use a default token for workers
        const workerInfo = {
          user_id: data.worker_id,
          user_name: `Worker_${data.worker_id}`,
          username: username,
          service: data.service,
          specialization: data.specialization,
          is_worker: true
        };
        authLogin(data.token || 'worker_token', workerInfo);
      }
      navigation.replace('Main');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.card}>
        <Text style={styles.title}>ExpertEase</Text>
        <Text style={styles.subtitle}>Healthcare at your fingertips</Text>
        
        {/* Login Type Toggle */}
        <View style={styles.toggleContainer}>
          <Pressable
            style={[styles.toggleButton, loginType === 'user' && styles.toggleActive]}
            onPress={() => setLoginType('user')}
          >
            <Text style={[styles.toggleText, loginType === 'user' && styles.toggleTextActive]}>
              User
            </Text>
          </Pressable>
          <Pressable
            style={[styles.toggleButton, loginType === 'worker' && styles.toggleActive]}
            onPress={() => setLoginType('worker')}
          >
            <Text style={[styles.toggleText, loginType === 'worker' && styles.toggleTextActive]}>
              Worker
            </Text>
          </Pressable>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder={loginType === 'user' ? "Username" : "Email"}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        {loginType === 'user' && (
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        )}
        <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Sign In</Text>}
        </Pressable>
        {loginType === 'user' && (
          <Pressable onPress={() => navigation.replace('Signup')}>
            <Text style={styles.link}>Don't have an account? <Text style={styles.linkText}>Sign up</Text></Text>
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
