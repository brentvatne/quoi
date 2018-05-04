import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import {
  clearUser,
  withUser,
  loadUserAsync,
} from 'react-native-authentication-helpers';

export default class LoadingScreen extends React.Component {
  componentDidMount() {
    this._loadUserAsync(); }

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
        <ActivityIndicator size="large" color="#eee" />
      </View>
    );
  }
}
