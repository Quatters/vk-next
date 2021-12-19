import { React, useState, useEffect, useContext, Fragment } from 'react';
import { Card } from 'react-bootstrap';
import defaultAvatar from '../static/img/default-avatar.png';
import CurrentUserContext from '../static/js/CurrentUserContext';
import EditAvatarModal from './EditAvatarModal';

export default function Avatar(props) {
  const { currentUser } = useContext(CurrentUserContext);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    setCanEdit(currentUser?.login === props.user.login);
  }, [props, currentUser]);

  return (
    <Fragment>
      <Card className='mb-4'>
        <Card.Body>
          <Card.Img src={props.src || defaultAvatar} variant='top'></Card.Img>
          {canEdit && <EditAvatarModal />}
        </Card.Body>
      </Card>
    </Fragment>
  );
}
