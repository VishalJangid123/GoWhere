import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  TouchableOpacity,
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  Alert,
  Image,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import moment from "moment";
import BottomSheetTags from "@/components/BottomSheetTags";
import { useEvent } from "@/context/EventContext";
import CustomModal from "@/components/CustomModal";
import getTagsByCategory from "@/constants/tags";
import { SafeAreaView } from "react-native-safe-area-context";

import * as ImagePicker from "expo-image-picker";

export default function CreateEventScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const loc = useLocalSearchParams();

  const { eventData, updateEventData } = useEvent();

  const [droppedPin, setDroppedPin] = useState({});
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [eventName, setEventName] = useState<string>("");
  const [notes, setNotes] = useState("");

  const [postDisabled, setPostDisabled] = useState<boolean>(true);
  // setDroppedPin(loc);

  const [selectedTags, setSelectedTags] = useState([]);

  const [tagsModelVisible, setTagsModelVisible] = useState(false);

  const OnTagsModelClosed = () => {
    setTagsModelVisible(false);
  };

  const handleTagsSelect = (newTag: string) => {
    let temp = eventData.tags;
    const index = temp.indexOf(newTag);
    if (index > -1) {
      temp.splice(index, 1);
      updateEventData({ tags: temp });
    } else {
      updateEventData({ tags: [...eventData.tags, newTag] });
    }
  };

  const addEvent = async () => {
    let event = {
      name: eventName,
      location: {
        type: "Point",
        coordinates: [
          eventData.location.latitude,
          eventData.location.longitude,
        ],
        name: eventData.location.name,
        street: eventData.location.street,
        district: eventData.location.district,
        province: eventData.location.province,
      },
      notesForAttendees: notes,
      tags: eventData.tags,
      date: selectedDate,
      time: selectedDate?.getTime(),
    };

    const formData = new FormData();
        formData.append('image', {
            uri: image,
            type: 'image',
            name: event.name + "-image",
        });

        // Add event details to formData
        formData.append('name', event.name);
        formData.append('location', JSON.stringify(event.location));
        formData.append('notesForAttendees', event.notesForAttendees);
        formData.append('tags', JSON.stringify(event.tags));
        formData.append('date', JSON.stringify(event.date));
        formData.append('time', event.time);

        try {
            const response = await axios.post('http://localhost:3000/event/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data) {
              setEventName("");
            }
            router.navigate("/profile");

            Alert.alert('Success', 'Event created successfully');
            console.log(response.data);  // Log the created event data
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to create event');
        }


    // const result = await axios.post(
    //   "http://localhost:3000/event/create",
    //   event
    // );
    // console.log(result.data);

    

  };

  // Date Picker
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  useEffect(() => {
    let disabled = true;
    if (selectedDate !== "" && notes.length !== 0 && eventName.length > 2) {
      disabled = false;
    }

    setPostDisabled(disabled);
  }, [selectedDate, notes, eventName]);

  const CustomInput = ({ placeholder, icon, onPress, ...props }) => {
    return (
      <View className="flex-row p-5 gap-5 items-center">
        <Text>{icon}</Text>
        <TextInput
          props
          placeholder={placeholder}
          className="font-inter-semiBold text-xl"
          onPress={() => onPress()}
        />
      </View>
    );
  };

  const tags = getTagsByCategory(eventData.category);

  const TagBadge = (tag: any) => {
    tag = tag.tag;
    const selectedTag = eventData.tags.find((ele) => ele == tag);
    return (
      <TouchableOpacity
        onPress={() => handleTagsSelect(tag)}
        className={`m-1 p-2  rounded-full ${
          selectedTag ? "bg-cyan-100" : "bg-gray-100"
        }`}
      >
        <Text className="text-xs font-inter-regular">{tag}</Text>
      </TouchableOpacity>
    );
  };

  const ViewTagBadge = (tag: any) => {
    tag = tag.tag;
    return (
      <TouchableOpacity
        onPress={() => setTagsModelVisible(true)}
        className={`m-1 p-2 bg-gray-100 rounded-full`}
      >
        <Text className="text-xs font-inter-regular">{tag}</Text>
      </TouchableOpacity>
    );
  };

  const [image, setImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState(null);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log("Image set");
      console.log(image);
    }
  };

  return (
    <SafeAreaView
      edges={["right", "left", "top", "bottom"]}
      style={{ backgroundColor: "white" }}
    >
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      {/* header */}
      <View className="flex-row justify-between p-5">
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} />
        </TouchableOpacity>

        <View className="justify-center items-center gap-2">
          <Text className="items-center font-bold font-inter-bold">
            Create Event
          </Text>
          <Text className="font-inter-regular text-gray-400 text-sm">
            How to create a popular event?
          </Text>
        </View>

        <TouchableOpacity>
          <Feather name="book" size={25} />
        </TouchableOpacity>
      </View>

      {/* Event */}

      <ScrollView>
      <View className="p-5">
        <View className="p-1 border-primary w-24 rounded-2xl  justify-center items-center border">
          <Text className="text-primary font-inter-semiBold text-sm">
            🌍 Public
          </Text>
        </View>

        <View className="flex-row p-5 gap-5 items-center">
          <Text>✏️</Text>
          <TextInput
            placeholder="Event Name"
            className="font-inter-semiBold text-xl"
            onChangeText={(text) => setEventName(text)}
          />
        </View>
        <TouchableOpacity
          className="flex-row p-5 gap-5 items-center"
          onPress={() => {
            router.push("/create-event/search-place");
          }}
        >
          <Text className="text-xl">📍</Text>
          {eventData.location.name === "" ? (
            <Text className="font-inter-semiBold text-xl text-gray-400">
              Drop Pin
            </Text>
          ) : (
            <Text className="font-inter-semiBold text-xl">
              {eventData.location.name}
            </Text>
          )}
        </TouchableOpacity>

        <View>
          <View className="flex-col">
            <TouchableOpacity
              className="flex-row pt-5 pl-5 gap-5 items-center"
              onPress={() => pickImage()}
            >
              <Text className="text-xl">🖼️</Text>
              <Text className="font-inter-semiBold text-xl">
                Photos (optional)
              </Text>
            </TouchableOpacity>
            <View className="pl-16 ">
              {image ? (
                <TouchableOpacity
                onPress={() => pickImage()} >
                <Image
                  className="rounded-xl"
                  source={{ uri: image }}
                  style={{
                    width: 125,
                    height: 91,
                    marginTop: 20,
                  }}
                />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                onPress={() => pickImage()}
                className="mt-5 w-36 h-24 bg-gray-300 rounded-xl items-center justify-center">
                  <Image
                    className=""
                    source={require("../assets/images/image-placeholder.png")}
                    style={{ width: 50, height: 50 }}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* <TouchableOpacity onPress={uploadImage} >Upload Image</TouchableOpacity> */}
          {imageUrl && <Text>Image URL: {imageUrl}</Text>}
        </View>

        <View className="flex-row p-5 gap-5 items-center">
          <Text className="text-xl">📆</Text>
          <TouchableOpacity
            className="font-inter-semiBold text-xl"
            onPress={() => setDatePickerVisibility(true)}
          >
            <Text
              className={`font-inter-semiBold text-xl ${
                selectedDate === "" ? "text-gray-400" : "text-black"
              }`}
            >
              {selectedDate === ""
                ? "Pick a date"
                : moment(selectedDate).format("MMM DD YY, h:mm A")}
            </Text>
          </TouchableOpacity>
        </View>

        <CustomInput
          placeholder={"Max 5 People"}
          icon={"#️⃣"}
          onPress={() => {}}
        />

        <View className="flex-row p-5 gap-5 items-center">
          <Text>🏷️</Text>
          <TouchableOpacity
            className="font-inter-semiBold text-xl"
            onPress={() => setTagsModelVisible(true)}
          >
            <TouchableOpacity className="flex gap-2">
              <FlatList
                data={eventData.tags}
                scrollEnabled={false}
                keyExtractor={(item) => item}
                numColumns={3}
                renderItem={({ item }) => <ViewTagBadge tag={item} />}
                ListEmptyComponent={
                  <TouchableOpacity onPress={() => setTagsModelVisible(true)}>
                    <Text className="font-inter-semiBold text-xl text-gray-400">{`Add ${eventData.category} tags`}</Text>
                  </TouchableOpacity>
                }
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        <View className="p-5 flex-col gap-5">
          <View className="flex-row gap-5">
            <Text>📝</Text>
            <Text className="text-lg font-inter-bold">Notes</Text>
          </View>
          <TextInput
            multiline={true}
            numberOfLines={5}
            maxLength={300}
            placeholder="Make it fun, catchy and clear - so the right people can join you. e.g. Hey meat lovers!
the k-bbq here is the best
in the area! If you're coming, please drink with us- the soju is"
            className="ml-10 mr-2 font-inter-regular h-52  text-justify"
            onChangeText={(text) => setNotes(text)}
          />
        </View>

        <View className="fixed bottom-20 flex w-full ">
        <TouchableOpacity 
        onPress={()=> addEvent()}
        className="justify-center self-center w-[95%] bg-primary p-4 rounded-full items-center">
            <Text className="text-white font-inter-bold text-xl">Create</Text>
        </TouchableOpacity>
      </View>
      </View>
      </ScrollView>

      <CustomModal
        key={"2"}
        height={"h-[70%]"}
        isVisible={tagsModelVisible}
        onClose={OnTagsModelClosed}
      >
        <TouchableOpacity
          onPress={() => setTagsModelVisible(false)}
          className="absolute right-5 top-10 w-16"
        >
          <Text className="font-inter-semiBold text-lg">Done</Text>
        </TouchableOpacity>
        <View className="flex p-5 gap-2">
          <FlatList
            data={tags}
            scrollEnabled={false}
            keyExtractor={(item) => item}
            numColumns={3}
            renderItem={({ item }) => <TagBadge tag={item} />}
          />
        </View>

        {/* <View className="flex-1 w-full h-[80%] items-center justify-evenly content-center">
          <Text>{getTagsByCategory("Sports")[0]}</Text>
        </View> */}
      </CustomModal>
    </SafeAreaView>
  );
}
