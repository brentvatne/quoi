import React from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { isIphoneX, getStatusBarHeight } from 'react-native-iphone-x-helper';

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUS_BAR_HEIGHT = getStatusBarHeight(true);

export default class Header extends React.PureComponent {
  static HEIGHT = APPBAR_HEIGHT + STATUS_BAR_HEIGHT;

  render() {
    return (
      <View style={styles.navigationBar}>
        <View style={styles.navigationBarTitle}>
          {this.props.renderTitle()}
        </View>

        <View style={styles.navigationBarAction}>
          {this.props.renderRight()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navigationBarAction: {
    position: 'absolute',
    right: 5,
    top: 0,
    paddingTop: STATUS_BAR_HEIGHT,
    bottom: 0,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationBarTitle: {
    flex: 1,
    paddingHorizontal: 10,
    ...Platform.select({
      ios: {
        justifyContent: 'center',
        alignItems: 'center',
      },
    }),
  },
  navigationBar: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: APPBAR_HEIGHT + STATUS_BAR_HEIGHT,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#A7A7AA',
    elevation: 4,
    alignItems: 'center',
    paddingTop: STATUS_BAR_HEIGHT,
    paddingHorizontal: 5,
    backgroundColor: '#fff',
  },
});
