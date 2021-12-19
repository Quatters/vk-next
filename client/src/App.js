import { React, useState, useEffect } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from 'react-router-dom';
import Header from './components/Header';
import PersonalPage from './routes/PersonalPage';
import { Container, Row, Spinner, ToastContainer } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import SignIn from './routes/SignIn';
import SignUp from './routes/SignUp';
import Users from './routes/Users';
import { getUser } from './static/js/api-calls';
import axios from 'axios';
import CurrentUserContext from './static/js/CurrentUserContext';
import NotificationContext from './static/js/NotificationContext';
import Notification from './components/Notification';
import Home from './routes/Home';

require('dotenv').config();

axios.defaults.withCredentials = true;

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRequestCompleted, setUserRequestCompleted] = useState(false);
  const [notificationShowed, setNotificationShowed] = useState(false);
  const [notificationText, setNotificationText] = useState('');
  const [notificationHeader, setNotificationHeader] = useState('');

  useEffect(() => {
    getUser('me', 10)
      .then(response => {
        setCurrentUser(response.data);
      })
      .catch(error => {})
      .finally(() => {
        setUserRequestCompleted(true);
      });
  }, []);

  const refreshCurrentUser = async limit => {
    limit = limit ?? 10;

    await getUser('me', limit)
      .then(response => {
        setCurrentUser(response.data);
      })
      .catch(error => {
        showErrorNotification(error.response?.status);
        setCurrentUser(null);
      })
      .finally(() => {
        setUserRequestCompleted(true);
      });
  };

  const showErrorNotification = (errorCode, message, header) => {
    if (!errorCode) {
      if (!message) {
        setNotificationText('Unknown error.');
        setNotificationHeader('Error');
      } else {
        setNotificationText(message);
        setNotificationHeader(header);
      }
    } else {
      setNotificationHeader('Error');
      if (errorCode === 403)
        setNotificationText('You are not allowed to modify this user.');
      else if (errorCode === 401)
        setNotificationText('You are not authorized.');
    }

    setNotificationShowed(true);

    setTimeout(() => {
      setNotificationShowed(false);
    }, 5200);
  };

  if (!currentUser && !userRequestCompleted)
    return (
      <div className='d-flex justify-content-center mt-5 pt-5'>
        <Spinner animation='border' variant='primary' />
      </div>
    );

  return (
    <Router>
      <CurrentUserContext.Provider value={{ currentUser, refreshCurrentUser }}>
        <NotificationContext.Provider
          value={{ showNotification: showErrorNotification }}
        >
          <ToastContainer
            className='p-4 notification-container position-fixed'
            style={{ zIndex: '100' }}
            position='bottom-end'
          >
            <Notification
              headerText={notificationHeader}
              text={notificationText}
              show={notificationShowed}
              toggleShow={() => setNotificationShowed(!notificationShowed)}
            />
          </ToastContainer>
          <Header />
          <Container className='mt-4'>
            <Row>
              <Sidebar />
              <Switch>
                <Route exact path='/' component={Home} />

                <Route exact path='/me' component={PersonalPage} />
                <Route exact path='/users/:login' component={PersonalPage} />

                <Route exact path='/users' component={Users} />

                <Route exact path='/signin' component={SignIn} />
                <Route exact path='/signup' component={SignUp} />
              </Switch>
            </Row>
          </Container>
        </NotificationContext.Provider>
      </CurrentUserContext.Provider>
    </Router>
  );
}

export default App;
