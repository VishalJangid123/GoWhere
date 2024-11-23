import {
  View,
  Image,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";

export default function EditProfile() {
  return (
    <SafeAreaView>
      <View className="p-5">
        {/* Header */}

        <View className="flex-row justify-between">
          <TouchableOpacity>
            <Feather name="arrow-left" size={25} />
          </TouchableOpacity>

          <Text className="font-inter-semiBold">Edit Profile</Text>

          <TouchableOpacity>
            <Text className="font-inter-semiBold">Save</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-col gap-5">
          {/* Edit Image */}

          <View className="flex justify-center items-center pt-5">
            <Image
              className="w-20 h-20"
              source={require("../assets/images/Icons/bar.png")}
            />
          </View>

        <View className="gap-2">
            <Text className="font-inter-semiBold">Full Name</Text>
            <TextInput  
            className="p-5 bg-white"
            placeholder="Name" />
        </View>

        </View>
      </View>
    </SafeAreaView>
  );
}
