import React from 'react';
import { Text, View } from 'react-native';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';

let defaultTextStyle = {
  fontSize: 20,
};

export default class Button extends React.Component {
  static defaultProps = {
    enabled: true,
  };

  render() {
    let ButtonComponent = this.props.withBorder ? RectButton : BorderlessButton;
    return (
      <ButtonComponent
        hitSlop={{ top: 15, left: 15, right: 15, bottom: 15 }}
        onPress={this.props.enabled ? this.props.onPress : null}
        style={[this.props.containerStyle]}>
        <View style={{ opacity: this.props.enabled ? 1 : 0.3 }}>
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
        </View>
      </ButtonComponent>
    );
  }
}
