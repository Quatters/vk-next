import { React, Fragment } from 'react';
import UserSmall from '../components/UserSmall';

export default function UserContainer(props) {
  return (
    <Fragment>
      {props.users.map(user => (
        <UserSmall key={user._id} user={user} />
      ))}
    </Fragment>
  );
}
