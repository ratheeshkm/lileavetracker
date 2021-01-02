import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { Input } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as yup from 'yup';
import { toast, Bounce } from 'react-toastify';
import PulseLoader from 'react-spinners/PulseLoader';

const schema = yup.object().shape({
  userName: yup.string().trim().required('Required').email('Invalid Email')
});

const GeneratePassword = (props) => {
  const { register, handleSubmit, errors } = useForm({
    mode: 'all',
    resolver: yupResolver(schema)
  });
  const onSubmit = async (values) => {
    await props.generatePassword(values).then((result) => {
      if (result === 'NotExists') {
        toast("Email doesn't exists", {
          transition: Bounce,
          closeButton: true,
          autoClose: 5000,
          position: 'top-right',
          type: 'error'
        });
      } else if (result === 'Error') {
        toast('Something went wrong - Contact administrator', {
          transition: Bounce,
          closeButton: true,
          autoClose: 5000,
          position: 'top-right',
          type: 'error'
        });
      } else {
        props.setLoginStep('login');
      }
    });
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Form.Group controlId="userName">
            <Form.Label>User Name</Form.Label>
            <Input
              type="text"
              name="userName"
              innerRef={register}
              invalid={!!errors.userName}
              data-testid="userName"
              placeholder="Email"
              autoComplete="off"
            />
            <div className="text-danger">
              {errors.userName && errors.userName.message}
            </div>
          </Form.Group>
          <Form.Group controlId="generatePass">
            {!props.loading && (
              <Button
                variant="primary"
                type="submit"
                disabled={props.loading}
                className="float-right"
              >
                Generate Password
              </Button>
            )}
            <div className="float-right">
              <PulseLoader
                css=""
                size={20}
                color="#007bff"
                loading={props.loading}
              />
            </div>
          </Form.Group>
        </div>
      </Form>
    </>
  );
};

export default GeneratePassword;
