import React, { useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import CustomButton from "@/components/CustomButton";

export default function SignIn() {
  const router = useRouter();
  const navigation = useNavigation();
  const { onLogin } = useAuth();
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (field, value) => {
    console.log(field, value);
    setLoginForm({
      ...loginForm,
      [field]: value,
    });
  };

  navigation.setOptions({
    headerShown: false,
  });

  const login = async () => {
    const result = await onLogin!(loginForm.email, loginForm.password);
    if (result && result.error) {
      alert(result.msg);
    }
    // console.log(result)
    console.log("first1");
    router.navigate("/(app)/(tabs)");
    console.log("first2");
  };
  return (
    <View className="bg-white h-full justify-center">
      <SafeAreaView>
        <View className="p-5 gap-5 justify-center content-center">
          <Text className="text-2xl font-inter-bold">Login</Text>

          <View className="gap-2">
            <Text className="font-inter-semiBold">Email</Text>
            <TextInput
              autoCapitalize='none'
              keyboardType="email-address"
              onChangeText={(text) => handleChange("email", text)}
              placeholder="myemail@email.com"
              className="p-5 border border-gray-400 rounded-2xl elevation"
            />
          </View>

          <View className="gap-2">
            <Text className="font-inter-semiBold">Password</Text>
            <TextInput
              autoCapitalize='none'
              onChangeText={(text) => handleChange("password", text)}
              placeholder="********"
              className="p-5 border border-gray-400 rounded-2xl elevation"
            />
          </View>

          <CustomButton title="login" onPress={() => login()} />
          <CustomButton
            type="outline"
            title="Sign up"
            onPress={() => router.push("/(auth)/signup")}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
