import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TextInput, Pressable} from 'react-native';

import {
  ChannelRepository,
  subscribeTopic,
  getChannelTopic,
  getSubChannelTopic,
  MessageRepository,
  SubChannelRepository,
} from '@amityco/ts-sdk';

const disposers: Amity.Unsubscriber[] = [];
const subscribedChannels: Amity.Channel['channelId'][] = [];
const subChannelDisposers: Amity.Unsubscriber[] = [];

const subscribeSubChannel = (subChannel: Amity.SubChannel) =>
  subChannelDisposers.push(subscribeTopic(getSubChannelTopic(subChannel)));

const subscribeChannels = (channels: Amity.Channel[]) =>
  channels.forEach(async c => {
    if (!subscribedChannels.includes(c.defaultSubChannelId) && !c.isDeleted) {
      subscribedChannels.push(c.defaultSubChannelId);

      disposers.push(subscribeTopic(getChannelTopic(c)));
      const subChannelRepository = await SubChannelRepository.getSubChannel(
        c?.defaultSubChannelId,
        ({data: subChannel, loading, error}) => {
          if (subChannel) observeMessage(subChannel);
        },
      );
    }
  });

const observeMessage = channel => {
  console.log('observeMessage subChannelId  ', channel);
  // observeMessages(channelId, result => {
  //   runQuery(query, result => {
  //     if (result.data != undefined) {
  //       messageArray = [];
  //       for (let data of result.data) {
  //         messageArray.push({
  //           _id: data?.messageId,
  //           text: data.data['text'],
  //           createdAt: new Date(),
  //           user: {
  //             _id: data?.userId,
  //             name: data?.userId,
  //             avatar: 'https://placeimg.com/140/140/any',
  //           },
  //         });
  //       }
  //     }
  //     messageArray.reverse();

  //     console.log('messageArray ', messageArray);
  //   });
  // });

  const unsubscribe = MessageRepository.getMessages(
    {subChannelId: channel?.subChannelId},
    ({data: messages, onNextPage, hasNextPage, loading, error}) => {
      console.log('messages ', messages);
      //setMessages(messages);
      //setMessages(messages);
      /*
       * this is only required if you want real time updates for messages
       * in the collection
       *
       */
      subscribeSubChannel(channel as Amity.SubChannel);
    },
  );

  /*
   * if you only wish to get a collection or list of paginated messages without
   * any real time updates you can unsubscribe immediately after you call the
   * collection.
   * ex: unsubscribe()
   */
  subChannelDisposers.push(unsubscribe);
};

const PrivateChatList = ({navigation, userInfo = {}}) => {
  const {userId, username, chatWithUserId} = userInfo;
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
      subChannelDisposers.forEach(fn => fn());
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
        userIds: [chatWithUserId],
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
          <Pressable
            onPress={() => navigation.navigate('PrivateChat', {item, userId})}
            style={{paddingHorizontal: 20, marginVertical: 10}}>
            <Text>{item?.channelId}</Text>
          </Pressable>
        </View>
      )}
      keyExtractor={(item, index) => String(index)}
    />
  );
};

export default PrivateChatList;
