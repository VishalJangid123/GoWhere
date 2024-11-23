import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView, StyleSheet
} from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { SceneMap, TabView } from "react-native-tab-view";
import CustomTabBar from "@/components/CustomTab";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter()
  
  const [selectedTab, setSelectedTab] = useState(0);
  const tabs = ['Joined', 'Created', 'Stickers'];

  const { authState, user } = useAuth();

  console.log(authState)

  console.log(user)

  return (
    <SafeAreaView>
      <View className="p-5 gap-5">
        <View className="flex-row justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={25} />
          </TouchableOpacity>

          <View className="flex-row gap-5">
            <TouchableOpacity>
              <Feather name="share" size={25} />
            </TouchableOpacity>

            <TouchableOpacity>
              <Feather name="user-plus" size={25} />
            </TouchableOpacity>

            <TouchableOpacity>
              <Feather name="settings" size={25} />
            </TouchableOpacity>
          </View>
        </View>
        {/* Tags */}
        <ScrollView className="" horizontal={true}>
          <View className="p-3 bg-white rounded-2xl">
            <Text>Explorer</Text>
          </View>
        </ScrollView>

        {/* Profile */}
        <View className="flex-row gap-3">
          <View className="w-32 h-32 bg-primary"></View>

          <View className="flex-col gap-5">
            <View>
              <Text className="font-inter-bold text-2xl">, 26</Text>
              <Text className="font-inter-regular text-lg text-gray-400">
                @vishaljangid123
              </Text>
            </View>
            <View className="flex-row gap-3">
              <Text className="font-inter-regular text-lg">1 Follower</Text>
              <Text className="font-inter-regular text-lg">1 Following</Text>
            </View>
          </View>
        </View>
        <View>
          <Text>Description of user</Text>

          <Text>Description of user</Text>

          <Text>Description of user</Text>
        </View>

        <TouchableOpacity 
        onPress={() => router.push('/EditProfile')}
        className="border-primary border w-full bg-white p-3 m-3 rounded-full justify-center items-center">
          <Text>Edit</Text>
        </TouchableOpacity>

        {/* TABS area */}
        <View style={{height: "100%", backgroundColor: 'transparent'}} > 
        <CustomTabBar
        tabs={tabs}
        selectedTab={selectedTab}
        onSelectTab={(index) => setSelectedTab(index)}
      />
      <ScrollView contentContainerStyle={styles.tabContent}>
        <View style={styles.tabContentWrapper}>
          {selectedTab === 0 && <Text style={styles.tabText}>Content for Tab 1</Text>}
          {selectedTab === 1 && <Text style={styles.tabText}>Content for Tab 2</Text>}
          {selectedTab === 2 && <Text style={styles.tabText}>Content for Tab 3</Text>}
        </View>
      </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  tabContentWrapper: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 18,
    color: '#000',
  },
});
