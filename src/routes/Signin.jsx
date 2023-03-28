import React, { useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import axios from 'axios';
import { GLOBALS } from '../utils/constants';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setHospital } from '../redux/hospital';
import ModalView from '../components/UI/ModalView';
import LabeledInput from '../components/UI/LabeledInput';
import { toast } from 'react-toastify';
import ButtonView from '../components/UI/ButtonView';

export default function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [record, setRecord] = useState({
    email: '',
    password: '',
  });

  const checkInputs = () => {
    if (record.email.trim().length < 9) {
      setModalTitle('Invalid Email');
      setModalBody('Email must be at least 9 characters long');
      return false;
    }
    if (!record.email.includes('@') || !record.email.endsWith('.com')) {
      setModalTitle('Invalid Email');
      setModalBody('Email must contain @ and end with .com');
      return false;
    }
    if (record.password.trim().length < 6) {
      setModalTitle('Invalid Password');
      setModalBody('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const [showPassword, setShowPassword] = React.useState(false);

  const handleChange = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (checkInputs()) {
      try {
        setIsLoading(true);
        const response = await axios.post(
          `${GLOBALS.BASE_URL}/hospitals/signin`,
          record
        );
        setIsLoading(false);
        if (response.data.status === '200') {
          dispatch(setHospital(response.data?.hospital));
          navigate('/');
          toast.success(`Signed in as ${record.email}`);
        } else {
          toast.warning(response.data.message);
        }
      } catch (err) {
        toast.warning(err.message);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <Container className='d-flex align-items-center justify-content-center my-3'>
        <div className='w-100' style={{ maxWidth: '400px' }}>
          <h3 className='text-center mb-2'>Sign In</h3>
          <Form onSubmit={handleSubmit}>
            <LabeledInput
              controlId='email'
              label='Email address *'
              type='email'
              name='email'
              value={record.email}
              onChange={(e) => handleChange(e)}
              placeholder=''
              required
              minLength={9}
            />
            <LabeledInput
              controlId='password'
              label='Password *'
              type={showPassword ? 'text' : 'password'}
              name='password'
              value={record.password}
              onChange={(e) => handleChange(e)}
              placeholder=''
              required
              minLength={6}
            />
            <Form.Group className='mb-2' controlId='formBasicCheckbox'>
              <Form.Check
                type='checkbox'
                onChange={() => setShowPassword(!showPassword)}
                label='Show Password'
                style={{
                  fontSize: '0.9rem',
                }}
              />
            </Form.Group>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <ButtonView variant='primary' type='submit' isLoading={isLoading}>
                Submit
              </ButtonView>
            </div>
          </Form>

          <div
            style={{
              fontSize: '0.9rem',
            }}
            className='w-100 text-center mt-2'
          >
            <Link to={'/forgot-password'}>Forgot Password?</Link>
          </div>
        </div>
      </Container>
      <ModalView
        showModal={showModal}
        setShowModal={setShowModal}
        modalTitle={modalTitle}
        modalBody={modalBody}
      />
    </>
  );
}
