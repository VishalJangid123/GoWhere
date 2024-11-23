import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image
} from "react-native";
import React, { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import TagList from "@/components/TagList";
import { checkDate } from "@/Utils";
import moment from "moment";
import axios from "axios";
import { Location } from "@/context/EventContext";
import { User } from "@/context/AuthContext";

interface Event {
  name: String;
  tags: [String];
  date: Date;
  notesForAttendees: String;
  images: [string],
  location: Location;
  createdBy: User;
}

export default function EventDetails() {
  const router = useRouter();
  const eventLocal = useLocalSearchParams();

  const [event, setEvent] = useState<Event>();

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

          <View className="flex-row gap-3 items-center">
            <Feather name="circle" size={25} />
            <Text className="font-inter-semiBold">{event.createdBy.email}</Text>
          </View>

          <View>
            <Text className="font-inter-regular">{event.notesForAttendees}</Text>
          </View>

          <View className="flex-row">
            <Text>📍</Text>
            <Text>{event.location.name}</Text>
          </View>
        </View>

        <View>
            <Text>47/50 Will go * 1656</Text>
        </View>
      </ScrollView>

      <View className="absolute bottom-7 flex w-full">
        <TouchableOpacity className="justify-center self-center w-[95%] bg-primary p-4 rounded-full items-center">
            <Text className="text-white font-inter-bold text-xl">Join</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
