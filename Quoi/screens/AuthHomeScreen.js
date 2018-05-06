import React from 'react';
import {
  Image,
  StatusBar,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { setUser } from 'react-native-authentication-helpers';

import Button from '../components/Button';
import CachedImage from '../components/CachedImage';
import Constants from '../util/Constants';

const EXAMPLE_TICKET_MARGIN = 80;
const EXAMPLE_TICKET_WIDTH = Constants.screen.width - EXAMPLE_TICKET_MARGIN;
const EXAMPLE_TICKET_HEIGHT = EXAMPLE_TICKET_WIDTH / 750 * 502;

export default class AuthHomeScreen extends React.Component {
  render() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Quoi</Text>
        <Text style={styles.subtitle}>
          Share photos of what's going on at React Europe. Scan your ticket to
          post, or just browse anonymously.
        </Text>
        <View
          style={{
            marginTop: 20,
            marginBottom: 20,
            padding: 10,
            borderWidth: 1,
            borderColor: '#eee',
            shadowColor: '#eee',
            elevation: 2,
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
          withBorder
          title="Scan your ticket"
          onPress={() => this.props.navigation.navigate('AuthScanner')}
          containerStyle={{
            marginBottom: 15,
            marginTop: 0,
            backgroundColor: '#eee',
            padding: 15,
            borderRadius: 5,
            overflow: 'hidden',
          }}
        />

        <Button
          withBorder
          title="Browse anonymously"
          style={{
            backgroundColor: '#eee',
            padding: 15,
            borderRadius: 5,
            overflow: 'hidden',
          }}
          onPress={this._handlePressBrowseAnonymously}
        />

        <Button
          title="Terms of service"
          onPress={this._handlePressTerms}
          style={{ fontSize: 15, marginTop: 25, color: '#888' }}
        />
        <StatusBar barStyle="default" />
      </ScrollView>
    );
  }

  _handlePressBrowseAnonymously = () => {
    setUser({ type: 'anonymous' });
    this.props.navigation.navigate('Main');
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 55,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 45,
    fontFamily: 'Wellfleet',
  },
  subtitle: {
    color: 'rgba(0,0,0,0.8)',
    marginTop: 9,
    marginHorizontal: 15,
    marginBottom: 7,
    fontSize: 16,
    textAlign: 'center',
  },
});
