import { View, Text, Image } from "react-native";
import React from "react";
import { User } from "@/context/UserContext";

export default function Avatar(user : User) {
  return (
    <>
      <Image
        className="w-10 h-10 inline-block size-8 rounded-full ring-2 ring-white"
        source={{
          uri: user.profilePicture,
        }}
      />
    </>
  );
}
