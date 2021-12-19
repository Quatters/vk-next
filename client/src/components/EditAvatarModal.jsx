import { Fragment, React, useState, useContext } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { StyledDropZone } from 'react-drop-zone';
import 'react-drop-zone/dist/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { changeAvatar } from '../static/js/api-calls';
import CurrentUserContext from '../static/js/CurrentUserContext';
import NotificationContext from '../static/js/NotificationContext';

export default function EditAvatarModal(props) {
  const [show, setShow] = useState(false);
  const [wrongFileFormat, setWrongFileFormat] = useState(false);
  const [image, setImage] = useState(null);
  const { currentUser, refreshCurrentUser } = useContext(CurrentUserContext);
  const { showNotification } = useContext(NotificationContext);
  const [isRequestCompleted, setIsRequestCompleted] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  async function handleConfirm() {
    setIsRequestCompleted(false);
    const base64 = await convertIntoBase64(image.file);
    changeAvatar(base64, currentUser.login)
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
        handleClose();
        refreshCurrentUser();
      });
  }

  function handleClearAvatar() {
    setIsRequestCompleted(false);
    changeAvatar('', currentUser.login)
      .then(response => {
        refreshCurrentUser();
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

  function handleUpload(file, text) {
    if (!file?.type || !/^image\/.*$/.test(file.type)) {
      setWrongFileFormat(true);
      return;
    }
    const preview = URL.createObjectURL(file);
    setWrongFileFormat(false);
    setImage({ file, preview });
  }

  function handleClear() {
    setImage(null);
  }

  async function convertIntoBase64(imageFile) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result);
      };
      reader.readAsDataURL(imageFile);
    });
  }

  return (
    <Fragment>
      <Button variant='primary' onClick={handleShow} className='mt-3 w-100'>
        Edit
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit avatar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {image ? (
            <div className='d-flex justify-content-center'>
              <img width='200' src={image.preview} alt='Avatar' />
            </div>
          ) : (
            <div className='mb-2'>
              <StyledDropZone onDrop={handleUpload} accept='image/*' />
            </div>
          )}
          {wrongFileFormat && (
            <small className='text-danger'>
              Invalid file format. Please, upload an image (.png, .jpg, etc)
            </small>
          )}
        </Modal.Body>
        <Modal.Footer className='d-flex'>
          <Button
            variant='danger'
            className='me-auto'
            onClick={handleClearAvatar}
          >
            Clear avatar
          </Button>
          {image && (
            <Button variant='secondary' onClick={handleClear}>
              <FontAwesomeIcon icon={faUndo} />
            </Button>
          )}
          <Button
            variant='primary'
            disabled={!image || !isRequestCompleted}
            onClick={handleConfirm}
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
