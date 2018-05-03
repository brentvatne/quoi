import React from 'react';
import { Button, StatusBar, StyleSheet, View } from 'react-native';
import { BarCodeScanner } from 'expo';

export default class AuthScanner extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <BarCodeScanner style={{ flex: 1 }} />
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
