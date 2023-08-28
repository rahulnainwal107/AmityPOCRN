import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TextInput, Pressable} from 'react-native';

import {
  ChannelRepository,
  subscribeTopic,
  getChannelTopic,
} from '@amityco/ts-sdk';

const disposers: Amity.Unsubscriber[] = [];
const subscribedChannels: Amity.Channel['channelId'][] = [];

const subscribeChannels = (channels: Amity.Channel[]) =>
  channels.forEach(c => {
    if (!subscribedChannels.includes(c.channelId) && !c.isDeleted) {
      subscribedChannels.push(c.channelId);

      disposers.push(subscribeTopic(getChannelTopic(c)));
    }
  });
const PrivateChatList = ({navigation}) => {
  const [message, onChangeMessage] = useState('');
  const [channels, setChannels] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [channel, setChannel] = useState([]);

  const sendMessage = () => {};

  useEffect(() => {
    createChannel();
    /*
     * Possible params for liveChannels
     * displayName?: string;
     * membership?: 'all' | 'member' | 'notMember';
     * sortBy?: 'displayName' | 'firstCreated' | 'lastCreated';
     * types?: ['live', 'conversation', 'community', 'broadcast'];
     * isDeleted?: boolean;
     * tags?: ['tag1', 'tag2']
     * excludeTags?: ['tag3', 'tag4']
     * limit?: number
     * }
     */
    const unsubscribe = ChannelRepository.getChannels(
      {
        types: ['conversation'],
        membership: 'member',
        isDeleted: false,
        limit: 25,
      },
      ({data: channels, onNextPage, hasNextPage, loading, error}) => {
        console.log('channels ', channels);
        setChannels(channels);
        /*
         * this is only required if you want real time updates for each
         * channel in the collection
         */
        subscribeChannels(channels);
      },
    );

    /*
     * if you only wish to get a collection or list of paginated channel without
     * any real time updates you can unsubscribe immediately after you call the
     * collection.
     * ex: unsubscribe()
     */
    disposers.push(unsubscribe);

    return () => {
      disposers.forEach(fn => fn());
    };
  }, []);

  const createChannel = async () => {
    try {
      const newChannel = {
        //channelId: channelId,
        //avatarFileId: 'fileId',
        displayName: 'myCommunityChannel',
        tags: ['tag'],
        type: 'conversation' as Amity.ChannelType,
        userIds: ['12345'],
        metadata: {
          data: 'anything',
        },
      };

      const {data: channel} = await ChannelRepository.createChannel(newChannel);
      console.log('channel ', channel);
      setChannel(channel);
      console.log(
        ' channel?.defaultSubChannelId, ',
        channel?.defaultSubChannelId,
      );
    } catch (error) {
      console.log(JSON.stringify(error));
      if (error?.code === '400900') {
      }
    }
  };

  return (
    <FlatList
      data={channels}
      renderItem={({item, index}) => (
        <View>
          <Pressable onPress={() => navigation.navigate('PrivateChat', {item})}>
            <Text>{item?.channelId}</Text>
          </Pressable>
        </View>
      )}
      keyExtractor={(item, index) => String(index)}
    />
  );
};

export default PrivateChatList;
