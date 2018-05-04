import React from 'react';
import { Button, View } from 'react-native';
import { withUser, clearUser } from 'react-native-authentication-helpers';

class FeedScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {this.props.user.type === 'anonymous' ? (
          <Button title="Scan your ticket" onPress={this._handlePressSignIn} />
        ) : (
          <Button title="Sign out" onPress={this._handlePressSignOut} />
        )}
      </View>
    );
  }

  _handlePressSignIn = () => {
    this.props.navigation.navigate('AuthScanner');
  };

  _handlePressSignOut = () => {
    this.props.navigation.navigate('Auth');
    clearUser();
  };
}

export default withUser(FeedScreen);
