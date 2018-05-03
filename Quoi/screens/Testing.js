import React from 'react';
import {
  ActivityIndicator,
  Button,
  Clipboard,
  ScrollView,
  Share,
  Image,
  StyleSheet,
  Text,
  StatusBar,
  View,
} from 'react-native';
import { ApolloProvider, graphql } from 'react-apollo';
import { Permissions, ImagePicker } from 'expo';
import { AUTH_TYPE } from 'aws-appsync/lib/link/auth-link';
import AWSAppSyncClient from 'aws-appsync';
import gql from 'graphql-tag';

import AppSyncConfig from '../aws-exports';

const client = new AWSAppSyncClient({
  url: AppSyncConfig.graphqlEndpoint,
  region: AppSyncConfig.region,
  auth: {
    type: AUTH_TYPE.AWS_IAM,
    credentials: {
      accessKeyId: AppSyncConfig.accessKeyId,
      secretAccessKey: AppSyncConfig.secretAccessKey,
    },
  },
});

let FAKE_UUID = 'hhER9W5gFToFt4lfXyonLU6vyxAtinM0s996';
const getSignedStorageUrlAsync = async uuid => {
  let response = await fetch(
    `https://7bz0uwltek.execute-api.us-east-1.amazonaws.com/production/getSignedStorageUrl?uuid=${uuid}`
  );
  let result = await response.json();
  console.log(result);
  return result;
};

export default class Testing extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <TestContent />
      </ApolloProvider>
    );
  }
}

@graphql(gql`
  query GetPosts {
    listPosts {
      items {
        title
      }
    }
  }
`)
class TestContent extends React.Component {
  render() {
    return (
      <ScrollView
        style={{ backgroundColor: '#fff' }}
        contentContainerStyle={styles.container}>
        <Text style={styles.title}>Testing...</Text>
        <Text style={styles.body}>{JSON.stringify(this.props.data)}</Text>
        <ImageUploader />
      </ScrollView>
    );
  }
}

class ImageUploader extends React.Component {
  state = {
    image: null,
    uploading: false,
  };

  render() {
    let { image } = this.state;

    return (
      <View>
        <Button onPress={this._signedUrl} title="Get signed storage url" />
        <Button
          onPress={this._pickImage}
          title="Pick an image from camera roll"
        />

        <Button onPress={this._takePhoto} title="Take a photo" />

        <Text>{image}</Text>
        {this._maybeRenderImage()}
        {this._maybeRenderUploadingOverlay()}

        <StatusBar barStyle="default" />
      </View>
    );
  }

  _signedUrl = async () => {
    const info = await getSignedStorageUrlAsync(FAKE_UUID);
    console.log(info);
  };

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'rgba(0,0,0,0.4)',
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}>
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  };

  _maybeRenderImage = () => {
    let { image } = this.state;
    if (!image) {
      return;
    }

    return (
      <View
        style={{
          marginTop: 30,
          width: 250,
          borderRadius: 3,
          elevation: 2,
          shadowColor: 'rgba(0,0,0,1)',
          shadowOpacity: 0.2,
          shadowOffset: { width: 4, height: 4 },
          shadowRadius: 5,
        }}>
        <View
          style={{
            borderTopRightRadius: 3,
            borderTopLeftRadius: 3,
            overflow: 'hidden',
          }}>
          <Image source={{ uri: image }} style={{ width: 250, height: 250 }} />
        </View>

        <Text
          onPress={this._copyToClipboard}
          onLongPress={this._share}
          style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
          {image}
        </Text>
      </View>
    );
  };

  _share = () => {
    Share.share({
      message: this.state.image,
      title: 'Check out this photo',
      url: this.state.image,
    });
  };

  _copyToClipboard = () => {
    Clipboard.setString(this.state.image);
    alert('Copied image URL to clipboard');
  };

  _takePhoto = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };

  _pickImage = async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };

  _handleImagePicked = async pickerResult => {
    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        let url = await uploadImageAsync(pickerResult.uri, FAKE_UUID);
        this.setState({ image: url });
      }
    } catch (e) {
      console.log({ e });
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({ uploading: false });
    }
  };
}

async function uploadImageAsync(imageUrl, uuid) {
  let { signedUrl, targetUrl } = await getSignedStorageUrlAsync(uuid);
  const response = await fetch(imageUrl);
  const blob = await response.blob();

  await fetch(signedUrl, { method: 'PUT', body: blob});
  return targetUrl;
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  body: {
    color: 'rgba(0,0,0,0.8)',
    marginTop: 5,
    fontSize: 13,
    textAlign: 'center',
  },
});
