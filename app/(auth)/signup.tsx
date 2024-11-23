import React from 'react'
import { useNavigation, useRouter } from 'expo-router'
import { View, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native'
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

export default function SignUp() {
    const router = useRouter()
    const navigation = useNavigation();
    const {onRegister, onLogin } = useAuth()

    navigation.setOptions({
      headerShown: true
    })
    
    const register = async () => {
        console.log("register")
        const email = "test@mail.com";
        const pass = "test123";
        const result = await onRegister!(email, pass, )
        if(result && result.error)
        {
            alert(result.msg)
        }
        console.log(result)
    }
    
    return (
    <SafeAreaView>
      <Text onPress={() => router.push('/(auth)/signup')}>Sign up</Text>

      
      <TextInput placeholder='Email' 
      className='p-5 border rounded'
      />
      <TextInput placeholder='Password'  className='p-5 border rounded'/>

      <TouchableOpacity onPress={()=> register()}>
        <Text>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=> router.push('/(auth)')}>
        <Text>Log In</Text>
      </TouchableOpacity>

    </SafeAreaView> 
  )
}