import React from 'react';
import { Button, StatusBar, StyleSheet, Text, View } from 'react-native';
import { createSwitchNavigator, createStackNavigator } from 'react-navigation';

import AuthHome from './screens/AuthHome';
import AuthScanner from './screens/AuthScanner';
import Testing from './screens/Testing';

let MainStack = createStackNavigator({
  Testing,
  Home: () => <View />,
});

let AuthStack = createStackNavigator(
  {
    AuthHome,
    AuthScanner,
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

export default createSwitchNavigator(
  {
    AuthStack,
    MainStack,
  },
  {
    initialRouteName: 'MainStack',
  }
);