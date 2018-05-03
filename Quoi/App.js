import React from 'react';
import { AppLoading } from 'expo';
import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import { ApolloProvider } from 'react-apollo';
import AppSyncClient from './AppSyncClient';

import AuthHomeScreen from './screens/AuthHomeScreen';
import AuthScannerScreen from './screens/AuthScannerScreen';
import EditPostScreen from './screens/EditPostScreen';
import FeedScreen from './screens/FeedScreen';
import LoadingScreen from './screens/LoadingScreen';

let EditPostStack = createStackNavigator(
  {
    EditPost: EditPostScreen,
  },
  {
    initialRouteName: 'EditPost',
    cardStyle: {
      backgroundColor: '#fff',
    },
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#fff',
      },
    },
  }
);

EditPostStack.navigationOptions = {
  header: null,
  gesturesEnabled: false,
};

let MainStack = createStackNavigator(
  {
    Feed: FeedScreen,
    AuthScanner: AuthScannerScreen,
    EditPostStack: EditPostStack,
  },
  {
    initialRouteName: 'Feed',
    mode: 'modal',
    cardStyle: {
      backgroundColor: '#fff',
    },
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#fff',
      },
    },
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
