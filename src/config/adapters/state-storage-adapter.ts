import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StateStorage } from 'zustand/middleware';

export const zustandStorage: StateStorage = {
  getItem: async (name) => {
    const value = await AsyncStorage.getItem(name);
    // Zustand espera que devuelva un string o null
    return value;
  },
  setItem: async (name, value) => {
    await AsyncStorage.setItem(name, value);
  },
  removeItem: async (name) => {
    await AsyncStorage.removeItem(name);
  },
};
