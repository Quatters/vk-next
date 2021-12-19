import { React, useEffect, useState, useContext } from 'react';
import { Card, CloseButton, Spinner } from 'react-bootstrap';
import defaultAvatar from '../static/img/default-avatar.png';
import AvatarSmall from './AvatarSmall';
import Moment from 'react-moment';
import 'moment-timezone';
import moment from 'moment-timezone';
import 'moment/locale/ru';
import { useHistory } from 'react-router-dom';
import CurrentUserContext from '../static/js/CurrentUserContext';
import NotificationContext from '../static/js/NotificationContext';
import { removePost } from '../static/js/api-calls';

export default function Post(props) {
  const history = useHistory();
  const [canEdit, setCanEdit] = useState(false);
  const { currentUser, refreshCurrentUser } = useContext(CurrentUserContext);
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const { showNotification } = useContext(NotificationContext);
  const [isRequestCompleted, setIsRequestCompleted] = useState(true);

  moment().locale('ru');

  function handleRedirect() {
    history.push('/users/' + props.post.login);
  }

  useEffect(() => {
    setCanEdit(currentUser?.login === getLoginFromPath());
  }, [props, currentUser]);

  function handleRemovePost() {
    if (!showRemoveConfirmation) {
      setShowRemoveConfirmation(true);
      setTimeout(() => {
        setShowRemoveConfirmation(false);
      }, 3000);
      return;
    }

    setShowRemoveConfirmation(false);
    setIsRequestCompleted(false);
    removePost(props.post._id, currentUser.login)
      .catch(error => {
        if (error.response?.status === 401) {
          showNotification(401);
          history.push('/signin');
        } else if (error.response?.status === 403) showNotification(403);
        else showNotification();
      })
      .finally(() => {
        refreshCurrentUser(props.postsLimit);
        props.setHasMoreData(true);
        setIsRequestCompleted(true);
      });
  }

  function getLoginFromPath() {
    const path = history.location.pathname;
    const pathArray = path.split('/');
    return pathArray[pathArray.length - 1];
  }

  return (
    <Card className='mb-4'>
      <Card.Body className='d-flex flex-wrap'>
        <AvatarSmall
          src={props.post.avatarBase64 ?? defaultAvatar}
          onClick={handleRedirect}
        />
        <div className='d-flex flex-column'>
          <p
            className='ms-3 mb-0'
            onClick={handleRedirect}
            style={{ cursor: 'pointer' }}
          >
            {props.post.name} {props.post.surname}
          </p>
          <small className='ms-3 text-muted'>
            <Moment fromNowDuring={1000 * 60 * 60 * 24 * 2} format='lll'>
              {props.post.added}
            </Moment>
          </small>
        </div>
        <div className='ms-auto d-flex'>
          {!isRequestCompleted && (
            <Spinner
              className='mt-1'
              animation='border'
              as='span'
              variant='primary'
              size='sm'
            />
          )}
          {showRemoveConfirmation && (
            <small
              className='text-danger me-2'
              style={{ cursor: 'pointer' }}
              onClick={handleRemovePost}
            >
              Delete?
            </small>
          )}
          {canEdit && isRequestCompleted && (
            <CloseButton onClick={handleRemovePost} />
          )}
        </div>
        <div className='w-100 mt-2'></div>
        <Card.Text style={{ whiteSpace: 'pre-line' }}>
          {props.post.body}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
