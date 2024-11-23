import { View, Text, Button, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useCallback, useMemo, useRef } from 'react'
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
export default function maps() {
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);
  const sheetRef = useRef<BottomSheet>(null);
  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
  }, []);

  const handleClosePress = useCallback((index) => {
    console.log("close")
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
    <GestureHandlerRootView  style={{flex: 1}}>
      <TouchableOpacity className='p-20'>

      <Text onPress={() => handleSnapPress(0)}>Button</Text>
      </TouchableOpacity>

     <BottomSheet
        ref={sheetRef}
        index={1}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        onChange={()=> handleSheetChanges}
      >
        <BottomSheetView >
          <Text>Awesome 🔥</Text>
        </BottomSheetView>
      </BottomSheet>

      </GestureHandlerRootView>
  )
}