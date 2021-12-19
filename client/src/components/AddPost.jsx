import { React, useState, useContext, useEffect } from 'react';
import { Button, FormControl, Spinner } from 'react-bootstrap';
import CurrentUserContext from '../static/js/CurrentUserContext';
import { useHistory } from 'react-router-dom';
import { createPost } from '../static/js/api-calls';
import NotificationContext from '../static/js/NotificationContext';

export default function AddPost(props) {
  const [input, setInput] = useState('');
  const [placeholder, setPlaceholder] = useState("What's new?");
  const { currentUser, refreshCurrentUser } = useContext(CurrentUserContext);
  const history = useHistory();
  const [isRequestCompleted, setIsRequestCompleted] = useState(true);
  const [inputHeight, setInputHeight] = useState(36);

  const { showNotification } = useContext(NotificationContext);

  function handleClick() {
    if (!input.trim()) return;

    setIsRequestCompleted(false);
    createPost(input.trim(), currentUser, props.user.login)
      .then(response => {
        if (currentUser?.login === props.user.login) {
          refreshCurrentUser();
          return;
        }
        history.push('/users/' + props.user.login);
      })
      .catch(error => {
        refreshCurrentUser();
        if (error.response?.status === 401) {
          showNotification(401);
          history.push('/signin');
        } else if (error.response?.status === 403) showNotification(403);
        else showNotification();
      })
      .finally(() => {
        setIsRequestCompleted(true);
        setInput('');
      });
  }

  function handleChange(event) {
    if (inputHeight < event.target.scrollHeight) {
      setInputHeight(inputHeight + 24);
    } else if (inputHeight > event.target.scrollHeight) {
      setInputHeight(inputHeight - 24);
    }

    setInput(event.target.value);
  }

  useEffect(() => {
    const login = getLoginFromPath();

    if (!currentUser) {
      setPlaceholder('Please, authorize before leaving posts');
    } else if (login !== currentUser.login) {
      setPlaceholder(`Leave a post for @${login}`);
    } else if (login === currentUser.login) {
      setPlaceholder("What's new?");
    }
  }, [props]);

  function getLoginFromPath() {
    const path = history.location.pathname;
    const pathArray = path.split('/');
    return pathArray[pathArray.length - 1];
  }

  return (
    <div className='my-4 d-flex'>
      <FormControl
        as='textarea'
        style={{
          height: `${inputHeight}px`,
          resize: 'none',
          overflow: 'hidden',
        }}
        placeholder={placeholder}
        onChange={handleChange}
        value={input}
        disabled={!currentUser}
      />
      <Button
        onClick={handleClick}
        className='ms-3 align-self-end'
        disabled={!currentUser || !isRequestCompleted}
      >
        {isRequestCompleted ? (
          'Post'
        ) : (
          <Spinner animation='border' as='span' size='sm' />
        )}
      </Button>
    </div>
  );
}
