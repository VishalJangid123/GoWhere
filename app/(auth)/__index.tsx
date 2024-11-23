import { View, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation, useRouter } from 'expo-router'
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const router = useRouter()
  const navigation = useNavigation();
  const { onLogin } = useAuth();

  navigation.setOptions({
    headerShown: false
  })

  const login = async () => {
    console.log("login")
    const email = "test@mail.com";
    const pass = "test123";
    const result = await onLogin!(email, pass)
    if(result && result.error)
    {
       alert(result.msg)
    }
    // console.log(result)
    console.log("first1")
    router.navigate('/(tabs)')
    console.log("first2")
  }
  return (
    <SafeAreaView>
      <Text onPress={() => router.push('/(auth)/signin')}>Login</Text>

      
      <TextInput placeholder='Email' 
      className='p-5 border rounded'
      />
      <TextInput placeholder='Password'  className='p-5 border rounded'/>

      <TouchableOpacity onPress={() => login()}>
        <Text>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=> router.push('/(auth)/signup')}>
        <Text>Sign up</Text>
      </TouchableOpacity>

    </SafeAreaView> 
  )
}