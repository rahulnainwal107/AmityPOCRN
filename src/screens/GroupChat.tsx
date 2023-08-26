import React, {useState} from 'react';
import {View, Text, FlatList, TextInput, Pressable} from 'react-native';

const GroupChat = () => {
  const [message, onChangeMessage] = useState('');

  const sendMessage = () => {};

  return (
    <View style={{flex: 1, paddingHorizontal: 20}}>
      <View style={{flex: 1, marginTop: 12}}>
        <FlatList
          data={[]}
          renderItem={({item, index}) => (
            <View>
              <Text>Hello</Text>
            </View>
          )}
          keyExtractor={(item, index) => String(index)}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 12,
        }}>
        <TextInput
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            padding: 10,
            borderRadius: 5,
          }}
          onChangeText={onChangeMessage}
          value={message}
          placeholder="Message ........."
        />
        <Pressable
          style={{
            height: 40,
            marginLeft: 12,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'green',
            borderRadius: 5,
            paddingHorizontal: 10,
          }}
          onPress={sendMessage}>
          <Text
            style={{
              color: 'white',
              fontSize: 14,
              letterSpacing: 1,
              fontWeight: '500',
            }}>
            Send
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default GroupChat;
