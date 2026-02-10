// Mock API for frontend testing without backend
const mockUsers = [
  { id: 1, name: 'John Doe', username: 'john', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', username: 'jane', email: 'jane@example.com' }
];

const mockDoctors = [
  { id: 1, full_name: 'Dr. Sarah Johnson', specialization: 'General Physician', rating: 4.8, experience: 10 },
  { id: 2, full_name: 'Dr. Michael Chen', specialization: 'Cardiologist', rating: 4.9, experience: 15 },
  { id: 3, full_name: 'Dr. Emily Davis', specialization: 'Pediatrician', rating: 4.7, experience: 8 },
  { id: 4, full_name: 'Dr. Robert Wilson', specialization: 'Orthopedic', rating: 4.6, experience: 12 },
  { id: 5, full_name: 'Dr. Lisa Anderson', specialization: 'Dermatologist', rating: 4.8, experience: 9 }
];

const mockAppointments = [
  { id: 1, doctor_name: 'Dr. Sarah Johnson', specialization: 'General Physician', date: '2024-02-15', time: '10:00 AM', status: 'confirmed' },
  { id: 2, doctor_name: 'Dr. Michael Chen', specialization: 'Cardiologist', date: '2024-02-18', time: '2:30 PM', status: 'pending' }
];

const mockAiResponses = [
  { stage: 'triage', question: 'Since when are you experiencing this stomach pain? Is it burning, sharp, or cramping?' },
  { stage: 'triage', question: 'Have you taken any medication for this pain? Any fever or nausea?' },
  { stage: 'final', message: 'Based on your symptoms, it appears to be mild gastritis. Severity: moderate. Specialist: General Physician. First Aid: Drink warm water, avoid spicy food. Medicines: Antacids as needed. Visit timing: If pain persists for more than 2 days.' }
];

let aiResponseIndex = 0;

// Mock API functions
export async function login(username, password) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = mockUsers.find(u => u.username === username);
  if (user && password === 'password') {
    return { token: 'mock-token-123', user };
  }
  throw new Error('Invalid credentials');
}

export async function getUserInfo() {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockUsers[0]; // Return first user for demo
}

export async function getDoctors() {
  await new Promise(resolve => setTimeout(resolve, 800));
  return { doctors: mockDoctors };
}

export async function getUserAppointments() {
  await new Promise(resolve => setTimeout(resolve, 600));
  return { appointments: mockAppointments };
}

export async function aiCare(symptoms, userId = 'default') {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Cycle through mock responses
  const response = mockAiResponses[aiResponseIndex % mockAiResponses.length];
  aiResponseIndex++;
  
  return {
    ...response,
    suggested_doctors: mockDoctors.slice(0, 2),
    severity: 'moderate',
    specialist: 'General Physician',
    first_aid: 'Drink warm water, avoid spicy food',
    medicines: ['Antacids', 'Pain relievers'],
    when_to_visit_doctor: 'If pain persists for more than 2 days'
  };
}

// Add other mock functions as needed
export async function signup(name, username, email, password) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { message: 'Signup successful' };
}

export async function getSpecializations() {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { specializations: ['General Physician', 'Cardiologist', 'Pediatrician', 'Orthopedic', 'Dermatologist'] };
}
