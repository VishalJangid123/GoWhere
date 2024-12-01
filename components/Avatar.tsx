import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

interface AvatarProps {
  title: string;
  imageUrl?: string | null;
  leftIcon?: string;
  rightIcon?: string;
  size?: number;
  allowClick: boolean | false | null
}

const Avatar: React.FC<AvatarProps> = ({
  title,
  imageUrl,
  leftIcon,
  rightIcon,
  size = 40,
  allowClick
}) => {
  const getInitials = (name: string): string => {
    const nameParts = name.split(" ").filter(Boolean);
    const initials = nameParts.map((part) => part[0].toUpperCase()).join("");
    return initials || "N/A";
  };

  return (
    <TouchableOpacity
    onPress={() => allowClick}
    className={`flex-row items-center justify-center rounded-full`}>
      {/* Left Icon */}
      {leftIcon && (
        <View className={`mr-2`}>
          <Feather name={leftIcon} size={18} color="gray" />
        </View>
      )}

      {/* Avatar (Image or Initials) */}
      <View
        className={`rounded-full justify-center items-center bg-gray-200 border border-gray-300 w-${size} h-${size}`}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            className={`w-${size} h-${size}`}
          />
        ) : (
          <Text className={`text-white font-bold text-xl`}>
            {getInitials(title)}
          </Text>
        )}
      </View>

      {/* Right Icon */}
      {rightIcon && (
        <View className={`ml-2`}>
          <Feather name={rightIcon} size={18} color="gray" />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Avatar;
