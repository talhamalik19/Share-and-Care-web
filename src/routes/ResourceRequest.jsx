import React, { useState } from 'react';
import { Container, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { GLOBALS } from '../utils/constants';
import { useNavigate, useLocation } from 'react-router-dom';
import ModalView from '../components/UI/ModalView';
import LabeledInput from '../components/UI/LabeledInput';
import { toast } from 'react-toastify';
import ButtonView from '../components/UI/ButtonView';
import { useSelector } from 'react-redux';

export default function ResourceRequest() {
  const navigate = useNavigate();
  const location = useLocation();

  const { activeResource } = location.state ?? {};

  const { email, name, phone, address } = useSelector(
    (state) => state.hospital
  );

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [record, setRecord] = useState({
    userType: 'hospital',
    id: activeResource?._id ?? '',
    resourceName: activeResource?.resourceName ?? '',
    resourceQuantity: activeResource?.resourceQuantity ?? '',
    resourceDuration: activeResource?.resourceDuration ?? '',
    resourceNotes: activeResource?.resourceNotes ?? '',
    requestedByName: name,
    requestedByEmail: email,
    requestedByPhone: phone,
    requestedByAddress: address,
  });

  const [originalRecord] = useState(activeResource ?? {});

  const checkInputs = () => {
    if (record.resourceName.trim().length < 3) {
      setModalTitle('Invalid Resource Name');
      setModalBody('Resource Name must be at least 3 characters long');
      return false;
    }
    if (record.resourceQuantity.trim().length < 1) {
      setModalTitle('Invalid Resource Quantity');
      setModalBody('Resource Quantity must be at least 1 characters long');
      return false;
    }
    if (record.resourceDuration.trim().length < 1) {
      setModalTitle('Invalid Resource Duration');
      setModalBody('Resource Duration must be at least 1 characters long');
      return false;
    }
    return true;
  };

  const checkIfChanged = () => {
    if (
      record.resourceName === originalRecord.resourceName &&
      record.resourceQuantity === originalRecord.resourceQuantity &&
      record.resourceDuration === originalRecord.resourceDuration &&
      record.resourceNotes === originalRecord.resourceNotes
    ) {
      setModalTitle('No Changes');
      setModalBody('No changes were made to the resource request');
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (checkInputs()) {
      try {
        setIsLoading(true);
        const response = await axios.post(
          `${GLOBALS.BASE_URL}/resources/postRequest`,
          record
        );
        setIsLoading(false);
        if (response.data.status === '201') {
          toast.success(response.data.message);
          navigate('/resources');
        } else {
          toast.error(response.data.message);
        }
      } catch (err) {
        toast.warning(err.message);
      }
    } else {
      setShowModal(true);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (checkInputs() && checkIfChanged()) {
      try {
        setIsLoading(true);
        const response = await axios.post(
          `${GLOBALS.BASE_URL}/resources/updateRequest`,
          record
        );
        setIsLoading(false);
        if (response.data.status === '200') {
          toast.success(response.data.message);
          navigate('/resources');
        } else {
          if (response.data.status === '409') {
            navigate('/resources');
          }
          toast.warning(response.data.message);
        }
      } catch (err) {
        console.log(err);
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
          <h3 className='text-center mb-3'>
            {record.id !== '' ? 'Update' : 'New'} Resource Request
          </h3>
          <Form onSubmit={record.id !== '' ? handleUpdate : handleSubmit}>
            <LabeledInput
              label='Name *'
              controlId={'resourceName'}
              type='text'
              name='resourceName'
              value={record.resourceName}
              onChange={handleChange}
              required
              minLength={3}
              maxLength={15}
              placeholder='Blood Bags'
              bottomText={
                record.id !== '' ? null : 'Use one form for each resource'
              }
            />
            <Row>
              <LabeledInput
                label='Quantity *'
                controlId={'resourceQuantity'}
                type='text'
                name='resourceQuantity'
                value={record.resourceQuantity}
                onChange={handleChange}
                required
                placeholder='10'
                minLength={1}
                maxLength={3}
                containerAs={Col}
              />
              <LabeledInput
                label='Duration *'
                controlId='resourceDuration'
                type='text'
                name='resourceDuration'
                value={record.resourceDuration}
                onChange={(e) => handleChange(e)}
                placeholder='3 days'
                required
                minLength={3}
                maxLength={10}
                containerAs={Col}
              />
            </Row>

            <LabeledInput
              controlId='resourceNotes'
              label='Additional Notes'
              type='text-area'
              as='textarea'
              style={{ height: '100px' }}
              name='resourceNotes'
              value={record.resourceNotes}
              onChange={(e) => handleChange(e)}
              placeholder=''
              maxLength={200}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <ButtonView variant='primary' isLoading={isLoading} type='submit'>
                {record.id !== '' ? 'Update Request' : 'Submit'}
              </ButtonView>
            </div>
          </Form>
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
