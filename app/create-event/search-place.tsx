import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEvent } from "@/context/EventContext";

export default function SearchPlace({setDroppedPin}) {
  const [searchResults, setSearchResults] = useState([]);
  const [searchText, setSearchText] = useState("");

  const { eventData, updateEventData} = useEvent(); 
  // Debounce search query to avoid excessive API calls
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      handleSearch(searchText);
    }, 500); // Delay 500ms after typing

    return () => clearTimeout(delaySearch);
  }, [searchText]);

  const handleSearch = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=geocodejson&q=${query + ' thailand'}&addressdetails=1&limit=5`
      );
      let data = await response.json();
      console.log(data.features)
      data = data.features;
      if (data && data.length > 0) {
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error fetching search results");
    }
  };

  const handleLocationSelect = (location) => {
    console.log(location)
    if(location === undefined)
    {
        router.back();
        return;
    }
    
    const { display_name , name, street, district, city, state } = location.properties.geocoding;
    ;
    const selectedLoc = {
      latitude: parseFloat(location.geometry.coordinates[0]),
      longitude: parseFloat(location.geometry.coordinates[1]),
      name: display_name ? display_name : name,
      street : street,
      district: district,
      province: city ? city : state
    };

    updateEventData({location : selectedLoc})
    router.back();
    // setDroppedPin(selectedLoc)
    // router.replace({ pathname: '/CreateNewEvent', params: selectedLoc})
    // router.setParams(selectedLoc);
    // setSelectedLocation(selectedLoc);
    // setMapRegion({
    //   latitude: selectedLoc.latitude,
    //   longitude: selectedLoc.longitude,
    //   latitudeDelta: 0.0922,
    //   longitudeDelta: 0.0421,
    // });

    // Optionally, call parent component's onLocationSelect
    // onLocationSelect(selectedLoc);

    setSearchText('');  // Clear search text after selecting a location
    setSearchResults([]);  // Clear results
  };

  return (
    <SafeAreaView>
      <View className="p-5 flex-row gap-5 items-center justify-start">
        <TouchableOpacity onPress={()=> handleLocationSelect(searchResults[0])}>
          <Feather name="arrow-left" size={25} />
        </TouchableOpacity>
        <TextInput
          placeholder="Search place"
          className="font-inter-semiBold text-lg"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.properties.geocoding.place_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleLocationSelect(item)}>
              <View style={styles.resultItem}>
                <Text 
                className="font-inter-semiBold"
                style={styles.resultText}>{item.properties.geocoding.name}</Text>
                <Text 
                className="font-inter-regular text-base text-gray-400 mt-3"
                style={styles.resultText}>
                  {item.properties.geocoding.district ? item.properties.geocoding.district + "," : ""}
                  { item.properties.geocoding.city ? item.properties.geocoding.city : item.properties.geocoding.state}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    fontSize: 16,
  },
  map: {
    width: "100%",
    height: 400,
    marginTop: 20,
  },
  resultItem: {
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  resultText: {
    fontSize: 16,
  },
});
