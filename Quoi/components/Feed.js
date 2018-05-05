import React from 'react';
import CachedImage from './CachedImage';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Constants from '../util/Constants';

const IMAGE_MARGIN_INSIDE = 3;
const IMAGE_MARGIN_OUTSIDE = 6;
const IMAGE_SIZE =
  Constants.screen.width / 2 - IMAGE_MARGIN_INSIDE - IMAGE_MARGIN_OUTSIDE;

export default class Feed extends React.Component {
  state = {
    refreshing: false,
  };

  render() {
    return (
      <FlatList
        style={styles.listContainer}
        contentContainerStyle={styles.listContentContainer}
        columnWrapperStyle={{ alignItems: 'flex-start' }}
        refreshing={this.state.refreshing}
        onRefresh={this._refreshAsync}
        renderItem={this._renderItem}
        numColumns={2}
        keyExtractor={item => item.id}
        data={this.props.posts}
      />
    );
  }

  _refreshAsync = async () => {
    try {
      this.setState({ refreshing: true });
      await this.props.refreshAsync();
    } catch (e) {
    } finally {
      this.setState({ refreshing: false });
    }
  };

  _renderItem = ({ item, index }) => {
    return (
      <View style={styles.item}>
        <CachedImage
          source={{ uri: item.fileUrl }}
          style={{
            width: IMAGE_SIZE,
            height: IMAGE_SIZE,
            marginTop: 6,
            marginLeft:
              index % 2 === 0 ? IMAGE_MARGIN_OUTSIDE : IMAGE_MARGIN_INSIDE,
            marginRight:
              index % 2 === 0 ? IMAGE_MARGIN_INSIDE : IMAGE_MARGIN_OUTSIDE,
          }}
        />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: '#fbfbfb',
    flex: 1,
  },
  listContentContainer: {},
  item: {
    flex: 1,
  },
});
