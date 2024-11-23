import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const CustomTabBar = ({ tabs, selectedTab, onSelectTab }) => {
  const [tabUnderlinePosition] = useState(new Animated.Value(0));

  const handleTabPress = (index) => {
    // Move the underline indicator to the selected tab
    Animated.spring(tabUnderlinePosition, {
      toValue: index,
      useNativeDriver: false,
    }).start();

    // Call the callback function passed as a prop
    onSelectTab(index);
  };

  return (
    <View style={styles.tabContainer}>
      <View style={styles.tabs}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tabButton,
              index === selectedTab ? styles.activeTabButton : null,
            ]}
            onPress={() => handleTabPress(index)}
          >
            <Text
              style={[
                styles.tabLabel,
                index === selectedTab ? styles.activeTabLabel : null,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab indicator animation */}
      <Animated.View
        style={[
          styles.tabIndicator,
          {
            transform: [
              {
                translateX: tabUnderlinePosition.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: [0, 120, 240], // Adjust the output range based on number of tabs
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    width: '100%',
    paddingVertical: 2,
   
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    position: 'relative',
      alignItems: 'center',
    alignContent: 'center'
  },
  tabButton: {
    padding: 10,
   
  },
  activeTabButton: {
    borderBottomWidth: 0,
    borderBottomColor: '#000',
  },
  tabLabel: {
    fontSize: 16,
    color: '#757575',
  },
  activeTabLabel: {
    color: '#000',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: 120, // Set width of indicator
    backgroundColor: '#000', // Indicator color
  },
});

export default CustomTabBar;
