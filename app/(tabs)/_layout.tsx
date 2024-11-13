import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, StyleSheet, Text } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Feather } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
    screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarShowLabel: false,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            left: 16,
            right: 16,
            height: 72,
            elevation : 0,
            alignContent: 'center',
            justifyContent: 'center',
            backgroundColor:"white"
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => 
          <View style={styles
            .tabButtonStyle
          }>
            <Text>
            <Feather size={28} name="home" color={color} />,
            </Text>

          </View>
        }}
      />
      <Tabs.Screen
        name="myevents"
        options={{
          title: 'Events',
          tabBarIcon: ({ color }) => <Feather size={28} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'add',
          tabBarIcon: ({ color }) => 
          <View style={{
            alignContent: 'center',
            justifyContent:'center',
            height: 56,
            width: 56,
            marginBottom: 56,
            backgroundColor:  'red',
            borderRadius: 999,
            alignItems: 'center'
          }}>
            <Text>
            <Feather size={28} name="plus" color={"white"} />,
            </Text>
          </View>
        }}
      />
      <Tabs.Screen
        name="maps"
        options={{
          title: 'Maps',
          tabBarIcon: ({ color }) => <Feather size={28} name="map" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Feather size={28} name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabButtonStyle: {
  //  paddingTop: 10
  },
})