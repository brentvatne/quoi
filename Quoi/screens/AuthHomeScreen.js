import React from 'react';
import { Button, Image, StatusBar, StyleSheet, Text, View } from 'react-native';

import CachedImage from '../components/CachedImage';
import Constants from '../util/Constants';

const EXAMPLE_TICKET_WIDTH = Constants.screen.width - 40;
const EXAMPLE_TICKET_HEIGHT = EXAMPLE_TICKET_WIDTH / 750 * 502;

export default class AuthHomeScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Quoi</Text>
        <Text style={styles.subtitle}>
          Share photos of what's going on at React Europe 2018
        </Text>
        <View
          style={{
            marginTop: 20,
            marginBottom: 20,
            padding: 10,
            borderWidth: 1,
            borderColor: '#eee',
            shadowColor: '#eee',
            elevation: 3,
            shadowOffset: { x: 0, y: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 5,
            backgroundColor: '#fff',
          }}>
          <CachedImage
            source={require('../assets/ticket.png')}
            style={{
              width: EXAMPLE_TICKET_WIDTH,
              height: EXAMPLE_TICKET_HEIGHT,
            }}
          />
        </View>
        <Button
          title="Scan ticket"
          onPress={() => this.props.navigation.navigate('AuthScanner')}
        />

        <Button
          title="Browse anonymously"
          onPress={() => this.props.navigation.navigate('Main')}
        />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'rgba(0,0,0,0.8)',
    marginTop: 5,
    fontSize: 15,
    textAlign: 'center',
  }
});