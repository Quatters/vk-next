import { React, useState } from 'react';
import { Form } from 'react-bootstrap';

export default function UserSearch(props) {
  const [interval, setInterval] = useState(null);

  function handleChange(event) {
    if (interval) {
      clearInterval(interval);
      setInterval(null);
    }

    const currentInterval = setTimeout(() => {
      props.onSearch(event.target.value);
    }, 600);
    setInterval(currentInterval);
  }

  return (
    <div className='mb-3'>
      <Form.Control placeholder='Search for user...' onChange={handleChange} />
      <Form.Text className='ms-1'>
        Use @ for search by login (e.g. @Quatters) or just type a name
      </Form.Text>
    </div>
  );
}
