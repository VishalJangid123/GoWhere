import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList
} from "react-native";
import React, { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import TagList from "@/components/TagList";
import { checkDate } from "@/Utils";
import moment from "moment";
import axios from "axios";
import { Location } from "@/context/EventContext";
import { User, useUser } from "@/context/UserContext";
import Avatar from "@/components/Avatar";

interface Event {
  id: string;
  name: String;
  tags: [String];
  date: Date;
  notesForAttendees: String;
  images: [string],
  location: Location;
  createdBy: User;
  attendees : [User],
  isCreator : Boolean;
  isAttendee : Boolean;
}

export default function EventDetails() {
  const router = useRouter();
  const eventLocal = useLocalSearchParams();

  const [event, setEvent] = useState<Event>();
  const { user } = useUser();

  const fetchEvents = async () => {
    const API_URL = "http://localhost:3000/event/";

    const response = await axios.get(API_URL + eventLocal._id);
    console.log("response.data");
    console.log(response.data);
    setEvent(response.data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (!event) {
    return <Text>Loading</Text>;
  }

  const JoinEvent = async() => {
    try{
      const response = await axios.post("http://localhost:3000/api/users/events/join/" + event.id)
      console.log(response)
    }
    catch(e)
    {
      console.log(e)
    }
  }


  return (
    <SafeAreaView style={{ backgroundColor: "white", height: '100%' }}>
      <ScrollView>
        <View className="p-4 flex-row justify-between min-h-96">
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={25} />
          </TouchableOpacity>

          <View className="flex-row gap-4">
            <TouchableOpacity>
              <Feather name="user-plus" size={25} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/profile")}>
              <Feather name="settings" size={25} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Image */}

        {
            event.images.length > 0 && (
                <View className="h-50 items-center">
                <Image source={{uri : event.images[0]}} className="w-5/6 h-52 aspect-auto rounded-3xl"/>
            </View>
            )
        }
       

        {/* Tags */}

        <View className="p-5 gap-3">
          <TagList tags={event.tags} />

          <View className="gap-1">
            <Text className="font-inter-regular text-gray-500 text-xs">
              {checkDate(event.date) +
                moment(event.date).format("ddd, DD MMM YYYY, h:mm A") +
                ""}
            </Text>
            <Text className="font-inter-semiBold text-lg">{event.name}</Text>
            <Text className="font-inter-semiBold text-gray-500 ">
              {event.location.name}
            </Text>
          </View>

          <TouchableOpacity 
          onPress={() => router.navigate({pathname: '/profile', params: event.createdBy.id})}
          className="flex-row gap-3 items-center">
          {/* <Image
              className="w-10 h-10 inline-block size-8 rounded-full ring-2 ring-white"
              source={{
                uri: event.createdBy.profilePicture ? event.createdBy.profilePicture,
              }}
            /> */}
            <Text className="font-inter-semiBold">{event.createdBy.fullName}</Text>
          </TouchableOpacity>

          <View>
            <Text className="font-inter-regular">{event.notesForAttendees}</Text>
          </View>

          <View className="flex-row">
            <Text>📍</Text>
            <Text>{event.location.name}</Text>
          </View>
        </View>

        <View className="p-5">
            <Text className="font-inter-semiBold">{event.attendees.length} Will go * 1656</Text>
        </View>

        <View className="p-5 flex-row justify-start">
          <TouchableOpacity className="flex-col items-center gap-3">
            <Feather name='plus-circle' size={70} color={"#49D6D8"}/>
            <Text className="font-inter-semiBold">Add Friends</Text>
          </TouchableOpacity>

          
          {
            event.attendees &&
            event.attendees.map((item, index) => (
              <View className="flex-col flex items-center gap-2">
              <Avatar size={24} imageUrl={item.profilePicture} title={item.fullName} />
              <Text className="text-lg font-inter-regular">{item.fullName}</Text>
              </View>
            ))
          }
          
          {/* <FlatList
          data = {event.attendees}
          renderItem={(item, index) => (
            <View className="bg-red-400 flex-col flex items-center gap-2">
            <Avatar size={24} imageUrl={item.item.profilePicture} title={item.item.fullName} />
            <Text className="text-lg font-inter-regular">{item.item.fullName}</Text>
            </View>
          )}    
          /> */}

        </View>


      </ScrollView>

      <View className="absolute bottom-7 flex w-full">
        <TouchableOpacity 
        onPress={()=> JoinEvent()}
        className="justify-center self-center w-[95%] bg-primary p-4 rounded-full items-center">
            <Text className="text-white font-inter-bold text-xl">
              { event.isAttendee ? "Chat" : "Join" }
              </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
