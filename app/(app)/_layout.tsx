import { Text } from 'react-native';
import { Redirect, Stack, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export const unstable_settings = {
    initialRouteName: '(app)',
  };

export default function AppLayout() {
  const { authState } = useAuth();
    const router = useRouter()
  // You can keep the splash screen open, or render a loading screen like we do here.
  console.log("loading--", authState?.loading)
  if (authState?.loading === true) {
    console.log("---loading--", authState?.loading)
    return <Text>Loading...</Text>;
  }


  console.log("Here")
  console.log(authState?.authenticated)

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!authState?.authenticated || authState?.authenticated === false) {
    console.log("Redirect")
    // router.replace('/signin')
    return <Redirect href="/signin" />;
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="signin"
      />
    </Stack>
  );
}
