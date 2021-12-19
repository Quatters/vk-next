import React from 'react';
import defaultAvatar from '../static/img/default-avatar.png';

export default function AvatarSmall(props) {
  return (
    <img
      src={props.src || defaultAvatar}
      alt='Avatar'
      width='50'
      height='50'
      style={{ borderRadius: '50%', cursor: 'pointer', objectFit: 'cover' }}
      onClick={props.onClick}
    />
  );
}
