import { React, Fragment, useContext } from 'react';
import { Col } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import LoginInfo from '../components/LoginInfo';
import CurrentUserContext from '../static/js/CurrentUserContext';

export default function SignIn() {
  const { currentUser } = useContext(CurrentUserContext);

  if (currentUser) {
    return <Redirect to={'/me'} />;
  }

  return (
    <Fragment>
      <Col sm={6} md={5} lg={4}>
        <LoginForm />
      </Col>
      <Col sm={6} md={4} lg={5}>
        <LoginInfo />
      </Col>
    </Fragment>
  );
}
