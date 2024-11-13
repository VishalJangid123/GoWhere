import { Feather } from '@expo/vector-icons';
import { Image, StyleSheet, View, Text, SafeAreaView } from 'react-native';



export default function HomeScreen() {
  return (
    // header
    <SafeAreaView>
      <View className='flex-row justify-between p-5'>

      <View></View> 
      <View className='item-center content-center justify-center flex-col '>
        <Text className='font-thin text-sm'>Current Location
          <Feather name='chevron-down' />
        </Text>
        <Text className='font-semibold text-center'>Bangkok</Text>
      </View>
      <View>
        <Feather name='bell' size={25} />
      </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
