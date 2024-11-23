import {
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, Stack, useNavigation, useRouter } from "expo-router";
import {
  Image,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../eventSlice";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import EventCard from "@/components/EventCard";
import ChooseEventType from "../choose-event-type";
import CustomModal from "../../components/CustomModal";
import { Categories } from "@/constants/Categories";
import { useEvent } from "@/context/EventContext";
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";
import CalendarPicker from "react-native-calendar-picker";
import { UserPreferencesProvider, useUserPreferences } from "@/context/UserPreferencesContext";

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const [audienceType, setAudienceType] = useState("");
  const [category, setCategory] = useState("");

  const { eventData, updateEventData } = useEvent();

  const { location, theme, loading, updateLocation, updateTheme }  = useUserPreferences();

  const [placePickerModalVisible, setPlacePickerModelVisible] = useState(false);
  const [distanceSliderModalVisible, setDistanceSliderModelVisible] =
    useState(false);
  const [datePickerModelVisible, setDatePickerVisible] = useState(false);

  const [sliderDistanceValue, setSliderDistanceValue] = useState(3);
  navigation.setOptions({
    headerShown: false,
  });

  const { authState } = useAuth();
  const dispatch = useDispatch();
  const { events, status, error, lastUpdated } = useSelector(
    (state: any) => state.events
  );

  const [isAudienceModalVisible, setIsAudienceModalVisible] =
    useState<boolean>(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] =
    useState<boolean>(false);

  const [selectedPlace, setSelectedPlace] = useState("");

  const onAudienceModalClose = () => {
    setIsAudienceModalVisible(false);
  };

  const OnAudienceSelected = (value: string) => {
    setAudienceType(value);
    updateEventData({ audienceType: value });

    setIsAudienceModalVisible(false);
    setTimeout(() => setIsCategoryModalVisible(true), 500);
  };

  const OnCategorySelected = (value: string) => {
    setCategory(value);
    setIsCategoryModalVisible(false);
    updateEventData({ category: value });
    setTimeout(() => router.push("/CreateNewEvent"), 500);
  };

  const onCategoryModalClose = () => {
    setIsCategoryModalVisible(false);
  };

  const CategoryItem = (item: any) => {
    let text = item.item.item.text;
    let image = item.item.item.image;
    console.log(image);
    return (
      <View className="m-2">
        <TouchableOpacity
          onPress={() => OnCategorySelected(text)}
          className={`flex flex-col w-40 h-40  gap-4
                  rounded-xl justify-center items-center ${
                    category === text
                      ? "border-2 border-primary bg-cyan-50"
                      : ""
                  } `}
        >
          <Image className="w-14 h-14" source={image} />
          <Text className="font-inter-semiBold text-sm">{text}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    if (authState?.authenticated === true) {
      dispatch(fetchEvents());
    }
  }, [dispatch, authState]);


  console.log(loading)

  if(loading ===  true)
  {
    console.log("loading")
  }

  return (
    // header
    <View className="h-full">
      <Stack>
        <Stack.Screen
          options={{
            presentation: "transparentModal",
          }}
          name="choose-event-type"
        />
      </Stack>
      {/* <ChooseEventType /> */}
      <SafeAreaView>
        <View className="p-4 flex-row justify-between min-h-96">
          <TouchableOpacity>
            <Feather name="search" size={25} />
          </TouchableOpacity>

          <View className="flex-row gap-4">
            <TouchableOpacity>
              <Feather name="user-plus" size={25} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/profile')}>
              <Feather name="circle" size={25} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          className="p-4"
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-row gap-2 items-center"
              onPress={() => setPlacePickerModelVisible(true)}
            >
              <Feather name="map-pin" size={20} />
              <Text className="font-inter-regular capitalize">
                {location}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row gap-2 items-center"
              onPress={() => setDistanceSliderModelVisible(true)}
            >
              <MaterialCommunityIcons
                name="map-marker-distance"
                size={24}
                color="black"
              />
              <Text className="font-inter-regular">30km</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row gap-2 items-center"
              onPress={() => setDatePickerVisible(true)}
            >
              <Feather name="calendar" size={20} />
              <Text className="font-inter-regular">14 Nov - 20 Nov</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row gap-2 items-center">
              <Feather name="filter" size={20} />
              <Text className="font-inter-regular">Pubs & Bars</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={{ flex: 1 }} />
        <FlatList
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 160 }}
          data={events}
          scrollEnabled={true}
          showsVerticalScrollIndicator
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => 
          (
            <TouchableOpacity onPress={() => router.push({ pathname : '/EventDetails', params: item})}>
              <EventCard event={item} />
            </TouchableOpacity>
           )}
          ListEmptyComponent={
            <View className="flex justify-center items-center mt-10">
              <Text className="font-inter-regular text-gray-500">
                No events available
              </Text>
            </View>
          }
          refreshing={status === "loading"}
          // Trigger refresh on pull-to-refresh
        />
      </SafeAreaView>
      <TouchableOpacity
        onPress={() => setIsAudienceModalVisible(true)}
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: 130,
          position: "absolute",
          bottom: 80,
          right: 120,
          height: 50,
          backgroundColor: "#49D6D8",
          borderRadius: 100,
          padding: 1,
          zIndex: 10,
          elevation: 10,
        }}
      >
        <Text className="text-white font-inter-bold text-lg">+ New Event</Text>
      </TouchableOpacity>

      <CustomModal
        key={"1"}
        height={"h-[50%]"}
        isVisible={isAudienceModalVisible}
        onClose={onAudienceModalClose}
      >
        {/* A list of emoji component will go here */}
        <View className="flex-row items-center justify-evenly h-[70%]">
          <TouchableOpacity
            onPress={() => OnAudienceSelected("anyone")}
            className={`flex flex-col w-40 h-40  
            rounded-xl justify-center items-center ${
              audienceType === "anyone"
                ? "border-2 border-primary bg-cyan-50"
                : ""
            } `}
          >
            <Text className="text-6xl">🌍</Text>
            <Text className="font-inter-semiBold text-sm">Anyone</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => OnAudienceSelected("People I Choose")}
            className={`flex flex-col w-40 h-40  
            rounded-xl justify-center items-center ${
              audienceType === "People I Choose"
                ? "border-2 border-primary bg-cyan-50"
                : ""
            } `}
          >
            <Text className="text-6xl">🔐</Text>
            <Text className="font-inter-semiBold text-sm">People I Choose</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>

      <CustomModal
        key={"2"}
        height={"h-[70%]"}
        isVisible={isCategoryModalVisible && audienceType !== ""}
        onClose={onCategoryModalClose}
      >
        <View className="flex-1 w-full h-[80%] items-center justify-evenly content-center">
          <FlatList
            data={Categories}
            numColumns={2}
            renderItem={(item) => <CategoryItem item={item} />}
          />
        </View>
      </CustomModal>

      <CustomModal
        height="h-[40%]"
        isVisible={placePickerModalVisible}
        onClose={() => 
          {
            setSelectedPlace("")
            setPlacePickerModelVisible(false)
          }}
      >
        <TouchableOpacity
          className="absolute top-8 right-8"
          onPress={() => 
            {
              console.log(selectedPlace)
              updateLocation(selectedPlace)
              setPlacePickerModelVisible(false)
            }}
        >
          <Text className="text-xl font-inter-semiBold">Done</Text>
        </TouchableOpacity>
        <Picker
          style={{ paddingTop: 10 }}
          selectedValue={selectedPlace === "" ? location : selectedPlace}
          onValueChange={(itemValue, itemIndex) => setSelectedPlace(itemValue)}
        >
          <Picker.Item label="Bangkok" value="Bangkok" />
          <Picker.Item label="Pathum Thani" value="Pathum Thani" />
          <Picker.Item label="Nontaburi" value="Nontaburi" />
          <Picker.Item label="Ayuttaya" value="Ayuttaya" />
        </Picker>
      </CustomModal>

      <CustomModal
        height="h-[30%]"
        isVisible={distanceSliderModalVisible}
        onClose={() => {
          setDistanceSliderModelVisible(false)
        }}
      >
        <TouchableOpacity
          className="absolute top-8 right-8"
          onPress={() => setPlacePickerModelVisible(false)}
        >
          <Text className="text-xl font-inter-semiBold">Done</Text>
        </TouchableOpacity>
        <View className="pt-16 gap-5 items-start pl-7">
          <Text className="font-inter-semiBold">Maximum distance {parseInt(sliderDistanceValue)}</Text>
          <Slider
            style={{ width: 350, height: 40 }}
            minimumValue={3}
            maximumValue={100}
            minimumTrackTintColor="#49D6D8"
            maximumTrackTintColor="#C3C3C3"
            onValueChange={(val) => setSliderDistanceValue(val)}
          />
        </View>
      </CustomModal>

      <CustomModal
        height="h-[50%]"
        isVisible={datePickerModelVisible}
        onClose={() => console.log("Date picker close")}
      >
        <TouchableOpacity
          className="absolute top-8 right-8"
          onPress={() => setDatePickerVisible(false)}
        >
          <Text className="text-xl font-inter-semiBold">Done</Text>
        </TouchableOpacity>
        <View className="mt-7">
        <CalendarPicker
          onDateChange={() => console.log("first")}
          textStyle={{ fontFamily: "Poppins_400Regular" }}
          previousTitle="<"
          previousTitleStyle={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 30,
          }}
          nextTitle=">"
          nextTitleStyle={{ fontFamily: "Poppins_600SemiBold", fontSize: 30 }}
          disabledDatesTextStyle={{ color: "#D9E1E8" }}
          minDate={new Date()}
          selectedDayColor="#49D6D8"
          selectedDayTextColor="#FFFFFF"
          todayBackgroundColor="#49D6D8"
          allowRangeSelection={true}
          selectedRangeStartTextStyle={{ color: "#FFFFFF" }}
          width={350}
        />
        </View>
      </CustomModal>
    </View>
  );
}
