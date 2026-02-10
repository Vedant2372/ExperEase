import { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { aiCare } from '../api/api';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 16 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#64748b', marginTop: 4 },
  chat: { flex: 1, padding: 16 },
  msg: { marginBottom: 12, padding: 12, borderRadius: 12, maxWidth: '85%', alignSelf: 'flex-end' },
  msgBot: { alignSelf: 'flex-start', backgroundColor: '#f1f5f9' },
  msgUser: { backgroundColor: '#0d9488' },
  msgText: { color: '#1e293b' },
  msgTextUser: { color: 'white' },
  inputRow: { flexDirection: 'row', padding: 16, gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  sendBtn: { backgroundColor: '#0d9488', paddingHorizontal: 20, justifyContent: 'center', borderRadius: 8 },
  sendText: { color: 'white', fontWeight: '600' },
});

export default function AiCareScreen({ navigation }) {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');
    setMessages((m) => [...m, { role: 'user', text }]);
    setLoading(true);
    try {
      const data = await aiCare(text, user?.user_id || 'default');
      const reply = data.question || data.message || 'No response.';
      setMessages((m) => [...m, { role: 'assistant', text: reply }]);
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', text: 'Sorry, something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Care</Text>
        <Text style={styles.subtitle}>Describe your symptoms for guidance</Text>
      </View>
      <ScrollView style={styles.chat} contentContainerStyle={{ paddingBottom: 20 }}>
        {messages.length === 0 && (
          <View style={[styles.msg, styles.msgBot]}>
            <Text style={styles.msgText}>Hi! Describe how you're feeling and I'll help guide you.</Text>
          </View>
        )}
        {messages.map((m, i) => (
          <View key={i} style={[styles.msg, m.role === 'user' ? styles.msgUser : styles.msgBot]}>
            <Text style={[styles.msgText, m.role === 'user' && styles.msgTextUser]}>{m.text}</Text>
          </View>
        ))}
        {loading && (
          <View style={[styles.msg, styles.msgBot]}>
            <Text style={styles.msgText}>Thinking...</Text>
          </View>
        )}
      </ScrollView>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Describe symptoms..."
          editable={!loading}
        />
        <Pressable style={styles.sendBtn} onPress={handleSend} disabled={loading}>
          <Text style={styles.sendText}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}
