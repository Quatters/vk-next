import { Fragment, React, useContext } from 'react';
import { Col, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import ConfirmModal from './ConfirmModal';
import { useHistory } from 'react-router-dom';
import { signOut } from '../static/js/api-calls';
import CurrentUserContext from '../static/js/CurrentUserContext';
import '../static/css/shared.css';

export default function Sidebar() {
  const history = useHistory();
  const { currentUser, refreshCurrentUser } = useContext(CurrentUserContext);

  async function handleSignOut() {
    await signOut();
    refreshCurrentUser();
    history.push('/signin');
  }

  return (
    <div style={{ width: 'auto' }} sm={3} md={2} className='hide-on-sm'>
      <Nav className='flex-column' variant=''>
        <Nav.Item>
          <LinkContainer to='/me'>
            <Nav.Link>My page</Nav.Link>
          </LinkContainer>
        </Nav.Item>
        <Nav.Item>
          <LinkContainer to='/messenger'>
            <Nav.Link>Messenger</Nav.Link>
          </LinkContainer>
        </Nav.Item>
        <Nav.Item>
          <LinkContainer to='/users'>
            <Nav.Link>Users</Nav.Link>
          </LinkContainer>
        </Nav.Item>
        {currentUser ? (
          <Nav.Item className='mt-2'>
            <div className='d-flex'>
              <ConfirmModal
                openButtonText='Sign Out'
                text='Are you sure you want to leave your account?'
                confirmAction={handleSignOut}
                buttonVariant={'link'}
                buttonStyle={{
                  textDecoration: 'none',
                  padding: '1rem',
                  margin: '0',
                  outline: 'none !important',
                }}
              />
            </div>
          </Nav.Item>
        ) : (
          <Nav.Item className='mt-3'>
            <LinkContainer to='/signin'>
              <Nav.Link>Sign In</Nav.Link>
            </LinkContainer>
          </Nav.Item>
        )}
      </Nav>
    </div>
  );
}
