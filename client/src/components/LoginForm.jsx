import { React, useState, useContext } from 'react';
import { Card, Form, Button, Spinner } from 'react-bootstrap';
import { getUser, signIn } from '../static/js/api-calls';
import { useHistory } from 'react-router-dom';
import CurrentUserContext from '../static/js/CurrentUserContext';
import NotificationContext from '../static/js/NotificationContext';

export default function LoginForm() {
  const history = useHistory();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [wrongCredentials, setWrongCredentials] = useState(false);
  const [isRequestCompleted, setIsRequestCompleted] = useState(true);

  const { refreshCurrentUser } = useContext(CurrentUserContext);
  const { showNotification } = useContext(NotificationContext);

  function handleClick() {
    setIsRequestCompleted(false);
    signIn(login, password)
      .then(response => {
        getUser(login).then(response => {
          setIsRequestCompleted(true);
          refreshCurrentUser();
          history.push('/me');
        });
      })
      .catch(error => {
        setIsRequestCompleted(true);
        if (error.response?.status === 404) {
          setWrongCredentials(true);
        } else {
          showNotification();
        }
      });
  }

  return (
    <Card className='mb-4'>
      <Card.Body>
        <Card.Title className='mb-2'>Sign In</Card.Title>
        {wrongCredentials && (
          <Form.Text className='text-danger'>
            Wrong login or password.
          </Form.Text>
        )}
        <Form className='mt-3'>
          <Form.Control
            placeholder='Login'
            className='mb-3'
            onChange={e => setLogin(e.target.value)}
          />
          <Form.Control
            type='password'
            placeholder='Password'
            className='mb-3'
            onChange={e => setPassword(e.target.value)}
          />
          <Button
            variant='primary'
            onClick={handleClick}
            disabled={!isRequestCompleted}
          >
            {isRequestCompleted ? (
              'Submit'
            ) : (
              <Spinner animation='border' as='span' size='sm' />
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
