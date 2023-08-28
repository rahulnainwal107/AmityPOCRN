import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import GroupChat from '../screens/GroupChat';
import PrivateChatList from '../screens/PrivateChatList';

const Tab = createMaterialTopTabNavigator();

const ChatScreenTabs = () => {
  return (
    <Tab.Navigator screenOptions={{lazy: true}}>
      <Tab.Screen name="GroupChat" component={GroupChat} />
      <Tab.Screen name="PrivateChatList" component={PrivateChatList} />
    </Tab.Navigator>
  );
};

export default ChatScreenTabs;
