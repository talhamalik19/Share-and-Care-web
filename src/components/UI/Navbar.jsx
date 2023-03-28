import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Logo from '../../assets/icon.png';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeHospital } from '../../redux/hospital';
import Avatar from 'react-avatar';
import { toast } from 'react-toastify';
import axios from 'axios';
import { GLOBALS } from '../../utils/constants';
import ModalView from './ModalView';

function NavBar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoggedIn, name, email, token } = useSelector(
    (state) => state.hospital
  );

  const [showModal, setShowModal] = useState(false);
  const [modalBody, setModalBody] = useState(null);
  const [modalTitle, setModalTitle] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    dispatch(removeHospital());
    toast.success('Signed out successfully');
    await axios.post(`${GLOBALS.BASE_URL}/hospitals/signout`, {
      email,
      token,
    });
  };

  const deleteAccount = async () => {
    setIsLoading(true);
    await axios
      .post(`${GLOBALS.BASE_URL}/hospitals/delete-account`, {
        email,
        token,
      })
      .then((res) => {
        if (res.data.status === '200') {
          toast.success(res.data.message);
          dispatch(removeHospital());
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDeleteAccount = () => {
    setModalTitle('Delete Account');
    setModalBody(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    setShowModal(true);
  };

  return (
    <>
      <Navbar bg='dark' variant='dark'>
        <Container>
          <Navbar.Brand>
            <img
              alt=''
              src={Logo}
              width='30'
              height='30'
              className='d-inline-block align-top'
            />
            <NavLink
              to='/'
              style={{
                color: 'white',
                textDecoration: 'none',
                marginLeft: '0.5rem',
              }}
            >
              Share & Care
            </NavLink>
          </Navbar.Brand>
          <Navbar.Brand>
            {!isLoggedIn ? (
              <NavLink
                to={location.pathname === '/sign-in' ? '/sign-up' : '/sign-in'}
                style={{
                  color: 'white',
                  fontSize: '1rem',
                }}
              >
                {location.pathname === '/sign-in' ? 'Sign Up' : 'Sign In'}
              </NavLink>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {location.pathname === '/resources' && (
                  <NavLink
                    to='/resource-request'
                    style={{
                      color: 'white',
                      marginRight: '1rem',
                      fontSize: '1rem',
                    }}
                  >
                    Request Resource
                  </NavLink>
                )}
                {location.pathname === '/volunteers' && (
                  <NavLink
                    to='/volunteer-request'
                    style={{
                      color: 'white',
                      marginRight: '1rem',
                      fontSize: '1rem',
                    }}
                  >
                    Request Volunteers
                  </NavLink>
                )}
                {location.pathname === '/' && (
                  <NavLink
                    to='/resources'
                    style={{
                      color: 'white',
                      marginRight: '1rem',
                      fontSize: '1rem',
                    }}
                  >
                    Resources
                  </NavLink>
                )}
                {location.pathname === '/' && (
                  <NavLink
                    to='/volunteers'
                    style={{
                      color: 'white',
                      marginRight: '1rem',
                      fontSize: '1rem',
                    }}
                  >
                    Volunteers
                  </NavLink>
                )}
                <NavDropdown
                  align={{ lg: 'end' }}
                  title={
                    <Avatar name={name} title={name} size={30} round={true} />
                  }
                  menuVariant='dark'
                  id='basic-nav-dropdown'
                >
                  {location.pathname !== '/' && (
                    <>
                      <NavDropdown.Item as={Link} to='/resources'>
                        Resources
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to='/volunteers'>
                        Volunteers
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                    </>
                  )}
                  <NavDropdown.Item as={Link} to='/update-account'>
                    Update Account
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/update-password'>
                    Update Password
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={handleDeleteAccount}>
                    Delete Account
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={handleSignOut}>
                    Sign Out
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
            )}
          </Navbar.Brand>
        </Container>
      </Navbar>
      <ModalView
        modalBody={modalBody}
        modalTitle={modalTitle}
        showModal={showModal}
        setShowModal={setShowModal}
        action2Text='Delete Account'
        action2Function={deleteAccount}
        action2Color='danger'
        isLoading={isLoading}
      />
    </>
  );
}

export default NavBar;
