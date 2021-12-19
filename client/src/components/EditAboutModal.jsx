import { Fragment, React, useState, useContext } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { changeAbout } from '../static/js/api-calls';
import CurrentUserContext from '../static/js/CurrentUserContext';
import NotificationContext from '../static/js/NotificationContext';

export default function EditAboutModal(props) {
  const [show, setShow] = useState(false);
  const [about, setAbout] = useState('');
  const { refreshCurrentUser } = useContext(CurrentUserContext);
  const { showNotification } = useContext(NotificationContext);
  const [isRequestCompleted, setIsRequestCompleted] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  async function handleConfirm() {
    setIsRequestCompleted(false);
    changeAbout(about.trim(), props.user.login)
      .then(response => {
        handleClose();
      })
      .catch(error => {
        if (error.response?.status === 403) showNotification(403);
        else if (error.response?.status === 401) {
          showNotification(401);
        } else showNotification();
      })
      .finally(() => {
        setIsRequestCompleted(true);
        refreshCurrentUser();
        handleClose();
      });
  }

  return (
    <Fragment>
      <FontAwesomeIcon
        icon={faEdit}
        size='xs'
        className='text-primary'
        onClick={handleShow}
        style={{ cursor: 'pointer' }}
      />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control
              onChange={e => setAbout(e.target.value)}
              placeholder='Status'
              autoFocus
            />
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
