import React, { useState } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import { View, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native'
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import CustomButton from '@/components/CustomButton';

export default function SignUp() {
    const router = useRouter()
    const navigation = useNavigation();
    const {onRegister, onLogin } = useAuth()

    const [ registerForm, setRegisterForm ] = useState({
      fullName : "",
      email : "",
      password: ""
    }) 


    const handleChange = (field: string, value : string) => {
      setRegisterForm({
        ...registerForm,
        [field]: value,
      });
    };

    navigation.setOptions({
      headerShown: false
    })
    
    const register = async () => {
        const result = await onRegister!(registerForm.fullName ,registerForm.email, registerForm.password, )
        if(result && result.error)
        {
            alert(result.msg)
        }
        console.log(result)
    }
    
    return (
      <SafeAreaView>
      <View className="p-5 gap-5 justify-center content-center">
      <Text className="text-2xl font-inter-bold">Sign Up</Text>

      <View className="gap-2">
      <Text className="font-inter-semiBold">Full Name</Text>
      <TextInput 
      onChangeText={(text) => handleChange('fullName', text)}
      placeholder="eg. Vishal" className="p-5 border border-gray-400 rounded-2xl elevation" />
      </View>
      
      <View className="gap-2">
      <Text className="font-inter-semiBold">Email</Text>
      <TextInput 
      autoCapitalize='none'
      keyboardType='email-address'
      onChangeText={(text) => handleChange('email', text)}
      placeholder="eg. myemail@email.com" className="p-5 border border-gray-400 rounded-2xl elevation" />
      </View>

      <View className="gap-2">
      <Text className="font-inter-semiBold">Password</Text>
      <TextInput 
      autoCapitalize='none'
      keyboardType='email-address'
      onChangeText={(text) => handleChange('password', text)}
      secureTextEntry
      placeholder="********" className="p-5 border border-gray-400 rounded-2xl elevation" />
      </View>
      
      


      <CustomButton title="Create Account" onPress={()=> register()} />
      <CustomButton type="outline" title="Already have account" onPress={()=>  router.navigate('/signin')} />
      </View>
    </SafeAreaView>
  )
}