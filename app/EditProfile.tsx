import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import CustomModal from "@/components/CustomModal";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import { Categories } from "@/constants/Categories";
import TagList from "@/components/TagList";
import { categoriesAndTags } from "@/constants/tags";
import * as ImagePicker from "expo-image-picker";

// Helper function for validation
const validateForm = (formData) => {
  const errors = {};

  if (!formData.fullName.trim()) errors.fullName = "Full Name is required";
  if (!formData.username.trim() || !/^[a-zA-Z0-9]+$/.test(formData.username))
    errors.username = "Username is required and must be alphanumeric";
  //   if (!formData.aboutMe.trim())
  //     errors.aboutMe = "About Me must be at least 3 lines";

  return errors;
};

export const EditProfile = ({ navigation }) => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    aboutMe: "",
    birthdate: "",
    interests: "",
    gender: "",
    jobTitle: "",
    company: "",
    school: "",
  });

  const [errors, setErrors] = useState({});
  const { user, updateUserData, refreshUserData } = useUser();

  // Handle field changes
  const handleChange = (field, value) => {
    console.log(field, value);
    setFormData({
      ...formData,
      [field]: value,
    });

    updateUserData(field, value);
  };

  useEffect(() => {
    refreshUserData();
  }, []);

  useEffect(() => {
    if (user !== undefined) {
      if (formData.fullName && formData.fullName === "")
        handleForm("fullName", user.fullName);
      if (formData.username === "")
        handleForm(
          "username",
          user.username === undefined ? "" : user.username
        );
      if (formData.aboutMe === "")
        handleForm("aboutme", user.aboutMe === undefined ? "" : user.aboutMe);
      if (formData.interests === "") setSelectedTags(user.interests);
    }
  }, [user]);

  useEffect(() => {
    console.log("form", formData);
  }, [formData]);

  const handleForm = (field, value) => {
    console.log("handleForm", field, value);
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSave = async () => {
    // Validate the form data
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    let body = {};
    body["fullName"] = formData.fullName;
    body["username"] = formData.username;
    body["aboutMe"] = formData.aboutMe;
    console.log(body);
    const response = await axios.put(
      "http://localhost:3000/api/users/update",
      body
    );
    console.log("update", response.data);
  };

  const inputStyle = `p-5 bg-white`;
  const inputLabel = `font-inter-semiBold`;
  const inputContainer = `gap-2`;

  const [birthdayModalVisible, setBirthDayModalVisible] = useState(false);
  const [genderPickerModalVisible, setGenderPickerModalVisible] =
    useState(false);
  const [selectedGender, setSelectedGender] = useState("");

  const [interestModalVisible, setInterestModalVisible] = useState(false);

  const [selectedTags, setSelectedTags] = useState([]);
  console.log(selectedTags);
  const handleTagsSelect = (newTag: string) => {
    let temp = selectedTags;
    const index = temp.indexOf(newTag);
    if (index > -1) {
      temp.splice(index, 1);
      setSelectedTags(temp);
    } else {
      setSelectedTags([...selectedTags, newTag]);
    }
  };

  const TagBadge = (tag: any) => {
    tag = tag.tag;
    const selectedTag = selectedTags.find((ele) => ele == tag);
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
      <TouchableOpacity className={`m-1 p-2 bg-gray-100 rounded-full`}>
        <Text className="text-xs font-inter-regular">{tag}</Text>
      </TouchableOpacity>
    );
  };

  const SaveTags = () => {
    if (selectedTags == user.interests) {
      console.log("same only");
    } else {
      updateUserData("interests", selectedTags);
    }

    setInterestModalVisible(false);
  };

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
      SaveImage(result.assets[0]);
    }
  };

  const [image, setImage] = useState<string | null>(null);
  const SaveImage = async (asset) => {
    console.log("Save image");
    console.log("image", image);
    const form = new FormData();
    form.append('profile', {
        uri: asset.uri,
        type: asset.type,
        name: asset.filename || "profile.jpg",
    });


    try {
        const response = await axios.post('http://localhost:3000/api/users/uploadProfilePicture', form, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        console.log('response', response.data)
        if (response.data) {
        }
        router.navigate("/profile");

    } catch (error) {
        console.error(error);
    }
  };

  return (
    <SafeAreaView>
      <View className="p-5">
        {/* Header */}

        <View className="flex-row justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={25} />
          </TouchableOpacity>

          <Text className="font-inter-semiBold">Edit Profile</Text>

          <TouchableOpacity onPress={handleSave}>
            <Text className="font-inter-semiBold">Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ marginBottom: 20 }}>
          <View className="flex-col gap-5">
            {/* Edit Image */}

            <TouchableOpacity
              onPress={() => pickImage()}
              className="flex justify-center items-center pt-5"
            >
              <Image
                className="w-20 h-20"
                source={
                  user.profilePicture
                    ? {uri : user.profilePicture}
                    : require("../assets/images/Icons/bar.png")
                }
              />
            </TouchableOpacity>

            <View className={inputContainer}>
              <Text className={inputLabel}>Full Name</Text>
              <TextInput
                className={inputStyle}
                defaultValue={user.fullName === "" ? "" : user.fullName}
                onChangeText={(text) => handleForm("fullName", text)}
                placeholder="Full Name"
              />
              {errors.fullName && (
                <Text style={styles.error}>{errors.fullName}</Text>
              )}
            </View>

            <View className={inputContainer}>
              <Text className={inputLabel}>Username</Text>
              <TextInput
                className={inputStyle}
                defaultValue={user.username}
                placeholder="username123"
                onChangeText={(text) => handleForm("username", text)}
              />
              {errors.username && (
                <Text style={styles.error}>{errors.username}</Text>
              )}
            </View>

            <View className={inputContainer}>
              <Text className={inputLabel}>About Me</Text>
              <TextInput
                className={inputStyle + ` h-36`}
                defaultValue={user.aboutMe}
                onChangeText={(text) => handleForm("aboutMe", text)}
                multiline
                placeholder="A design student"
              />
              {errors.aboutMe && (
                <Text style={styles.error}>{errors.aboutMe}</Text>
              )}
            </View>

            <View className={inputContainer}>
              <Text className={inputLabel}>Birthdate</Text>
              <TouchableOpacity
                onPress={() => setBirthDayModalVisible(true)}
                className={inputStyle + ` flex-row justify-between`}
              >
                <Text>{moment(user.birthdate).format("DD MMM YYYY")}</Text>
                <Text className="items-end">
                  {"Age : " + moment(user.birthdate).diff(moment(), "years")}
                </Text>
              </TouchableOpacity>
              {errors.birthdate && (
                <Text style={styles.error}>{errors.birthdate}</Text>
              )}

              <DateTimePickerModal
                isVisible={birthdayModalVisible}
                date={
                  user.birthdate === "" ? new Date() : new Date(user.birthdate)
                }
                mode="date"
                onConfirm={(text) => {
                  handleChange("birthdate", text);
                  setBirthDayModalVisible(false);
                }}
                onCancel={() => setBirthDayModalVisible(false)}
              />
            </View>

            <View className={inputContainer}>
              <Text className={inputLabel}>Interests</Text>
              <TouchableOpacity
                className={inputStyle}
                onPress={() => setInterestModalVisible(true)}
              >
                <View>
                  <FlatList
                    data={user.interests}
                    scrollEnabled={false}
                    keyExtractor={(item) => item}
                    numColumns={3}
                    renderItem={({ item }) => <TagBadge tag={item} />}
                  />
                </View>
              </TouchableOpacity>

              <CustomModal
                height="h-[70%]"
                isVisible={interestModalVisible}
                onClose={() => console.log("Close")}
              >
                <View className="absolute bottom-10 flex w-full z-10">
                  <TouchableOpacity
                    disabled={selectedTags && selectedTags.length === 0}
                    onPress={() => SaveTags()}
                    className={` ${
                      selectedTags && selectedTags.length === 0
                        ? "opacity-50"
                        : ""
                    } justify-center self-center w-[95%] bg-primary p-4 rounded-full items-center`}
                  >
                    <Text className="text-white font-inter-bold text-xl">
                      Add
                    </Text>
                  </TouchableOpacity>
                </View>
                <ScrollView>
                  <View className="p-5 gap-2">
                    <Text className="font-inter-semiBold text-lg">
                      Tell us what you like to do
                    </Text>
                    <Text className="font-inter-regular text-gray-400">
                      We'll recommend events based on your interests! Select at
                      least 5 items.
                    </Text>

                    {categoriesAndTags.map((item, index) => (
                      <View className="mt-2">
                        <Text className="font-inter-semiBold">
                          {item.category}
                        </Text>
                        <FlatList
                          data={item.tags}
                          scrollEnabled={false}
                          keyExtractor={(item) => item}
                          numColumns={3}
                          renderItem={({ item }) => <ViewTagBadge tag={item} />}
                        />
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </CustomModal>
            </View>

            <View className={inputContainer}>
              <Text className={inputLabel}>Gender</Text>
              <TouchableOpacity
                onPress={() => setGenderPickerModalVisible(true)}
                className={inputStyle}
              >
                <Text className="font-inter-regular capitalize">
                  {user.gender}
                </Text>
              </TouchableOpacity>

              <CustomModal
                height="h-[40%]"
                isVisible={genderPickerModalVisible}
                onClose={() => setGenderPickerModalVisible(false)}
              >
                <TouchableOpacity
                  className="absolute top-8 right-8"
                  onPress={() => {
                    handleChange("gender", selectedGender);
                    setGenderPickerModalVisible(false);
                  }}
                >
                  <Text className="text-xl font-inter-semiBold">Done</Text>
                </TouchableOpacity>

                <Picker
                  style={{ paddingTop: 10 }}
                  selectedValue={selectedGender}
                  className={inputStyle}
                  onValueChange={(text) => setSelectedGender(text)}
                >
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
                {errors.gender && (
                  <Text style={styles.error}>{errors.gender}</Text>
                )}
              </CustomModal>
            </View>

            <View className={inputContainer}>
              <Text className={inputLabel}>Job Title</Text>
              <TextInput
                className={inputStyle}
                value={formData.jobTitle}
                onChangeText={(text) => handleChange("jobTitle", text)}
              />
              {errors.jobTitle && (
                <Text style={styles.error}>{errors.jobTitle}</Text>
              )}
            </View>

            <View className={inputContainer}>
              <Text className={inputLabel}>Company</Text>
              <TextInput
                className={inputStyle}
                value={formData.company}
                onChangeText={(text) => handleChange("company", text)}
              />
              {errors.company && (
                <Text style={styles.error}>{errors.company}</Text>
              )}
            </View>

            <View className={inputContainer}>
              <Text className={inputLabel}>School</Text>
              <TextInput
                className={inputStyle}
                value={formData.school}
                onChangeText={(text) => handleChange("school", text)}
              />
              {errors.school && (
                <Text style={styles.error}>{errors.school}</Text>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});

export default EditProfile;
