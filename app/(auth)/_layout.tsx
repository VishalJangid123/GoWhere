import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: '(root)',
};

export default function AppLayout() {
  return (
    <Stack screenOptions={{headerShown: true}}>
      <Stack.Screen 
        name="signup"
        options={{
            headerShown: false
        }}
      />
    </Stack>
  );
}
