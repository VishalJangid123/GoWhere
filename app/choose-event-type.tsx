import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useNavigation } from "expo-router";

export default function ChooseEventType() {
  const navigation = useNavigation();
  navigation.setOptions({
    headerShown: true,
  });

  const[selectedEventType, setSelectedEventType] = useState("");


  const snapPoints = useMemo(() => ["50%"], []);
  const sheetRef = useRef<BottomSheet>(null);
  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
  }, []);

  const handleClosePress = useCallback((index) => {
    console.log("close");
    sheetRef.current?.close();
  }, []);
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        style={[props.style]}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    []
  );
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TouchableOpacity className="p-20">
        <Text onPress={() => handleSnapPress(0)}>Button</Text>
      </TouchableOpacity>

      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        onChange={() => handleSheetChanges}
      >
        <BottomSheetView className="flex-row w-full justify-center content-center items-center bg-red-300 ">
          
          
          
          <View className="flex flex-col w-40 h-40 border-primary 
          bg-cyan-50 border-2 rounded-xl justify-center items-center">
            <Text className="text-6xl">🌍</Text>
            <Text className="font-inter-semiBold text-sm">Anyone</Text>
          </View>

          <View className="flex flex-col w-40 h-40 border-primary 
          bg-cyan-50 border-2 rounded-xl justify-center items-center">
            <Text className="text-6xl">🌍</Text>
            <Text className="font-inter-semiBold text-sm">Anyone</Text>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    padding: 100,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: "5",
  },
});
