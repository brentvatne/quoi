import React from 'react';
import { Button, StatusBar, StyleSheet, View } from 'react-native';
import { BarCodeScanner } from 'expo';
import { setUser } from 'react-native-authentication-helpers';
import fetchUserDataAsync from '../util/fetchUserDataAsync';

export default class AuthScannerScreen extends React.Component {
  state = {
    loading: false,
  };

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  _handleBarCodeRead = async result => {
    if (this.state.loading) {
      return;
    }

    this.setState({ loading: true });

    try {
      let ticketId = result.data;
      console.log({ ticketId });
      let userData = await fetchUserDataAsync(ticketId);
      console.log({ userData });

      if (userData) {
        setUser({ ...userData, ticketId });
        this.props.navigation.navigate('Main');
      } else {
        alert('No matching ticket found');
      }
    } catch (e) {
      alert('Something went wrong, oops');
    } finally {
      if (this._isMounted) {
        this.setState({ loading: false });
      }
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <BarCodeScanner
          onBarCodeRead={this._handleBarCodeRead}
          style={{ flex: 1 }}
        />

        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            top: null,
            bottom: 20,
            left: 15,
            alignItems: 'flex-start',
          }}>
          <Button
            color="#fff"
            title="Close"
            onPress={() => this.props.navigation.goBack()}
          />
        </View>

        <StatusBar hidden />
      </View>
    );
  }
}