import React from 'react';
import { Button, View } from 'react-native';
import { clearUser } from 'react-native-authentication-helpers';

export default class FeedScreen extends React.Component {
  render() {
    return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button title="Sign out" onPress={this._handlePressSignOut} />
    </View>
    );
  }

  _handlePressSignOut = () => {
    this.props.navigation.navigate('Auth');
    clearUser();
  }
}
