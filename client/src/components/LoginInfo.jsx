import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default function LoginInfo() {
  return (
    <Card>
      <Card.Body>
        <Card.Title>To use VK Next please sign in.</Card.Title>
        <LinkContainer to='/signin'>
          <div>
            <Button className='mt-1'>Sign In</Button>
          </div>
        </LinkContainer>
        <Card.Title className='mt-4'>Do not have an account?</Card.Title>
        <LinkContainer to='/signup'>
          <div>
            <Button className='mt-1'>Sign Up</Button>
          </div>
        </LinkContainer>
      </Card.Body>
    </Card>
  );
}
