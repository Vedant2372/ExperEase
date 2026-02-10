import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getSpecializations, getDoctorsBySpecialization } from '../services/api';

const { width } = Dimensions.get('window');

interface Specialization {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

interface Doctor {
  id: string;
  full_name: string;
  specialization: string;
  rating: number;
  experience: number;
  clinic_location: string;
}

export default function HomeScreen() {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [selectedSpec, setSelectedSpec] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSpecializations();
  }, []);

  const loadSpecializations = async () => {
    try {
      const specs = await getSpecializations();
      setSpecializations(specs);
    } catch (error) {
      console.error('Error loading specializations:', error);
    }
  };

  const handleSpecializationPress = async (specName: string) => {
    if (selectedSpec === specName) {
      setSelectedSpec(null);
      setDoctors([]);
      return;
    }

    setLoading(true);
    setSelectedSpec(specName);
    
    try {
      const doctorsList = await getDoctorsBySpecialization(specName);
      setDoctors(doctorsList);
    } catch (error) {
      console.error('Error loading doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSpecializations();
    setRefreshing(false);
  };

  const renderSpecializationCard = (spec: Specialization, index: number) => (
    <TouchableOpacity
      key={spec.id}
      style={[
        styles.specializationCard,
        selectedSpec === spec.name && styles.selectedCard,
      ]}
      onPress={() => handleSpecializationPress(spec.name)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Icon name={spec.icon} size={24} color="#9333ea" />
        </View>
        <Text style={styles.specializationName}>{spec.name}</Text>
      </View>
      {spec.description && (
        <Text style={styles.description}>{spec.description}</Text>
      )}
      <View style={styles.cardFooter}>
        <Text style={styles.doctorCount}>
          {doctors.length} {doctors.length === 1 ? 'Doctor' : 'Doctors'}
        </Text>
        <Icon 
          name={selectedSpec === spec.name ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#9333ea" 
        />
      </View>
    </TouchableOpacity>
  );

  const renderDoctorCard = (doctor: Doctor) => (
    <TouchableOpacity
      key={doctor.id}
      style={styles.doctorCard}
      activeOpacity={0.7}
    >
      <View style={styles.doctorHeader}>
        <View style={styles.doctorAvatar}>
          <Text style={styles.avatarText}>
            {doctor.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </Text>
        </View>
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>Dr. {doctor.full_name}</Text>
          <Text style={styles.doctorSpecialization}>{doctor.specialization}</Text>
          <View style={styles.doctorMeta}>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={16} color="#fbbf24" />
              <Text style={styles.rating}>{doctor.rating.toFixed(1)}</Text>
            </View>
            <Text style={styles.experience}>{doctor.experience} years</Text>
          </View>
        </View>
      </View>
      <View style={styles.doctorLocation}>
        <Icon name="location-on" size={16} color="#6b7280" />
        <Text style={styles.locationText}>{doctor.clinic_location}</Text>
      </View>
      <TouchableOpacity style={styles.bookButton}>
        <Text style={styles.bookButtonText}>Book Appointment</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#9333ea', '#7c3aed']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Hello, Jane!</Text>
          <Text style={styles.subtitle}>How can we help you today?</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Icon name="search" size={24} color="#9333ea" />
            </View>
            <Text style={styles.actionText}>Find Doctor</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Icon name="medical-services" size={24} color="#9333ea" />
            </View>
            <Text style={styles.actionText}>AI Care</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Icon name="calendar" size={24} color="#9333ea" />
            </View>
            <Text style={styles.actionText}>Appointments</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Icon name="account" size={24} color="#9333ea" />
            </View>
            <Text style={styles.actionText}>Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Specializations Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Specializations</Text>
          <Text style={styles.sectionSubtitle}>Click to view available doctors</Text>
          
          {specializations.map((spec, index) => renderSpecializationCard(spec, index))}
        </View>

        {/* Doctors List (when specialization is selected) */}
        {selectedSpec && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{selectedSpec} Doctors</Text>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#9333ea" />
                <Text style={styles.loadingText}>Loading doctors...</Text>
              </View>
            ) : doctors.length > 0 ? (
              doctors.map(renderDoctorCard)
            ) : (
              <View style={styles.emptyState}>
                <Icon name="people" size={48} color="#9ca3af" />
                <Text style={styles.emptyText}>No {selectedSpec} doctors available</Text>
              </View>
            )}
          </View>
        )}

        {/* Health Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Tips</Text>
          
          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Icon name="water-drop" size={20} color="#9333ea" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Stay Hydrated</Text>
              <Text style={styles.tipDescription}>Drink at least 8 glasses of water daily</Text>
            </View>
          </View>
          
          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Icon name="directions-run" size={20} color="#9333ea" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Regular Exercise</Text>
              <Text style={styles.tipDescription}>30 minutes of moderate activity daily</Text>
            </View>
          </View>
          
          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Icon name="bedtime" size={20} color="#9333ea" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Sleep Well</Text>
              <Text style={styles.tipDescription}>Aim for 7-9 hours of quality sleep</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#e9d5ff',
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#f3e8ff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (width - 60) / 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3e8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  specializationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    borderColor: '#9333ea',
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3e8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  specializationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  doctorCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  doctorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  doctorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f3e8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9333ea',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  doctorSpecialization: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  doctorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  rating: {
    fontSize: 12,
    color: '#374151',
    marginLeft: 2,
  },
  experience: {
    fontSize: 12,
    color: '#6b7280',
  },
  doctorLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  bookButton: {
    backgroundColor: '#9333ea',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3e8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  tipDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
});
