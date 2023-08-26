import React from 'react';
import {View, Text, FlatList} from 'react-native';

const PrivateChatList = () => {
  return (
    <FlatList
      data={[]}
      renderItem={({item, index}) => (
        <View>
          <Text>Hello</Text>
        </View>
      )}
      keyExtractor={(item, index) => String(index)}
    />
  );
};

export default PrivateChatList;
