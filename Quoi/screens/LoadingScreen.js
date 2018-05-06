import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Font, Icon } from 'expo';
import {
  clearUser,
  withUser,
  loadUserAsync,
} from 'react-native-authentication-helpers';

export default class LoadingScreen extends React.Component {
  async componentDidMount() {
    clearUser();
    await this._loadAssetsAsync();
    await this._loadUserAsync();
  }

  _loadAssetsAsync = async () => {
    await Font.loadAsync({
      ...Icon.Ionicons.font,
      Wellfleet: require('../assets/Wellfleet-Regular.ttf'),
    });
  };

  _loadUserAsync = async () => {
    let user;
    try {
      user = await loadUserAsync();
    } catch (e) {}

    if (user) {
      this.props.navigation.navigate('Main');
    } else {
      this.props.navigation.navigate('Auth');
    }
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }
}
