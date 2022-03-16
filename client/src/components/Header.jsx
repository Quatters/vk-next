import { React, useContext } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import EditPasswordModal from './EditPasswordModal';
import { Link } from 'react-router-dom';
import '../static/css/shared.css';
import CurrentUserContext from '../static/js/CurrentUserContext';
import { useHistory } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { signOut } from '../static/js/api-calls';
import ConfirmModal from './ConfirmModal';

export default function Header() {
  const { currentUser, refreshCurrentUser } = useContext(CurrentUserContext);
  const history = useHistory();

  async function handleSignOut() {
    await signOut();
    refreshCurrentUser();
    history.push('/signin');
  }

  return (
    <div>
      <Navbar bg='light' expand='md'>
        <Container fluid='lg'>
          <Navbar.Brand className='ms-3'>VK Next</Navbar.Brand>
          <Navbar.Toggle aria-controls='navbarScroll' />
          <Navbar.Collapse className='pt-md-0 pt-2'>
            <Link to='/me' className='nav-link show-on-sm'>
              My page
            </Link>
            {/* <Link to='/messenger' className='nav-link show-on-sm'>
              Messenger
            </Link> */}
            <Link to='/users' className='nav-link show-on-sm'>
              Users
            </Link>
            <div className='ms-auto ps-3 py-2'>
              {currentUser && <EditPasswordModal />}
            </div>
            {currentUser ? (
              <Nav.Item className='show-on-sm'>
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
              <Nav.Item className='show-on-sm'>
                <LinkContainer to='/signin'>
                  <Nav.Link>Sign In</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
