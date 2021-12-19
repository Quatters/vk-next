import React from 'react';
import { Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import defaultAvatar from '../static/img/default-avatar.png';
import AvatarSmall from '../components/AvatarSmall';
import '../static/css/shared.css';

export default function UserSmall(props) {
  return (
    <LinkContainer to={'/users/' + props.user.login}>
      <Card className='mb-4 user-small'>
        <Card.Body className='d-flex flex-wrap'>
          <AvatarSmall src={props.user?.avatarBase64 || defaultAvatar} />
          <div className='d-flex flex-column align-self-center'>
            <p className='ms-3 mb-0'>
              {props.user.name} {props.user.surname}
            </p>
            <small className='ms-3'>{props.user.about}</small>
          </div>
        </Card.Body>
      </Card>
    </LinkContainer>
  );
}
