import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';

const LOCATION_KEY = 'user_location';
const THEME_KEY = 'user_theme';

interface UserPreferencesProps {
  location: string,
  theme: string,
  loading: boolean
  updateLocation: (newLocation: string) => Promise<void>
  updateTheme : (newTheme: string) => Promise<void>
}


const UserPreferencesContext = createContext<UserPreferencesProps | undefined>(undefined);

export const UserPreferencesProvider = ({ children } : any) => {
  const [location, setLocation] = useState("");
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const storedLocation = await SecureStore.getItemAsync(LOCATION_KEY);
        const storedTheme = await SecureStore.getItemAsync(THEME_KEY);

        if (storedLocation) setLocation(storedLocation)
        else setLocation("Bangkok");
        if (storedTheme) setTheme(storedTheme);

      } catch (error) {
        console.error('Error loading preferences from SecureStore:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const updateLocation = async (newLocation : string) => {
    setLocation(newLocation);
    try {
      await SecureStore.setItemAsync(LOCATION_KEY, newLocation);
    } catch (error) {
      console.error('Error saving location to SecureStore:', error);
    }
  };

  const updateTheme = async (newTheme : string) => {
    setTheme(newTheme);
    try {
      await SecureStore.setItemAsync(THEME_KEY, newTheme);
    } catch (error) {
      console.error('Error saving theme to SecureStore:', error);
    }
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        location,
        theme,
        loading,
        updateLocation,
        updateTheme,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};
