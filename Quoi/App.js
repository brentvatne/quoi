import React from 'react';
import { AppLoading } from 'expo';
import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import { ApolloProvider } from 'react-apollo';
import AppSyncClient from './AppSyncClient';

import AuthHomeScreen from './screens/AuthHomeScreen';
import AuthScannerScreen from './screens/AuthScannerScreen';
import TestingScreen from './screens/TestingScreen';
import FeedScreen from './screens/FeedScreen';
import LoadingScreen from './screens/LoadingScreen';

let MainStack = createStackNavigator(
  {
    Testing: TestingScreen,
    Feed: FeedScreen,
    AuthScanner: AuthScannerScreen,
  },
  {
    initialRouteName: 'Feed',
    mode: 'modal',
  }
);

let AuthStack = createStackNavigator(
  {
    AuthHome: AuthHomeScreen,
    AuthScanner: AuthScannerScreen,
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

let AppNavigator = createSwitchNavigator(
  {
    Loading: LoadingScreen,
    Auth: AuthStack,
    Main: MainStack,
  },
  {
    initialRouteName: 'Loading',
  }
);

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={AppSyncClient}>
        <AppNavigator />
      </ApolloProvider>
    );
  }
}
