import React from 'react';
import { Animated, Button, StyleSheet, Text, View } from 'react-native';
import {
  PanGestureHandler,
  TapGestureHandler,
  State,
} from 'react-native-gesture-handler';

import Constants from '../util/Constants';

export default class Modal extends React.PureComponent {
  value = new Animated.Value(0);
  translateY = new Animated.Value(-250);

  componentDidMount() {
    if (this.props.visible) {
      this._show();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.visible && !this.props.visible) {
      this._hide();
    } else if (!prevProps.visible && this.props.visible) {
      this._show();
    }
  }

  render() {
    return (
      <Animated.View
        pointerEvents={this.props.visible ? 'auto' : 'none'}
        style={{
          elevation: 5,
          ...StyleSheet.absoluteFillObject,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: this.value,
        }}
      >
        <TapGestureHandler onActivated={this._handlePressBackground}>
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: 'rgba(0,0,0,0.7)' },
            ]}
          />
        </TapGestureHandler>

        <PanGestureHandler
          onHandlerStateChange={this._handlePanStateChange}
          onGestureEvent={Animated.event(
            [{ nativeEvent: { translationY: this.translateY } }],
            { useNativeDriver: true },
          )}
        >
          <Animated.View
            style={{ transform: [{ translateY: this.translateY }] }}
          >
            {this.props.children}
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    );
  }

  _show = () => {
    Animated.parallel([
      Animated.spring(this.translateY, {
        toValue: 0,
        speed: 20,
        bounciness: 0,
        useNativeDriver: true,
      }),
      Animated.spring(this.value, {
        toValue: 1,
        useNativeDriver: true,
        speed: 1,
        bounciness: 0,
      }),
    ]).start();
  };

  _hide = (onAnimationComplete = () => {}) => {
    Animated.timing(this.value, {
      toValue: 0,
      useNativeDriver: true,
      duration: 150,
    }).start(onAnimationComplete);
  };

  _handlePressBackground = () => {
    this._hide(() => {
      this.props.onHide();
    });
  };

  _handlePanStateChange = ({ nativeEvent }) => {
    let { oldState, state, velocityY, translationY } = nativeEvent;

    if (oldState === State.ACTIVE) {
      if (
        Math.abs(translationY) > Constants.screen.height / 5 ||
        Math.abs(velocityY) > 400
      ) {
        let toValue;
        if (
          (translationY > 0 && velocityY >= 0) ||
          (translationY < 0 && velocityY > 0)
        ) {
          toValue = translationY + Constants.screen.height;
        } else {
          toValue = translationY - Constants.screen.height;
        }
        Animated.spring(this.translateY, {
          toValue,
          velocityY,
          useNativeDriver: true,
          speed: 50,
          bounciness: 0,
          restDisplacementThreshold: 100,
          restSpeedThreshold: 100,
        }).start(this.props.onHide);
      } else {
        Animated.spring(this.translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };
}
