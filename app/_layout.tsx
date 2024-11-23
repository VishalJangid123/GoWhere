import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import {
  Poppins_100Thin,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Redirect, Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

import "../global.css";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { View, Text, SafeAreaView } from "react-native";
import store from "../store";
import { Provider } from "react-redux";
import { EventProvider } from '@/context/EventContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Poppins_100Thin,
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const { authState } = useAuth();

  console.log("Root", authState);

  return (
    <Provider store={store}>
      <EventProvider>
      <AuthProvider>
        <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen name="index" />
          <Stack.Screen
            name="SelectTypeOfEvent"
            options={{
              presentation: "modal",
            }}
          />
        </Stack>

        {/* <SafeAreaView>
    <Text>{authState?.token ? 'true' : 'false'}</Text>
    {authState?.authenticated ?
      <Text>Welcome</Text>  : <Text>Login</Text>
    }
    </SafeAreaView> */}
      </AuthProvider>
      </EventProvider>
    </Provider>
  );
}
