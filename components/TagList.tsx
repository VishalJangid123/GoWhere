import { View, Text, FlatList } from "react-native";
import React from "react";

export default function TagList(tags: any) {
  let allTags = tags["tags"]
  const Tag = (tag : any) => {
    return (
          <View className={`m-1 p-2 bg-gray-100 rounded-full`}>
        <Text className="text-xs font-inter-regular">{tag.tag}</Text>
      </View>
    );
  };

  return (
    <FlatList data={allTags} horizontal showsHorizontalScrollIndicator={false}
    ListEmptyComponent={<Text>NO</Text>}
    renderItem={({ item}) => ( <Tag tag={item} /> )} />
  );
}
