import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';

import CachedImage from './CachedImage';
import GravatarImage from '../components/GravatarImage';

const IMAGE_MARGIN_INSIDE = 3;
const IMAGE_MARGIN_OUTSIDE = 6;

export default class FeedItem extends React.PureComponent {
  render() {
    const { item, style, onPressPost, size } = this.props;
    return (
      <View style={[styles.item, style]}>
        <BorderlessButton onPress={() => onPressPost(item)} activeOpacity={1}>
          <CachedImage
            source={{ uri: item.fileUrl }}
            style={{
              width: size,
              height: size,
            }}
          />
        </BorderlessButton>
        <View style={styles.avatarContainer}>
          <GravatarImage email={item.email} size={Math.floor(size / 5)} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  avatarContainer: {
    position: 'absolute',
    bottom: 5,
    left: 10,
  },
  item: {
    flex: 1,
  },
});
