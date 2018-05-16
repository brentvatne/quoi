import React from 'react';
import {
  FlatList,
  Image,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ScrollView, BorderlessButton } from 'react-native-gesture-handler';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import CachedImage from './CachedImage';
import Constants from '../util/Constants';
import GravatarImage from '../components/GravatarImage';
import FeedItem from '../components/FeedItem';

const IMAGE_MARGIN_INSIDE = 3;
const IMAGE_MARGIN_OUTSIDE = 6;
const IMAGE_SIZE =
  Constants.screen.width / 2 - IMAGE_MARGIN_INSIDE - IMAGE_MARGIN_OUTSIDE;

export default class Feed extends React.PureComponent {
  state = {
    refreshing: false,
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.isVisible && this.props.isVisible) {
      this._refreshAsync();
    }
  }

  render() {
    return (
      <FlatList
        style={[styles.listContainer, this.props.style]}
        contentContainerStyle={[
          styles.listContentContainer,
          this.props.contentContainerStyle,
        ]}
        columnWrapperStyle={{ alignItems: 'flex-start' }}
        renderScrollComponent={props => (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={props.refreshing}
                onRefresh={props.onRefresh}
              />
            }
            {...props}
          />
        )}
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
    if (this.state.refreshing) {
      return;
    }

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
      <FeedItem
        item={item}
        style={{
          paddingTop: 6,
          paddingLeft:
            index % 2 === 0 ? IMAGE_MARGIN_OUTSIDE : IMAGE_MARGIN_INSIDE,
          paddingRight:
            index % 2 === 0 ? IMAGE_MARGIN_INSIDE : IMAGE_MARGIN_OUTSIDE,
        }}
        size={IMAGE_SIZE}
        onPressPost={this.props.onPressPost}
      />
    );
  };
}

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: '#fbfbfb',
    flex: 1,
  },
  listContentContainer: {
    paddingBottom: isIphoneX() ? 110 : 90,
  },
});
