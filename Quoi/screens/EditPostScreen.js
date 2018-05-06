import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, View } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { Ionicons } from 'react-native-vector-icons';
import { withUser } from 'react-native-authentication-helpers';
import { ImageManipulator } from 'expo';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Button from '../components/Button';
import Constants from '../util/Constants';
import uploadImageAsync from '../util/uploadImageAsync';

class EditPostScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Edit Post',
    headerTitleStyle: {
      fontSize: 18,
    },
    headerLeft: (
      <Button
        onPress={() => navigation.dismiss()}
        containerStyle={{ paddingHorizontal: 15 }}>
        <Ionicons name="ios-close" size={35} />
      </Button>
    ),
    headerRight: (
      <Button
        enabled={!!navigation.getParam('onSubmit', false)}
        onPress={navigation.getParam('onSubmit')}
        containerStyle={{ paddingHorizontal: 15 }}>
        <Ionicons name="ios-checkmark" size={35} />
      </Button>
    ),
  });

  constructor(props) {
    super(props);

    this.state = {
      uri: props.navigation.getParam('originalUri'),
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ onSubmit: this._createPostAsync });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Image
          source={{ uri: this.state.uri }}
          style={{
            width: Constants.screen.width,
            height: Constants.screen.width,
          }}
        />
      </View>
    );
  }

  _createPostAsync = async () => {
    let { uri } = this.state;
    let { ticketId, email, firstName } = this.props.user;
    let { uri: resizedUri, width, height } = await ImageManipulator.manipulate(
      uri,
      [{ resize: { width: 500, height: 500 } }],
      { format: 'png' }
    );
    let fileUrl = await uploadImageAsync(resizedUri, ticketId);
    await this.props.createAuthenticatedPost({
      variables: {
        email,
        name: firstName,
        fileUrl,
        width,
        height,
        uuid: ticketId,
      },
    });

    this.props.navigation.dismiss();
  };
}

const styles = StyleSheet.create({});

const ADD_POST_MUTATION = gql`
  mutation addPost(
    $uuid: String!
    $name: String!
    $email: String!
    $fileUrl: String!
    $width: Int!
    $height: Int!
    $lat: Int
    $lon: Int
  ) {
    createAuthenticatedPost(
      input: {
        uuid: $uuid
        name: $name
        email: $email
        fileUrl: $fileUrl
        width: $width
        height: $height
        lat: $lat
        lon: $lon
      }
    ) {
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
`;

export default compose(
  graphql(ADD_POST_MUTATION, { name: 'createAuthenticatedPost' }),
  withUser
)(EditPostScreen);
