import { React, useState } from 'react';
import { Toast } from 'react-bootstrap';

export default function Notification(props) {
  const [show] = useState(props.show);

  return (
    <Toast show={props.show || show} onClose={props.toggleShow}>
      <Toast.Header>
        <strong className='me-auto'>{props.headerText}</strong>
      </Toast.Header>
      <Toast.Body>{props.text}</Toast.Body>
    </Toast>
  );
}
