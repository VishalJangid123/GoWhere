import React from "react";
import { TouchableOpacity, Text, View, ActivityIndicator } from "react-native";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  type?: "primary" | "outline"; 
  loading?: boolean;
  disabled?: boolean;
  style?: object; 
  textStyle?: object; 
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  type = "primary", 
  loading = false,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`py-3 px-6 rounded-full justify-center items-center
        ${
          type === "primary" ? "bg-primary text-white" : "border-2 border-gray-400 text-primary"
        },
        ${disabled || loading ? "opacity-50" : ""}`}
      disabled={disabled || loading} 
    >
      <View className={"flex-row items-center"}>
        {loading ? <ActivityIndicator size="small" color="white" /> : null}

        <Text className={`text-lg font-inter-semiBold capitalize  ${
          type === "primary" ? "text-white" : "text-primary"
        }`}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
