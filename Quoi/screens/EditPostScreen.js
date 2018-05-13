import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Slider,
} from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { Ionicons } from 'react-native-vector-icons';
import { withUser } from 'react-native-authentication-helpers';
import { ImageManipulator } from 'expo';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Surface } from 'gl-react-expo';
import { ContrastSaturationBrightness } from 'gl-react-contrast-saturation-brightness';

import Button from '../components/Button';
import Constants from '../util/Constants';
import uploadImageAsync from '../util/uploadImageAsync';

class Knob extends React.Component {
  state = { value: this.props.value };
  onValueChange = value => {
    this.setState({ value });
    if (this.props.live) {
      this.props.onChange(value);
    }
  };
  onSlidingComplete = () => {
    this.props.onChange(this.state.value);
  };
  render() {
    const { value } = this.state;
    const { label, max, min, step } = this.props;
    return (
      <View style={{ flexDirection: 'column' }}>
        <Text style={{ fontWeight: 'bold' }}>{label}</Text>
        <Slider
          minimumValue={min}
          maximumValue={max}
          step={step}
          onValueChange={this.onValueChange}
          onSlidingComplete={this.onSlidingComplete}
          value={value}
        />
      </View>
    );
  }
}

class EditPostScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    let isUploadInProgress = !!navigation.getParam('uploadProgress', false);
    console.log(navigation.getParam('uploadProgress'));
    console.log(isUploadInProgress);

    return {
      headerTitle: 'Edit Post',
      headerTitleStyle: {
        fontSize: 18,
      },
      headerLeft: (
        <Button
          enabled={!isUploadInProgress}
          onPress={navigation.dismiss}
          containerStyle={{ paddingHorizontal: 15 }}
        >
          <Ionicons name="ios-close" size={35} />
        </Button>
      ),
      headerRight: (
        <Button
          enabled={
            !isUploadInProgress && !!navigation.getParam('onSubmit', false)
          }
          onPress={navigation.getParam('onSubmit')}
          containerStyle={{ paddingHorizontal: 15 }}
        >
          <Ionicons name="ios-checkmark" size={35} />
        </Button>
      ),
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      uri: props.navigation.getParam('originalUri'),
      contrast: 1,
      saturation: 1,
      brightness: 1,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ onSubmit: this._createPostAsync });
  }

  onSurfaceRef = surface => {
    this.surface = surface;
  };

  render() {
    const { contrast, saturation, brightness } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Surface
          ref={this.onSurfaceRef}
          style={{
            width: Constants.screen.width,
            height: Constants.screen.width,
          }}
        >
          <ContrastSaturationBrightness
            contrast={contrast}
            saturation={saturation}
            brightness={brightness}
          >
            {{ uri: this.state.uri }}
          </ContrastSaturationBrightness>
        </Surface>
        <View>
          <Knob
            label="contrast"
            onChange={contrast => this.setState({ contrast })}
            value={contrast}
            min={0}
            max={3}
            step={0.1}
            live
          />
          <Knob
            label="saturation"
            onChange={saturation => this.setState({ saturation })}
            value={contrast}
            min={0}
            max={3}
            step={0.1}
            live
          />
          <Knob
            label="brightness"
            onChange={brightness => this.setState({ brightness })}
            value={brightness}
            min={0}
            max={3}
            step={0.1}
            live
          />
        </View>
        {this._maybeRenderLoading()}
      </View>
    );
  }

  _maybeRenderLoading = () => {
    let uploadProgress = this.props.navigation.getParam(
      'uploadProgress',
      false,
    );
    let isUploadInProgress = !!uploadProgress;

    if (!isUploadInProgress) {
      return null;
    }

    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: 'rgba(0,0,0,0.5)',
            alignItems: 'center',
            paddingTop: Constants.screen.width / 2 - 25,
          },
        ]}
      >
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ fontSize: 16, marginTop: 10, color: '#fff' }}>
          {uploadProgress}
        </Text>
      </View>
    );
  };

  _createPostAsync = async () => {
    try {
      this.props.navigation.setParams({ uploadProgress: 'Preparing image' });

      let { ticketId, email, firstName } = this.props.user;
      let { uri } = await this.surface.glView.capture({
        format: 'png',
      });

      let {
        uri: resizedUri,
        width,
        height,
      } = await ImageManipulator.manipulate(
        uri,
        [{ resize: { width: 500, height: 500 } }],
        { format: 'png' },
      );

      this.props.navigation.setParams({ uploadProgress: 'Uploading image' });
      let fileUrl = await uploadImageAsync(resizedUri, ticketId);
      console.log({ fileUrl });
      this.props.navigation.setParams({ uploadProgress: 'Creating post' });
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
    } catch (e) {
      console.log(e);
      this.props.navigation.setParams({ uploadProgress: null });
      Alert.alert(
        'Unable to complete post',
        'An error occurred while uploading the post.',
        [
          { text: 'Cancel', onPress: () => {}, style: 'cancel' },
          { text: 'Retry', onPress: this._createPostAsync },
        ],
        { cancelable: false },
      );
    }
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
  withUser,
)(EditPostScreen);
