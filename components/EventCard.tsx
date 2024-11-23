import { View, Image, Text } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import moment from "moment";
import { checkDate } from "../Utils";
import TagList from "./TagList";

export default function EventCard({ event }) {
  return (
    <View>
      <View className="m-2 gap-1 rounded-xl elevation bg-white">
        <View className="bg-amber-300 h-10 rounded-t-xl flex-row items-center justify-center">
          <Text className="text-center font-inter-semiBold ">Super User</Text>
        </View>

        <View className="flex-row items-center">
          <Text className="pl-3">🌍 </Text>
          <TagList tags={event.tags} />
        </View>

        <View className="p-4 gap-2">
          <Text className="font-inter-regular text-gray-500">
            {checkDate(event.date) +
              moment(event.date).format("ddd, DD MMM YYYY, h:mm A") +
              ""}
          </Text>
          <Text className="font-inter-semiBold">{event.name}</Text>
          <Text className="font-inter-regular text-gray-500 ">
            {event.location.name}
          </Text>
        </View>

        <View className="flex-row items-center gap-3">
          <View className="flex-row -space-x-4 overflow-hidden">
            <Image
              className="w-10 h-10 inline-block size-8 rounded-full ring-2 ring-white"
              source={{
                uri: "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              }}
            />
            <Image
              className="w-10 h-10 inline-block size-8 rounded-full ring-2 ring-white"
              source={{
                uri: "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              }}
            />
            <Image
              className="w-10 h-10 inline-block size-8 rounded-full ring-2 ring-white"
              source={{
                uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
              }}
            />
            <Image
              className="w-10 h-10 inline-block size-8 rounded-full ring-2 ring-white"
              source={{
                uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              }}
            />
          </View>
          <View className="flex-row  gap-2 p-2 rounded-2xl bg-gray-300 ">
            <Feather name="user" size={15} color={"#6b7280"} />
            <Text className="text-gray-600">1624</Text>
          </View>
        </View>

        <View className="flex-col ">
          <Text>1/2 Will go * 13 Interested</Text>
          <Text>This is a general event description</Text>
        </View>
      </View>
    </View>
  );
}
