import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store } from './src/store/store';

// Import Screens
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import AiCareScreen from './src/screens/AiCareScreen';
import DoctorsScreen from './src/screens/DoctorsScreen';
import AppointmentsScreen from './src/screens/AppointmentsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import WorkerDashboard from './src/screens/worker/WorkerDashboard';
import DocumentUpload from './src/screens/worker/DocumentUpload';

// Import Components
import { TabBarIcon } from './src/components/common/TabBarIcon';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main App Navigator
function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => (
          <TabBarIcon 
            name={getTabIconName(route.name)}
            focused={focused}
            color={color}
            size={size}
          />
        ),
        tabBarActiveTintColor: '#9333ea',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e7eb',
          height: 80,
          paddingBottom: 20,
        },
        headerStyle: {
          backgroundColor: '#9333ea',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'ExpertEase' }}
      />
      <Tab.Screen 
        name="AiCare" 
        component={AiCareScreen}
        options={{ title: 'AI Care' }}
      />
      <Tab.Screen 
        name="Doctors" 
        component={DoctorsScreen}
        options={{ title: 'Doctors' }}
      />
      <Tab.Screen 
        name="Appointments" 
        component={AppointmentsScreen}
        options={{ title: 'Appointments' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

// Auth Navigator
function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

// Worker Navigator
function WorkerNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => (
          <TabBarIcon 
            name={getWorkerTabIconName(route.name)}
            focused={focused}
            color={color}
            size={size}
          />
        ),
        tabBarActiveTintColor: '#9333ea',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e7eb',
          height: 80,
          paddingBottom: 20,
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={WorkerDashboard}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Documents" 
        component={DocumentUpload}
        options={{ title: 'Documents' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

function getTabIconName(routeName: string) {
  switch (routeName) {
    case 'Home':
      return 'home';
    case 'AiCare':
      return 'medical-services';
    case 'Doctors':
      return 'doctor';
    case 'Appointments':
      return 'calendar';
    case 'Profile':
      return 'account';
    default:
      return 'help';
  }
}

function getWorkerTabIconName(routeName: string) {
  switch (routeName) {
    case 'Dashboard':
      return 'view-dashboard';
    case 'Documents':
      return 'file-upload';
    case 'Profile':
      return 'account';
    default:
      return 'help';
  }
}

// Main App Component
export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        {/* For now, show Auth Navigator. In real app, check auth state */}
        <AuthNavigator />
        {/* Uncomment below for authenticated user */}
        {/* <AppNavigator /> */}
        {/* Uncomment below for worker */}
        {/* <WorkerNavigator /> */}
      </NavigationContainer>
    </Provider>
  );
}
