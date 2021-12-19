import { React, useState } from 'react';
import { Card, Form, Button, Spinner } from 'react-bootstrap';
import { signUp } from '../static/js/api-calls';
import { useHistory } from 'react-router-dom';
import * as validator from '../static/js/validators';

export default function RegistrationForm() {
  const history = useHistory();

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const [wrongName, setWrongName] = useState(false);
  const [wrongSurname, setWrongSurname] = useState(false);
  const [wrongLogin, setWrongLogin] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);
  const [passwordsDontMatch, setPasswordsDontMatch] = useState(false);

  const [loginIsTaken, setLoginIsTaken] = useState(false);
  const [isRequestCompleted, setIsRequestCompleted] = useState(true);

  function handleClick() {
    setIsRequestCompleted(false);
    if (allIsCorrect()) {
      signUp({ name, surname, login, password })
        .then(response => {
          history.push('/signin');
        })
        .catch(error => {
          if (error.response?.status === 400) {
            setLoginIsTaken(true);
          }
        })
        .finally(() => {
          setIsRequestCompleted(true);
        });
    }
  }

  function allIsCorrect() {
    const nameIsCorrect = validator.nameIsCorrect(name);
    const surnameIsCorrect = validator.nameIsCorrect(surname);
    const loginIsCorrect = validator.loginIsCorrect(login);
    const passwordIsCorrect = validator.passwordIsCorrect(password);
    const passwordsMatch = password === repeatPassword;

    setWrongName(!nameIsCorrect);
    setWrongSurname(!surnameIsCorrect);
    setWrongLogin(!loginIsCorrect);
    setWrongPassword(!passwordIsCorrect);
    setPasswordsDontMatch(!passwordsMatch);

    return (
      nameIsCorrect &&
      surnameIsCorrect &&
      loginIsCorrect &&
      passwordIsCorrect &&
      passwordsMatch
    );
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>Sign Up</Card.Title>
        <Form className='mt-4'>
          <Form.Group className='mb-3'>
            <Form.Label>Name</Form.Label>
            <Form.Control onChange={e => setName(e.target.value)} />
            {wrongName && (
              <Form.Text className='text-danger'>
                Cannot be empty, may contain only letters and dash
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Last name</Form.Label>
            <Form.Control onChange={e => setSurname(e.target.value)} />
            {wrongSurname && (
              <Form.Text className='text-danger'>
                Cannot be empty, may contain only letters and dash
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Login</Form.Label>
            <Form.Control onChange={e => setLogin(e.target.value)} />
            {wrongLogin && (
              <Form.Text className='text-danger'>
                At least 4 symbols, may contain letters, numbers and dash
              </Form.Text>
            )}
            {loginIsTaken && (
              <Form.Text className='text-danger'>
                This login is already in use
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              onChange={e => setPassword(e.target.value)}
            />
            {wrongPassword && (
              <Form.Text className='text-danger'>At least 4 symbols</Form.Text>
            )}
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Repeat password</Form.Label>
            <Form.Control
              type='password'
              onChange={e => setRepeatPassword(e.target.value)}
            />
            {passwordsDontMatch && (
              <Form.Text className='text-danger'>
                Passwords don't match
              </Form.Text>
            )}
          </Form.Group>
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
