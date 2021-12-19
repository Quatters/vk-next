import { Fragment, React, useState, useContext } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { changeName } from '../static/js/api-calls';
import { nameIsCorrect as isCorrect } from '../static/js/validators';
import CurrentUserContext from '../static/js/CurrentUserContext';
import NotificationContext from '../static/js/NotificationContext';

export default function EditNameModal(props) {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');

  const [wrongName, setWrongName] = useState(false);
  const [wrongSurname, setWrongSurname] = useState(false);

  const { refreshCurrentUser } = useContext(CurrentUserContext);
  const { showNotification } = useContext(NotificationContext);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isRequestCompleted, setIsRequestCompleted] = useState(true);

  function handleConfirm() {
    if (allIsCorrect()) {
      setIsRequestCompleted(false);
      changeName(name, surname, props.user.login)
        .then(response => {
          handleClose();
        })
        .catch(error => {
          if (error.response?.status === 403) showNotification(403);
          else if (error.response?.status === 401) showNotification(401);
          else showNotification();
        })
        .finally(() => {
          setIsRequestCompleted(true);
          refreshCurrentUser();
          handleClose();
        });
    }
  }

  function allIsCorrect() {
    const nameIsCorrect = isCorrect(name);
    const surnameIsCorrect = isCorrect(surname);

    setWrongName(!nameIsCorrect);
    setWrongSurname(!surnameIsCorrect);

    return nameIsCorrect && surnameIsCorrect;
  }

  return (
    <Fragment>
      <FontAwesomeIcon
        icon={faEdit}
        size='sm'
        className='text-primary'
        onClick={handleShow}
        style={{ cursor: 'pointer' }}
      />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className='mb-3 mt-0'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                onChange={e => setName(e.target.value)}
                placeholder='Name'
              />
              {wrongName && (
                <Form.Text className='text-danger'>
                  Cannot be empty, may contain only letters and dash
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Last name</Form.Label>
              <Form.Control
                onChange={e => setSurname(e.target.value)}
                placeholder='Last name'
              />
              {wrongSurname && (
                <Form.Text className='text-danger'>
                  Cannot be empty, may contain only letters and dash
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
