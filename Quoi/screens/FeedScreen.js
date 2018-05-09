import React from 'react';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { Ionicons } from 'react-native-vector-icons';
import { withUser, clearUser } from 'react-native-authentication-helpers';
import { Permissions, ImagePicker, ImageManipulator } from 'expo';
import { compose, graphql } from 'react-apollo';
import { withNavigationFocus, withNavigation } from 'react-navigation';
import gql from 'graphql-tag';

import Button from '../components/Button';
import Feed from '../components/Feed';
import GravatarImage from '../components/GravatarImage';
import uploadImageAsync from '../util/uploadImageAsync';

class ProfileHeaderButton extends React.Component {
  render() {
    if (!this.props.user || this.props.user.type === 'anonymous') {
      // render other thing here
      return null;
    }

    return (
      <BorderlessButton
        onPress={this._handlePress}
        style={{ paddingHorizontal: 12 }}>
        <GravatarImage
          style={{ width: 30, height: 30, borderRadius: 15 }}
          email={this.props.user.email}
        />
      </BorderlessButton>
    );
  }

  _handlePress = () => {
    Alert.alert(
      `You are currently signed in as ${this.props.user.firstName} ${
        this.props.user.lastName
      }`,
      'This information is made available by querying the React Europe GraphQL API with your ticket QR code.',
      [
        { text: 'OK', onPress: () => {}, style: 'cancel' },
        {
          text: 'Sign out',
          onPress: () => {
            clearUser();
            this.props.navigation.navigate('Auth');
          },
        },
      ],
      { cancelable: false }
    );
  };
}

const ProfileHeaderButtonContainer = compose(withNavigation, withUser)(
  ProfileHeaderButton
);

class FeedScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Quoi',
    headerTitleStyle: {
      fontSize: 20,
      fontFamily: 'Wellfleet',
    },
    headerRight: <ProfileHeaderButtonContainer />,
  });

  render() {
    let posts = this.props.data.listPosts
      ? this.props.data.listPosts.items
      : [];

    return (
      <View style={{ flex: 1 }}>
        <Feed
          posts={posts}
          isVisible={this.props.isFocused}
          refreshAsync={this.props.data.refetch}
        />

        {this._renderControls()}
      </View>
    );
  }

  _renderControls = () => {
    return (
      <View style={styles.controlsContainer}>
        <BorderlessButton
          onPress={this._handlePressPicker}
          style={styles.controlButton}>
          <Ionicons
            name="ios-photos-outline"
            size={40}
            style={styles.controlIcon}
          />
        </BorderlessButton>
        <BorderlessButton
          onPress={this._handlePressCamera}
          style={styles.controlButton}>
          <Ionicons
            name="ios-camera-outline"
            size={50}
            style={styles.controlIcon}
          />
        </BorderlessButton>
      </View>
    );
  };

  _requestPermissionsAsync = async () => {
    let { status: cameraRollStatus } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    let { status: cameraStatus } = await Permissions.askAsync(
      Permissions.CAMERA
    );

    if (cameraStatus === 'granted' && cameraRollStatus === 'granted') {
      return 'granted';
    } else {
      return 'denied';
    }
  };

  _handlePressPicker = async () => {
    if (this.props.user.type === 'anonymous') {
      return this._promptAuthentication();
    }

    let status = await this._requestPermissionsAsync();
    if (status === 'denied') {
      alert(
        'This app needs camera and camera roll permissions in order to be able to share photos.'
      );
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.cancelled) {
      await this._createPostAsync(result);
    }
  };

  _handlePressCamera = async () => {
    if (this.props.user.type === 'anonymous') {
      return this._promptAuthentication();
    }

    let status = await this._requestPermissionsAsync();
    if (status === 'denied') {
      alert(
        'This app needs camera and camera roll permissions in order to be able to share photos.'
      );
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.cancelled) {
      await this._createPostAsync(result);
    }
  };

  _createPostAsync = ({ uri }) => {
    this.props.navigation.navigate('EditPost', { originalUri: uri });
  };

  _promptAuthentication = () => {
    Alert.alert(
      'Posting for conference attendees only',
      'You need to scan your ticket before you can post a photo',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        { text: 'Scan ticket now', onPress: this._openAuthScanner },
      ],
      { cancelable: false }
    );
  };

  _openAuthScanner = () => {
    this.props.navigation.navigate('AuthScanner');
  };

  _handlePressSignOut = () => {
    clearUser();
    this.props.navigation.navigate('Auth');
  };
}

const styles = StyleSheet.create({
  controlsContainer: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 6,
    paddingBottom: 3,
    paddingHorizontal: 15,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        bottom: 30,
        borderColor: '#888',
        shadowColor: '#888',
        shadowOffset: { x: 0, y: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      },
      android: {
        bottom: 15,
        backgroundColor: '#fff',
        borderWidth: 0,
        elevation: 3,
      },
    }),
  },
  controlButton: {
    paddingHorizontal: 15,
    backgroundColor: 'transparent',
  },
  controlIcon: {
    backgroundColor: 'transparent',
  },
});

const GET_POSTS_QUERY = gql`
  query GetPosts {
    listPosts {
      items {
        id
        name
        email
        fileUrl
        width
        height
        lat
        lon
      }
    }
  }
`;

export default compose(
  graphql(GET_POSTS_QUERY, { options: { fetchPolicy: 'network-only' } }),
  withUser,
  withNavigationFocus
)(FeedScreen);
