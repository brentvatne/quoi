import React from 'react';
import { Text } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';

let defaultTextStyle = {
  fontSize: 20,
};

export default class Button extends React.Component {
  render() {
    return (
      <BorderlessButton
        hitSlop={{top: 15, left: 15, right: 15, bottom: 15}}
        onPress={this.props.onPress}
        style={this.props.containerStyle}>
        {this.props.title ? (
          <Text
            style={[
              defaultTextStyle,
              this.props.color ? { color: this.props.color } : {},
              this.props.style,
            ]}>
            {this.props.title}
          </Text>
        ) : (
          this.props.children
        )}
      </BorderlessButton>
    );
  }
}
