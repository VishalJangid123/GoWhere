import { View, Image, Text } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import moment from "moment";
import { checkDate } from "../Utils";
import TagList from "./TagList";
import Avatar from "./Avatar";

export default function EventCard({ event }) {
  return (
    <View className="elevation-xl">
      <View className="m-2 gap-1 rounded-xl elevation bg-white">
        <View className="bg-amber-300 h-10 rounded-t-xl flex-row items-center justify-center">
          <Text className="text-center font-inter-semiBold ">{event.createdBy.badge}</Text>
        </View>

        <View className="flex-row items-center">
          <Text className="pl-3">🌍 </Text>
          <TagList tags={event.tags} />
        </View>

        <View className="pl-4 gap-2">
              <Text className="font-inter-regular text-gray-500">
                {checkDate(event.date) +
                  moment(event.date).format("ddd, DD MMM YYYY, h:mm A") +
                  ""}
              </Text>
              <Text className="font-inter-semiBold">{event.name}</Text>
            </View>

       

        <View className="flex-row">
          <View className="w-2/3">
          <View className="pl-4 gap-2">
              <Text className="font-inter-regular text-gray-500 ">
                {event.location.name}
              </Text>
            </View>

            {event.attendees && event.attendees.length > 0 && (
              <View className="p-4 flex-row items-center gap-3">
                <View className="flex-row -space-x-4 overflow-hidden">
                  {event.attendees &&
                    event.attendees.map((item, index) => (
                      <Avatar
                        title={item.fullName}
                        imageUrl={item.profilePicture}
                        size={10}
                      />
                    ))}
                </View>
                {event.attendees && event.attendees.length > 0 && (
                  <View className="flex-row  gap-2 p-2 rounded-2xl bg-gray-300 ">
                    <Feather name="user" size={15} color={"#6b7280"} />
                    <Text className="text-gray-600">
                      {event.attendees.length}
                    </Text>
                  </View>
                )}
              </View>
            )}

            <View className="flex-col p-4 ">
              {/* <Text>1/2 Will go * 13 Interested</Text> */}
              <Text>{event.notesForAttendees}</Text>
            </View>
          </View>
          <View className="items-center content-center justify-center">
            <Image source={{ uri: event.images[0] }} className="aspect-square w-32 rounded-2xl" />
          </View>
        </View>
      </View>
    </View>
  );
}
