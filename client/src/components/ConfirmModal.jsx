import { Fragment, React, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

export default function ConfirmModal(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function handleConfirm() {
    handleClose();
    props.confirmAction();
  }

  return (
    <Fragment>
      <Button
        variant={props.buttonVariant ?? 'primary'}
        style={props.buttonStyle}
        onClick={handleShow}
      >
        {props.openButtonText}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title ?? 'Confirm action'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.text}</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Cancel
          </Button>
          <Button variant='primary' onClick={handleConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}
