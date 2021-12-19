import { React, useContext, useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import CurrentUserContext from '../static/js/CurrentUserContext';
import EditNameModal from './EditNameModal';
import EditAboutModal from './EditAboutModal';

export default function UserInfo(props) {
  const { currentUser } = useContext(CurrentUserContext);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    setCanEdit(currentUser?.login === props.user.login);
  }, [props, currentUser]);

  return (
    <Card>
      <Card.Body className='d-flex flex-wrap overflow-hidden'>
        <Card.Title className='mb-1'>
          {props.user.name} {props.user.surname}
        </Card.Title>
        {canEdit && (
          <div className='ms-2 align-self-start'>
            <EditNameModal user={props.user} />
          </div>
        )}

        <div className='w-100 mb-2'></div>

        <Card.Text className={'mb-0'}>
          {props.user.about || (canEdit && 'Set status...')}
        </Card.Text>
        {canEdit && (
          <div className='ms-2 align-self-start'>
            <EditAboutModal user={props.user} />
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
