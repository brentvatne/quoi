import React from 'react';
import CachedImage from './CachedImage';
import md5 from 'crypto-js/md5';

export default class GravatarImage extends React.PureComponent {
  render() {
    const { size } = this.props;
    let gravatarUrl = `https://www.gravatar.com/avatar/${md5(
      this.props.email,
    )}`;

    return (
      <CachedImage
        source={{ uri: gravatarUrl }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
      />
    );
  }
}
