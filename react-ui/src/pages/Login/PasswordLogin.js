import React, { Fragment } from "react";
import { Form, Button } from "react-bootstrap";
import { Input } from 'reactstrap'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers';
import * as yup from 'yup';
import { toast, Bounce } from 'react-toastify';
import PulseLoader from "react-spinners/PulseLoader";
import { Redirect } from "react-router-dom";

const schema = yup.object().shape({
	password: yup.string().trim().required('Required')
});

const PasswordLogin = (props) => {
	const { register, handleSubmit, errors } = useForm({	mode: 'all', resolver: yupResolver(schema),});
  const onSubmit = async (values) => {
    console.log("Values", values)
		await props.passwordLogin(values)
		.then((result) => {
      if(result === 'Error') {
        toast("Incorrect Password", {
          transition: Bounce,
          closeButton: true,
          autoClose: 5000,
          position: 'top-right',
          type: 'error'
        })
      } else {
        props.setLoginStep('dashboard');
        props.setLoggedIn(true);
        return <Redirect to={`/dashboard`} />
      }
		})
	}
  const backToGeneratePassword = () => {
    props.setLoginStep('generatePassword');
  }
  return (
    <Fragment>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div>
            <Form.Group controlId="userName">
            <Form.Label>One time password</Form.Label>
            <Input
              type="password"
              name="password"
              innerRef={register}
              invalid={!!errors.password}
              data-testid="password"
              placeholder="Password"
              autoComplete="off"
            />
            <div className="text-danger">
              {errors.password && errors.password.message}
            </div>
            </Form.Group>
            <Form.Group controlId="generatePass">
              {
                !props.loading && <Button variant="primary" type="submit" disabled={props.loading} className="float-right">
                  Login
                </Button>
              }
              <div className="float-left"><button className="mb-2 mr-2 btn btn-link active" onClick={backToGeneratePassword}>Back</button></div>
              <div className="float-right">
                <PulseLoader
                  css=""
                  size={20}
                  color={"#007bff"}
                  loading={props.loading}
                />
              </div>
            </Form.Group>
          </div>
      </Form>
    </Fragment>
  );
};

export default PasswordLogin;