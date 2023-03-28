import React, { useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import axios from 'axios';
import { GLOBALS } from '../utils/constants';
import { useNavigate } from 'react-router-dom';
import ModalView from '../components/UI/ModalView';
import LabeledInput from '../components/UI/LabeledInput';
import { toast } from 'react-toastify';
import ButtonView from '../components/UI/ButtonView';

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');

  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoading3, setIsLoading3] = useState(false);

  const [showRPC, setShowRPC] = useState(false);

  const [showPassword, setShowPassword] = React.useState(false);

  const [record, setRecord] = useState({
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
  });

  const checkEmailInputs = () => {
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
    return true;
  };

  const checkOtpInputs = () => {
    if (record.otp.length < 6) {
      setModalTitle('Invalid OTP');
      setModalBody('OTP must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const checkPasswordInputs = () => {
    if (record.password.length < 6) {
      setModalTitle('Invalid Password');
      setModalBody('Password must be at least 6 characters long');
      return false;
    }
    if (record.password !== record.confirmPassword) {
      setModalTitle('Invalid Password');
      setModalBody('Password and Confirm Password must be same');
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (checkEmailInputs()) {
      try {
        setIsLoading1(true);
        const response = await axios.post(
          `${GLOBALS.BASE_URL}/otp/forgotPassword`,
          {
            email: record.email,
            userType: 'hospital',
          }
        );
        setIsLoading1(false);
        if (response.data.status === '200') {
          toast.success(response.data.message);
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

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (checkEmailInputs() && checkOtpInputs()) {
      try {
        setIsLoading2(true);
        const response = await axios.post(`${GLOBALS.BASE_URL}/otp/verifyOtp`, {
          email: record.email,
          userType: 'hospital',
          otp: record.otp,
        });
        setIsLoading2(false);
        if (response.data.status === '200') {
          setShowRPC(true);
          toast.success(response.data.message);
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

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (checkPasswordInputs()) {
      try {
        setIsLoading3(true);
        const response = await axios.post(
          `${GLOBALS.BASE_URL}/otp/resetPassword`,
          {
            email: record.email,
            password: record.password,
            userType: 'hospital',
          }
        );
        setIsLoading3(false);
        if (response.data.status === '200') {
          toast.success(response.data.message);
          navigate('/');
        } else {
          toast.warning(response.data.message);
        }
      } catch (err) {
        toast.warning(err.message);
      }
    }
  };

  return (
    <>
      <Container className='d-flex align-items-center justify-content-center my-3'>
        <div className='w-100' style={{ maxWidth: '400px' }}>
          {!showRPC ? (
            <>
              <h3 className='text-center mb-3'>Forgot Password</h3>
              <Form onSubmit={handleVerifyOTP}>
                <LabeledInput
                  controlId='email'
                  label='Email address *'
                  type='email'
                  name='email'
                  value={record.email}
                  onChange={(e) => handleChange(e)}
                  placeholder='Enter Email here'
                  minLength={9}
                  required
                />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <LabeledInput
                    controlId='otp'
                    label='OTP'
                    type='text'
                    name='otp'
                    value={record.otp}
                    onChange={(e) => handleChange(e)}
                    placeholder='Enter OTP here'
                    maxLength={6}
                    minLength={6}
                    containerStyle={{ width: '70%' }}
                    required
                  />
                  <ButtonView
                    className='ml-3'
                    isLoading={isLoading1}
                    style={{
                      marginTop: '8px',
                    }}
                    variant='secondary'
                    type='button'
                    onClick={handleSendOTP}
                  >
                    Send OTP
                  </ButtonView>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <ButtonView
                    isLoading={isLoading2}
                    variant='primary'
                    type='submit'
                  >
                    Verify OTP
                  </ButtonView>
                </div>
              </Form>
            </>
          ) : (
            <>
              <h3 className='text-center mb-3'>Reset Password</h3>
              <Form onSubmit={handleResetPassword}>
                <LabeledInput
                  controlId='email'
                  label='Email address'
                  type='email'
                  name='email'
                  value={record.email}
                  onChange={(e) => handleChange(e)}
                  placeholder='Enter Email here'
                  minLength={9}
                  disabled
                />
                <LabeledInput
                  controlId='password'
                  label='New Password *'
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  value={record.password}
                  onChange={(e) => handleChange(e)}
                  placeholder='Enter New Password here'
                  minLength={6}
                  required
                />
                <LabeledInput
                  controlId='confirmPassword'
                  label='Confirm New Password *'
                  type={showPassword ? 'text' : 'password'}
                  name='confirmPassword'
                  value={record.confirmPassword}
                  onChange={(e) => handleChange(e)}
                  placeholder='Enter New Password here'
                  minLength={6}
                  required
                />
                <Form.Group className='mb-2' controlId='showPassword'>
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
                  <ButtonView
                    isLoading={isLoading3}
                    variant='primary'
                    type='submit'
                  >
                    Reset Password
                  </ButtonView>
                </div>
              </Form>
            </>
          )}
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
