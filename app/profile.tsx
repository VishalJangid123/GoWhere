import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
  Image
} from "react-native";
import React, { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { SceneMap, TabView } from "react-native-tab-view";
import CustomTabBar from "@/components/CustomTab";
import { useAuth } from "@/context/AuthContext";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import EventCard from "@/components/EventCard";

export default function Profile() {
  const userLocal = useLocalSearchParams();
  const router = useRouter();

  const [ mine, setMine ] = useState(false)

 

  const [selectedTab, setSelectedTab] = useState(0);
  const tabs = ["Joined", "Created", "Stickers"];

  const { authState, onLogOut } = useAuth();
  const { user, refreshUserData } = useUser();
  console.log(user);

  const [createdEvents, setCreatedEvent] = useState();
  const [joinedEvents, setJoinedEvent] = useState();

  useEffect(() => {
    if(userLocal)
    { 
        setMine(false)
        
    }
    else{
        setMine(true)
        refreshUserData();
    }
    
    fetchJoinedEvent()
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user]);

  const fetchCreatedEvent = async () => {
    const response = await axios.get(
      "http://localhost:3000/api/users/events/created"
    );
    console.log(response.data);
    setCreatedEvent(response.data.events);
  };

  const fetchJoinedEvent = async () => {
    const response = await axios.get(
      "http://localhost:3000/api/users/events/joined"
    );
    console.log('joined',response.data);
    setJoinedEvent(response.data.events);
  };

  useEffect(() => {
    if (selectedTab === 1) {
      //created
      fetchCreatedEvent();
    }
    if(selectedTab === 0)
    {
      fetchJoinedEvent();
    }
  }, [selectedTab]);

  return (
    <View className="bg-white">
    <SafeAreaView >
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

            <TouchableOpacity onPress={() => onLogOut()}>
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
          <View className="w-32 h-32">
          <Image
                className="w-32 h-32 rounded-xl"
                source={
                  user.profilePicture
                    ? {uri : user.profilePicture}
                    : require("../assets/images/Icons/bar.png")
                }
              />
          </View>

          <View className="flex-col gap-5">
            <View>
              <Text className="font-inter-bold text-2xl">
                {user.fullName}, 26
              </Text>
              {user.username && (
                <Text className="font-inter-regular text-lg text-gray-400">
                  {user.username}
                </Text>
              )}
            </View>
            <View className="flex-row gap-3">
              <Text className="font-inter-regular text-lg">1 Follower</Text>
              <Text className="font-inter-regular text-lg">1 Following</Text>
            </View>
          </View>
        </View>
        <View className="gap-3">
          {user.aboutMe ? 
            <Text className="font-inter-regular">{user.aboutMe}</Text>
            :
            <Text className="font-inter-regular">{user.fullName} hasn't written anything yet.</Text>
          }

          {user.jobTitle && (
            <Text className="font-inter-regular">💼 {user.jobTitle}</Text>
          )}

          {user.school && (
            <Text className="font-inter-regular">{user.school}</Text>
          )}

          {user.gender && (
            <Text className="font-inter-regular capitalize">{user.gender}</Text>
          )}
        </View>

        <TouchableOpacity
          onPress={() => router.push("/EditProfile")}
          className="border-gray-400 border-2 w-full bg-white p-2 m-3 rounded-full justify-center items-center"
        >
          <Text className="font-inter-semiBold text-primary">Edit Profile</Text>
        </TouchableOpacity>

        {/* TABS area */}
        <View style={{ height: "100%", backgroundColor: "transparent" }}>
          <CustomTabBar
            tabs={tabs}
            selectedTab={selectedTab}
            onSelectTab={(index) => setSelectedTab(index)}
          />
          <ScrollView contentContainerStyle={styles.tabContent}>
            <View >
              {selectedTab === 0 && (
                <FlatList
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 160 }}
                data={joinedEvents}
                scrollEnabled={true}
                showsVerticalScrollIndicator
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      router.push({ pathname: "/EventDetails", params: item })
                    }
                  >
                    <EventCard event={item} />
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View className="flex justify-center items-center mt-10">
                    <Text className="font-inter-regular text-gray-500">
                      No events available
                    </Text>
                  </View>
                }
                // Trigger refresh on pull-to-refresh
              />
              )}
              {selectedTab === 1 && (
                <FlatList
                  contentContainerStyle={{ flexGrow: 1, paddingBottom: 160 }}
                  data={createdEvents}
                  scrollEnabled={true}
                  showsVerticalScrollIndicator
                  keyExtractor={(item) => item._id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() =>
                        router.push({ pathname: "/EventDetails", params: item })
                      }
                    >
                      <EventCard event={item} />
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <View className="flex justify-center items-center mt-10">
                      <Text className="font-inter-regular text-gray-500">
                        No events available
                      </Text>
                    </View>
                  }
                  // Trigger refresh on pull-to-refresh
                />
              )}
              {selectedTab === 2 && (
                <Text style={styles.tabText}>Content for Tab 3</Text>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabContent: {
    flex: 1,
    paddingTop: 20,
  },
  tabContentWrapper: {
    alignItems: "center",
  },
  tabText: {
    fontSize: 18,
    color: "#000",
  },
});
