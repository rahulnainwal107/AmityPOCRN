import React, {useState} from 'react';
import {View, TextInput, Pressable, Text} from 'react-native';

const MainScreen = ({navigation}) => {
  const [username, onChangeUsername] = useState('');
  const [userId, onChangeUserId] = useState('');

  const navigateToChatScreen = () => {
    navigation.navigate('ChatScreenTabs');
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', paddingHorizontal: 20}}>
      <TextInput
        style={{
          height: 40,
          margin: 12,
          borderWidth: 1,
          padding: 10,
          borderRadius: 5,
        }}
        onChangeText={onChangeUsername}
        value={username}
        placeholder="Enter user name"
      />
      <TextInput
        style={{
          height: 40,
          margin: 12,
          borderWidth: 1,
          padding: 10,
          borderRadius: 5,
        }}
        onChangeText={onChangeUserId}
        value={userId}
        placeholder="Enter user id"
      />
      <Pressable
        style={{
          height: 40,
          margin: 12,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'green',
          borderRadius: 5,
        }}
        onPress={navigateToChatScreen}>
        <Text
          style={{
            color: 'white',
            fontSize: 14,
            letterSpacing: 1,
            fontWeight: '500',
          }}>
          Create Profile
        </Text>
      </Pressable>
    </View>
  );
};

export default MainScreen;
