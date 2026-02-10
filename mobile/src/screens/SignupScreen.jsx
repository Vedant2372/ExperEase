import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { signup } from '../api/api';

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
  title: { fontSize: 24, fontWeight: '700', color: '#1e293b' },
  subtitle: { color: '#64748b', marginTop: 4, marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  button: { backgroundColor: '#0d9488', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { color: 'white', fontWeight: '600', fontSize: 16 },
  link: { marginTop: 16, textAlign: 'center', color: '#64748b' },
  linkText: { color: '#0d9488', fontWeight: '600' },
  error: { backgroundColor: '#fee2e2', color: '#b91c1c', padding: 12, borderRadius: 8, marginBottom: 12 },
});

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    setError('');
    setLoading(true);
    try {
      await signup(name, username, email, password);
      setSuccess(true);
      setTimeout(() => navigation.replace('Login'), 2000);
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>OTP sent. Verify and log in.</Text>
          <Pressable style={styles.button} onPress={() => navigation.replace('Login')}>
            <Text style={styles.buttonText}>Go to Login</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>ExpertEase</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Sign Up</Text>}
        </Pressable>
        <Pressable onPress={() => navigation.replace('Login')}>
          <Text style={styles.link}>Already have an account? <Text style={styles.linkText}>Sign in</Text></Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
