import React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { Ionicons } from 'react-native-vector-icons';
import { withUser, clearUser } from 'react-native-authentication-helpers';
import { Permissions, ImagePicker, ImageManipulator } from 'expo';
import { compose, graphql } from 'react-apollo';
import { withNavigationFocus } from 'react-navigation';
import gql from 'graphql-tag';

import Feed from '../components/Feed';
import Button from '../components/Button';
import uploadImageAsync from '../util/uploadImageAsync';

class FeedScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Quoi',
    headerTitleStyle: {
      fontSize: 20,
      fontFamily: 'Wellfleet',
    },
    // headerLeft: (
    //   <Button
    //     title="Info"
    //     onPress={() => {}}
    //     containerStyle={{ marginHorizontal: 10 }}
    //   />
    // ),
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
          <Ionicons name="ios-photos-outline" size={40} />
        </BorderlessButton>
        <BorderlessButton
          onPress={this._handlePressCamera}
          style={styles.controlButton}>
          <Ionicons name="ios-camera-outline" size={50} />
        </BorderlessButton>
      </View>
    );
  };

  _handlePressPicker = async () => {
    if (this.props.user.type === 'anonymous') {
      return this._promptAuthentication();
    }

    let { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
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

    let { status } = await Permissions.askAsync(Permissions.CAMERA);
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
    bottom: 30,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingTop: 6,
    paddingBottom: 3,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderColor: '#888',
    shadowColor: '#888',
    elevation: 3,
    shadowOffset: { x: 0, y: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  controlButton: {
    paddingHorizontal: 15,
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
