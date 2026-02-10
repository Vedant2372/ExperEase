import { Platform } from 'react-native';

/**
 * API base URL for Python Flask backend
 * - Android emulator: 10.0.2.2 (special alias to host machine)
 * - iOS simulator: localhost works
 * - Physical device: change to your machine IP (e.g. http://192.168.1.5:5000)
 */
export const API_BASE = (() => {
  if (__DEV__) {
    return Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';
  }
  return 'https://your-production-api.com';
})();
