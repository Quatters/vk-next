import { React, Fragment, useContext } from 'react';
import { Col } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import LoginInfo from '../components/LoginInfo';
import RegistrationForm from '../components/RegistrationForm';
import CurrentUserContext from '../static/js/CurrentUserContext';

export default function SignUp() {
  const { currentUser } = useContext(CurrentUserContext);

  if (currentUser) {
    return <Redirect to={'/me'} />;
  }

  return (
    <Fragment>
      <Col sm={6} md={5} lg={4}>
        <RegistrationForm />
      </Col>
      <Col sm={3} md={4} lg={5}>
        <LoginInfo />
      </Col>
    </Fragment>
  );
}
