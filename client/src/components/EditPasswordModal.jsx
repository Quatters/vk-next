import { Fragment, React, useState, useContext } from 'react';
import { Modal, Button, Form, Spinner, Nav } from 'react-bootstrap';
import { changePassword } from '../static/js/api-calls';
import CurrentUserContext from '../static/js/CurrentUserContext';
import NotificationContext from '../static/js/NotificationContext';
import { passwordIsCorrect } from '../static/js/validators';

export default function EditPasswordModal() {
  const [show, setShow] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');

  const [wrongOldPassword, setWrongOldPassword] = useState(false);
  const [wrongNewPassword, setWrongNewPassword] = useState(false);
  const [passwordsDontMatch, setPasswordsDontMatch] = useState(false);
  const [passwordsAreTheSame, setPasswordsAreTheSame] = useState(false);
  const [isRequestCompleted, setIsRequestCompleted] = useState(true);

  const { currentUser, refreshCurrentUser } = useContext(CurrentUserContext);
  const { showNotification } = useContext(NotificationContext);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function handleConfirm() {
    if (allIsCorrect()) {
      setIsRequestCompleted(false);
      changePassword(oldPassword, newPassword, currentUser?.login)
        .then(response => {
          showNotification(null, 'Password has been changed.', 'Success');
          handleClose();
        })
        .catch(error => {
          if (error.response?.status === 403) showNotification(403);
          else if (error.response?.status === 401) showNotification(401);
          else if (error.response?.status === 404) setWrongOldPassword(true);
          else {
            showNotification();
          }
        })
        .finally(() => {
          setIsRequestCompleted(true);
          refreshCurrentUser();
        });
    }
  }

  function allIsCorrect() {
    const newPasswordIsCorrect = passwordIsCorrect(newPassword);
    const newPasswordsMatch = newPassword === repeatNewPassword;
    const newAndOldAreDifferent = newPassword !== oldPassword;

    setWrongNewPassword(!newPasswordIsCorrect);
    setPasswordsDontMatch(!newPasswordsMatch);
    setPasswordsAreTheSame(!newAndOldAreDifferent);
    setWrongOldPassword(!oldPassword);

    return (
      newPasswordIsCorrect &&
      newPasswordsMatch &&
      newAndOldAreDifferent &&
      oldPassword
    );
  }

  return (
    <Fragment>
      <Nav.Link to='/users' className='nav-link p-0' onClick={handleShow}>
        Change password
      </Nav.Link>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Change password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className='mb-3 mt-0'>
              <Form.Label>Old password</Form.Label>
              <Form.Control
                type='password'
                onChange={e => setOldPassword(e.target.value)}
              />
              {wrongOldPassword && (
                <Form.Text className='text-danger'>Wrong password</Form.Text>
              )}
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>New password</Form.Label>
              <Form.Control
                type='password'
                onChange={e => setNewPassword(e.target.value)}
              />
              {wrongNewPassword && (
                <Form.Text className='text-danger'>
                  At least 4 symbols
                </Form.Text>
              )}
              {passwordsAreTheSame && !wrongNewPassword && (
                <Form.Text className='text-danger'>
                  New and old passwords are the same
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Repeat new password</Form.Label>
              <Form.Control
                type='password'
                onChange={e => setRepeatNewPassword(e.target.value)}
              />
              {passwordsDontMatch && (
                <Form.Text className='text-danger'>
                  Passwords don't match
                </Form.Text>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant='primary'
            onClick={handleConfirm}
            disabled={!isRequestCompleted}
          >
            {isRequestCompleted ? (
              'Confirm'
            ) : (
              <Spinner animation='border' as='span' size='sm' />
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}
