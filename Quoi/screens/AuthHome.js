import React from 'react';
import { Button, Image, StatusBar, StyleSheet, Text, View } from 'react-native';

import fetchUserDataAsync from '../fetchUserDataAsync';
import Constants from '../Constants';

const EXAMPLE_TICKET_WIDTH = Constants.screen.width - 40;
const EXAMPLE_TICKET_HEIGHT = EXAMPLE_TICKET_WIDTH / 750 * 502;

// let userData = await fetchUserDataAsync(
//   'hhER9W5gFToFt4lfXyonLU6vyxAtinM0s996'
// );
// this.setState({ userData });

export default class AuthHome extends React.Component {
  state = {
    userData: null,
  };

  componentDidMount() {}

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
          <Image
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