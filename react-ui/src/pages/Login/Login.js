import React, { Fragment } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./login.css";
import { Redirect } from "react-router-dom";
import GeneratePassword from './GeneratePassword';
import PasswordLogin from './PasswordLogin';

const Login = (props) => {
  const { generatePassword, loginStep } = props;
  
	if(props.loggedIn) {
		return <Redirect to={`/dashboard`} />
	}
	
  return (
    <Fragment>
      <Container className="login-container">
        <Row className="justify-content-md-center">
          <Col lg="4">
              {
                loginStep === 'generatePassword' && <GeneratePassword generatePassword={generatePassword} loading={props.loading} setLoginStep={props.setLoginStep}/>
              }
              {
                loginStep === 'login' && <PasswordLogin loading={props.loading} passwordLogin={props.passwordLogin} setLoginStep={props.setLoginStep} setLoggedIn={props.setLoggedIn}/>
              }
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Login;