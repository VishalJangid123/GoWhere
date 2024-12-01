import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@/context/AuthContext";
import { fetchEvents } from "../../../eventSlice";
import CustomModal from "@/components/CustomModal";
import { Feather, SimpleLineIcons } from "@expo/vector-icons";
import Avatar from "@/components/Avatar";
import { useRouter } from "expo-router";
import { useUser } from "@/context/UserContext";

export default function Map() {
  const [region, setRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const dispatch = useDispatch();
  const { events, status, error, lastUpdated } = useSelector(
    (state: any) => state.events
  );
  const { authState } = useAuth();

  useEffect(() => {
    if (authState?.authenticated === true) {
      dispatch(fetchEvents());
    }
  }, [dispatch, authState]);

  const onLocationPress = (location) => {
    console.log("location press");
    setRegion({
      latitude: location.coordinates[0],
      longitude: location.coordinates[1],
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  const getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      setErrorMsg("Unable to fetch location");
    }
  };

  useEffect(() => {
    getLocationAsync();
  }, []);

  const [eventListVisible, setEventListVisible] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  var mapRef = useRef(null);

  const animateToLocation = (latitude, longitude) => {
    console.log("lat", latitude);
    console.log("long", longitude);
    const newRegion = {
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };

    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 1000);
    }

    setRegion(newRegion);
  };

  return (
    <View style={styles.container}>
      <View className="flex-1">
        <CustomModal
          isVisible={eventListVisible}
          height="h-[40%]"
          onClose={() => setEventListVisible(false)}
        >
          <View>
            <FlatList
              data={events}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="flex-row items-center gap-5"
                  style={styles.listItem}
                  onPress={() => {
                    setEventListVisible(false);
                    animateToLocation(
                      item.location.coordinates[1],
                      item.location.coordinates[0]
                    );
                    onLocationPress(item.location);
                  }}
                >
                  <Text className="font-inter-semiBold" style={styles.listText}>
                    {item.name}
                  </Text>
                  <View>
                    {item.attendees &&
                      item.attendees.map((entry, index) => (
                        <View>
                          <Avatar
                            size={10}
                            title={entry.fullName}
                            imageUrl={entry.profile}
                          />
                        </View>
                      ))}
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </CustomModal>

        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={true}
          zoomControlEnabled={true}
          onRegionChangeComplete={(region) => setRegion(region)}
          ref={mapRef}
        >
          {events &&
            events.map((item) => (
              <Marker
                key={item._id}
                coordinate={{
                  latitude: item.location.coordinates[1],
                  longitude: item.location.coordinates[0],
                }}
                title={item.name}
                onPress={() =>
                  router.push({ pathname: "/EventDetails", params: item })
                }
              >
                <Image
                  className="rounded-full"
                  source={
                    item.images && item.images[0]
                      ? { uri: item.images[0] }
                      : require("../../../assets/images/Icons/bar.png")
                  }
                  style={styles.customMarker}
                />
              </Marker>
            ))}
        </MapView>
      </View>
      <View className="w-full fixed bottom-32 right-10 items-end">
        <TouchableOpacity
          onPress={() => setEventListVisible(true)}
          className="w-14 h-14 rounded-full justify-center items-center bg-white items-end"
        >
          <Feather name="list" size={25} />
        </TouchableOpacity>
      </View>

      <View className="w-full absolute mt-20 bg-transparent items-end flex-row justify-end min-h-96">
        <View className="flex-row pr-10">
          <TouchableOpacity onPress={() => router.push("/profile")}>
            {user.profilePicture !== "" ? (
              <Image
                className="w-10 h-10 inline-block size-8 rounded-full ring-2 ring-white"
                source={{ uri: user.profilePicture }}
              />
            ) : (
              <SimpleLineIcons name="user" size={25} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  customMarker: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  container: {
    flex: 1,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  listText: {
    fontSize: 16,
  },
  map: {
    flex: 1,
  },
});
