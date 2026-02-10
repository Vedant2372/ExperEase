// Mock API for React Native ExpertEase App
import AsyncStorage from '@react-native-async-storage/async-storage';

// Toggle between real and mock API
const USE_MOCK_API = true;

// Types
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
}

export interface Doctor {
  id: string;
  full_name: string;
  specialization: string;
  rating: number;
  experience: number;
  clinic_location: string;
}

export interface Specialization {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export interface Appointment {
  id: string;
  doctor_name: string;
  specialization: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed';
  appointment_type: 'clinic' | 'video';
}

export interface AiCareResponse {
  stage: 'triage' | 'final' | 'emergency';
  question?: string;
  message?: string;
  severity?: string;
  specialist?: string;
  first_aid?: string;
  medicines?: string[];
  when_to_visit_doctor?: string;
  suggested_doctors?: Doctor[];
}

// Mock Data
const mockSpecializations: Specialization[] = [
  { id: '1', name: 'Dentist', icon: 'medical-services', description: 'Oral health and dental care' },
  { id: '2', name: 'Cardiologist', icon: 'favorite', description: 'Heart and cardiovascular health' },
  { id: '3', name: 'Eye Specialist', icon: 'visibility', description: 'Eye care and vision health' },
  { id: '4', name: 'ENT', icon: 'hearing', description: 'Ear, nose, and throat care' },
  { id: '5', name: 'Orthopedic', icon: 'accessibility', description: 'Bone and joint health' },
  { id: '6', name: 'Dermatologist', icon: 'face', description: 'Skin care and dermatology' },
  { id: '7', name: 'Neurologist', icon: 'psychology', description: 'Brain and nervous system' },
  { id: '8', name: 'Psychiatrist', icon: 'mood', description: 'Mental health and psychiatry' },
  { id: '9', name: 'Gynecologist', icon: 'female', description: 'Women\'s health care' },
  { id: '10', name: 'Pediatrician', icon: 'child-care', description: 'Children\'s health care' },
  { id: '11', name: 'General Physician', icon: 'local-hospital', description: 'General medical care' },
  { id: '12', name: 'Urologist', icon: 'water-drop', description: 'Urinary system health' },
];

const mockDoctors: Doctor[] = [
  { id: '1', full_name: 'Dr. Sarah Johnson', specialization: 'Dentist', rating: 4.8, experience: 10, clinic_location: '123 Main St, City' },
  { id: '2', full_name: 'Dr. Michael Chen', specialization: 'Dentist', rating: 4.9, experience: 15, clinic_location: '456 Oak Ave, City' },
  { id: '3', full_name: 'Dr. Emily Davis', specialization: 'Cardiologist', rating: 4.7, experience: 8, clinic_location: '789 Pine Rd, City' },
  { id: '4', full_name: 'Dr. Robert Wilson', specialization: 'Cardiologist', rating: 4.6, experience: 12, clinic_location: '321 Elm St, City' },
  { id: '5', full_name: 'Dr. Lisa Anderson', specialization: 'Eye Specialist', rating: 4.8, experience: 9, clinic_location: '654 Maple Dr, City' },
  { id: '6', full_name: 'Dr. James Taylor', specialization: 'Eye Specialist', rating: 4.5, experience: 11, clinic_location: '987 Cedar Ln, City' },
  { id: '7', full_name: 'Dr. Maria Garcia', specialization: 'Orthopedic', rating: 4.7, experience: 14, clinic_location: '147 Birch Blvd, City' },
  { id: '8', full_name: 'Dr. David Brown', specialization: 'Orthopedic', rating: 4.6, experience: 7, clinic_location: '258 Spruce Way, City' },
];

const mockAppointments: Appointment[] = [
  { id: '1', doctor_name: 'Dr. Sarah Johnson', specialization: 'Dentist', date: '2024-02-15', time: '10:00 AM', status: 'confirmed', appointment_type: 'clinic' },
  { id: '2', doctor_name: 'Dr. Emily Davis', specialization: 'Cardiologist', date: '2024-02-18', time: '2:30 PM', status: 'pending', appointment_type: 'video' },
  { id: '3', doctor_name: 'Dr. Lisa Anderson', specialization: 'Eye Specialist', date: '2024-02-20', time: '11:15 AM', status: 'confirmed', appointment_type: 'clinic' },
];

const mockAiResponses: AiCareResponse[] = [
  { stage: 'triage', question: 'Since when are you experiencing this stomach pain? Is it burning, sharp, or cramping?' },
  { stage: 'triage', question: 'Have you taken any medication for this pain? Any fever or nausea?' },
  { stage: 'final', message: 'Based on your symptoms, it appears to be mild gastritis. Severity: moderate. Specialist: General Physician. First Aid: Drink warm water, avoid spicy food. Medicines: Antacids as needed. Visit timing: If pain persists for more than 2 days.' },
];

let aiResponseIndex = 0;

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Authentication Functions
export const login = async (username: string, password: string): Promise<{ token: string; user: User }> => {
  await delay(1000);
  
  if (username === 'john' && password === 'password') {
    const user: User = { id: '1', name: 'Jane Doe', username: 'john', email: 'jane@example.com' };
    const token = 'mock-token-123';
    
    // Store token and user info
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    
    return { token, user };
  }
  
  throw new Error('Invalid credentials');
};

export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
};

export const getUserInfo = async (): Promise<User> => {
  await delay(500);
  const userStr = await AsyncStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  throw new Error('User not found');
};

// Healthcare Functions
export const getSpecializations = async (): Promise<Specialization[]> => {
  await delay(800);
  return mockSpecializations;
};

export const getDoctorsBySpecialization = async (specialization: string): Promise<Doctor[]> => {
  await delay(600);
  return mockDoctors.filter(doctor => doctor.specialization === specialization);
};

export const getAllDoctors = async (): Promise<Doctor[]> => {
  await delay(600);
  return mockDoctors;
};

export const searchDoctors = async (query: string): Promise<Doctor[]> => {
  await delay(500);
  return mockDoctors.filter(doctor => 
    doctor.full_name.toLowerCase().includes(query.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(query.toLowerCase())
  );
};

// Appointment Functions
export const getUserAppointments = async (): Promise<Appointment[]> => {
  await delay(600);
  return mockAppointments;
};

export const bookAppointment = async (doctorId: string, appointmentData: any): Promise<any> => {
  await delay(1000);
  return { id: Date.now().toString(), status: 'pending' };
};

// AI Care Functions
export const aiCareChat = async (symptoms: string, userId: string = 'default'): Promise<AiCareResponse> => {
  await delay(1500);
  
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
};

// Worker Document Upload Functions
export const uploadDocument = async (document: any, workerId: string): Promise<any> => {
  await delay(2000);
  return { 
    success: true, 
    documentId: Date.now().toString(),
    message: 'Document uploaded successfully. Verification pending.' 
  };
};

export const getWorkerDocuments = async (workerId: string): Promise<any[]> => {
  await delay(500);
  return [
    {
      id: '1',
      name: 'Medical Degree Certificate',
      type: 'certificate',
      status: 'verified',
      uploadDate: '2024-01-15',
    },
    {
      id: '2', 
      name: 'Medical License',
      type: 'license',
      status: 'pending',
      uploadDate: '2024-01-16',
    },
    {
      id: '3',
      name: 'ID Proof',
      type: 'identification',
      status: 'verified',
      uploadDate: '2024-01-14',
    }
  ];
};

// Check authentication status
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  } catch (error) {
    return false;
  }
};

// Get stored token
export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    return null;
  }
};
