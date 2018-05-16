import React from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  Animated,
  StyleSheet,
} from 'react-native';
import { Font, Icon } from 'expo';
import { compose, graphql } from 'react-apollo';
import { withNavigationFocus } from 'react-navigation';
import gql from 'graphql-tag';
import FeedItem from '../components/FeedItem';
import Constants from '../util/Constants';

class Tile extends React.PureComponent {
  pos = new Animated.Value(-1);
  componentDidUpdate(prevProps) {
    const { props } = this;
    if (
      prevProps.focused !== props.focused ||
      prevProps.isNext !== props.isNext
    ) {
      const { pos } = this;
      if (props.isNext) {
        pos.setValue(1);
      } else if (props.focused) {
        Animated.spring(pos, { toValue: 0, useNativeDriver: true }).start();
      } else {
        Animated.spring(pos, { toValue: -1, useNativeDriver: true }).start();
      }
    }
  }
  render() {
    const { post, i, focused, onPressPost } = this.props;
    const { pos } = this;
    const translateX = pos.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [-Constants.screen.width, 0, Constants.screen.width],
    });
    const scale = pos.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [0.2, 0.8, 0.2],
    });
    const rotate = `${(4 * Math.cos(i * 11)).toFixed(0)}deg`;
    return (
      <Animated.View
        style={{
          position: 'absolute',
          transform: [{ translateX }, { rotate }, { scale }],
        }}
      >
        <FeedItem
          item={post}
          size={Constants.screen.width}
          onPressPost={onPressPost}
        />
      </Animated.View>
    );
  }
}

class Shuffle extends React.Component {
  state = {
    index: 0,
    remaining: 0,
  };

  componentDidMount() {
    this.run();
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  run = () => {
    const loop = () => {
      this.setState(({ index, remaining }, { posts }) => {
        if (remaining === 0) {
          console.log('WINNER', posts[index]);
          return { remaining, index };
        }
        this.timeout = setTimeout(
          loop,
          100 + 900 / Math.max(1, remaining - posts.length) + 400 / remaining,
        );
        return {
          index: (index + 1) % posts.length,
          remaining: remaining - 1,
        };
      });
    };

    this.setState(
      {
        index: 0,
        remaining: Math.floor(80 + Math.random() * this.props.posts.length),
      },
      loop,
    );
  };

  onPressPost = () => {};

  render() {
    const { posts } = this.props;
    const { index, remaining } = this.state;
    return (
      <View
        style={{
          position: 'relative',
          width: Constants.screen.width,
          height: Constants.screen.width,
        }}
      >
        {posts.map(
          (post, i) =>
            remaining > 0 || index === i ? (
              <Tile
                key={i}
                focused={i === index}
                isNext={i === (index + 1) % posts.length}
                post={post}
                i={i}
                onPressPost={this.onPressPost}
              />
            ) : null,
        )}
        <Text numberOfLines={1} style={styles.title1}>
          {posts[index].name}
        </Text>
        {remaining === 0 ? <Text style={styles.title2}>👑</Text> : null}
      </View>
    );
  }
}

class LoadingScreen extends React.PureComponent {
  render() {
    const { data } = this.props;
    console.log(data.listPosts && data.listPosts.items.length);
    return (
      <View
        style={{
          backgroundColor: '#000',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {data.listPosts ? (
          <Shuffle posts={getLastPostsUniqueByAuthor(data.listPosts.items)} />
        ) : (
          <ActivityIndicator size="large" color="#000" />
        )}
      </View>
    );
  }
}

// sorry folks no one from org myself included :P
const blacklist = ['Patrick', 'Brent', 'Evan', 'Gaëtan'];
function getLastPostsUniqueByAuthor(posts) {
  const authorsByEmail = {};
  for (const post of posts) {
    if (!(post.email in authorsByEmail) && !blacklist.includes(post.name)) {
      authorsByEmail[post.email] = post;
    }
  }
  const coll = Object.keys(authorsByEmail).map(email => authorsByEmail[email]);
  console.log(coll.map(c => c.name));
  return coll;
}

const styles = StyleSheet.create({
  title1: {
    color: '#fff',
    fontSize: 32,
    position: 'absolute',
    width: '100%',
    top: -80,
    textAlign: 'center',
  },
  title2: {
    color: '#fff',
    fontSize: 64,
    position: 'absolute',
    width: '100%',
    top: -150,
    textAlign: 'center',
  },
});

const GET_POSTS_QUERY = gql`
  query GetPosts {
    listPosts(first: 1000) {
      items {
        id
        name
        email
        fileUrl
        width
        height
      }
    }
  }
`;

export default compose(
  graphql(GET_POSTS_QUERY, { options: { fetchPolicy: 'network-only' } }),
  withNavigationFocus,
)(LoadingScreen);
