import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './login.css';
import { Redirect } from 'react-router-dom';
import GeneratePassword from './GeneratePassword';
import PasswordLogin from './PasswordLogin';

const Login = (props) => {
  const { generatePassword, loginStep } = props;

  if (props.loggedIn) {
    let redirectTo = "/dashboard";
    if(props.user.type === "Approver") {
      redirectTo = "/leaves";
    }
    return <Redirect to={redirectTo} />;
  }

  return (
    <>
      <Container className="login-container">
        <Row className="justify-content-md-center">
          <Col lg="4">
            {loginStep === 'generatePassword' && (
              <GeneratePassword
                generatePassword={generatePassword}
                loading={props.loading}
                setLoginStep={props.setLoginStep}
              />
            )}
            {loginStep === 'login' && (
              <PasswordLogin
                loading={props.loading}
                passwordLogin={props.passwordLogin}
                setLoginStep={props.setLoginStep}
                setLoggedIn={props.setLoggedIn}
              />
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
