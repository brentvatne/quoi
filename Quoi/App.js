import React from 'react';
import {
  ActivityIndicator,
  Button,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AppLoading } from 'expo';
import {
  NavigationActions,
  createSwitchNavigator,
  createStackNavigator,
} from 'react-navigation';
import {
  clearUser,
  withUser,
  loadUserAsync,
} from 'react-native-authentication-helpers';

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

class Loading extends React.Component {
  componentDidMount() {
    this._loadUserAsync();
  }

  _loadUserAsync = async () => {
    let user;
    try {
      user = await loadUserAsync();
    } catch (e) {}

    if (user) {
      this.props.navigation.navigate('MainStack');
    } else {
      this.props.navigation.navigate('AuthStack');
    }
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#eee" />
      </View>
    );
  }
}

export default createSwitchNavigator(
  {
    Loading,
    AuthStack,
    MainStack,
  },
  {
    initialRouteName: 'Loading',
  }
);
