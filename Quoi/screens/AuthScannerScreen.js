import React from 'react';
import {
  ActivityIndicator,
  Button,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { BarCodeScanner } from 'expo';
import { setUser } from 'react-native-authentication-helpers';
import { SafeAreaView } from 'react-navigation';

import fetchUserDataAsync from '../util/fetchUserDataAsync';

export default class AuthScannerScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

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
      let userData = await fetchUserDataAsync(ticketId);
      if (!this._isMounted) {
        return;
      }
      if (userData) {
        setUser({ ...userData, ticketId });
        this.props.navigation.navigate('Feed');
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

        {this._maybeRenderLoading()}
        {this._maybeRenderCloseButton()}

        <StatusBar hidden />
      </View>
    );
  }

  _maybeRenderCloseButton = () => {
    if (Platform.OS !== 'ios') {
      return;
    }

    return (
      <SafeAreaView
        forceInset={{ top: 'never', bottom: 'always' }}
        style={{
          ...StyleSheet.absoluteFillObject,
          top: null,
          bottom: 0,
          left: 15,
          alignItems: 'flex-start',
        }}>
        <Button
          color="#fff"
          title="Close"
          onPress={() => this.props.navigation.goBack()}
        />
      </SafeAreaView>
    );
  };

  _maybeRenderLoading = () => {
    if (!this.state.loading) {
      return;
    }

    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.2)',
          },
        ]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  };
}
